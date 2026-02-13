-- Notification trigger for booking status changes
-- This creates the database trigger; the Edge Function must be deployed separately

-- Create a table to queue notifications (for Edge Function to process)
create table if not exists public.notification_queue (
  id uuid default uuid_generate_v4() primary key,
  booking_id uuid references public.bookings on delete cascade not null,
  notification_type text not null check (notification_type in ('booking_approved', 'booking_rejected')),
  recipient_email text not null,
  recipient_name text,
  slot_date date not null,
  slot_time time not null,
  slot_duration text not null,
  processed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.notification_queue enable row level security;

-- Only allow service role to access notifications
create policy "Service role only" on public.notification_queue
  for all using (false);

-- Function to queue notification when booking status changes
create or replace function public.queue_booking_notification()
returns trigger
language plpgsql
security definer
as $$
declare
  v_slot record;
  v_profile record;
  v_notification_type text;
begin
  -- Only trigger on status change to approved or rejected
  if NEW.status not in ('approved', 'rejected') then
    return NEW;
  end if;
  
  -- Only trigger if status actually changed
  if OLD.status = NEW.status then
    return NEW;
  end if;
  
  -- Get slot info
  select * into v_slot from public.slots where id = NEW.slot_id;
  
  -- Get user profile
  select * into v_profile from public.profiles where id = NEW.user_id;
  
  -- Determine notification type
  v_notification_type := case 
    when NEW.status = 'approved' then 'booking_approved'
    when NEW.status = 'rejected' then 'booking_rejected'
  end;
  
  -- Queue the notification
  insert into public.notification_queue (
    booking_id,
    notification_type,
    recipient_email,
    recipient_name,
    slot_date,
    slot_time,
    slot_duration
  ) values (
    NEW.id,
    v_notification_type,
    v_profile.email,
    v_profile.full_name,
    v_slot.date,
    v_slot.start_time,
    v_slot.duration
  );
  
  return NEW;
end;
$$;

-- Create trigger
drop trigger if exists on_booking_status_change on public.bookings;
create trigger on_booking_status_change
  after update on public.bookings
  for each row execute procedure public.queue_booking_notification();

-- Index for processing notifications
create index if not exists idx_notification_queue_processed 
  on public.notification_queue(processed, created_at);
