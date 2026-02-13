-- Rate limiting for bookings
-- Prevents users from creating too many booking requests

-- Function to check if user can create a booking (max 3 pending per day)
create or replace function public.can_create_booking(user_uuid uuid)
returns boolean
language plpgsql
security definer
as $$
declare
  pending_count integer;
  recent_count integer;
begin
  -- Count pending bookings for user
  select count(*) into pending_count
  from public.bookings
  where user_id = user_uuid
  and status = 'pending';
  
  -- Max 1 pending booking at a time
  if pending_count >= 1 then
    return false;
  end if;
  
  -- Count bookings created in last 24 hours
  select count(*) into recent_count
  from public.bookings
  where user_id = user_uuid
  and created_at > now() - interval '24 hours';
  
  -- Max 5 booking attempts per day
  if recent_count >= 5 then
    return false;
  end if;
  
  return true;
end;
$$;

-- Update the insert policy to include rate limiting
drop policy if exists "Authenticated users can create bookings" on public.bookings;

create policy "Authenticated users can create bookings with rate limit" on public.bookings
  for insert with check (
    auth.uid() = user_id 
    and public.can_create_booking(auth.uid())
  );

-- Add index for faster rate limit checks
create index if not exists idx_bookings_user_created 
  on public.bookings(user_id, created_at);
