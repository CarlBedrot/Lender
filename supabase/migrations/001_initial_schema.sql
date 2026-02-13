-- Lender Initial Schema
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  phone text not null,
  full_name text,
  is_admin boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Available time slots (created by admin)
create table public.slots (
  id uuid default uuid_generate_v4() primary key,
  date date not null,
  start_time time not null,
  duration text not null check (duration in ('4 timmar', '8 timmar', '12 timmar', '24 timmar', '2 dagar', '1 vecka')),
  status text default 'available' check (status in ('available', 'booked', 'completed', 'cancelled')),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  -- Constraint: only one slot per day
  unique(date)
);

-- Booking requests
create table public.bookings (
  id uuid default uuid_generate_v4() primary key,
  slot_id uuid references public.slots on delete cascade not null,
  user_id uuid references public.profiles on delete cascade not null,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected', 'cancelled', 'completed')),
  admin_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  -- Constraint: one booking per slot
  unique(slot_id)
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.slots enable row level security;
alter table public.bookings enable row level security;

-- Profiles policies
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Admin can view all profiles" on public.profiles
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- Slots policies (anyone can read, only admin can write)
create policy "Anyone can view available slots" on public.slots
  for select using (true);

create policy "Admin can insert slots" on public.slots
  for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

create policy "Admin can update slots" on public.slots
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

create policy "Admin can delete slots" on public.slots
  for delete using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- Bookings policies
create policy "Users can view own bookings" on public.bookings
  for select using (auth.uid() = user_id);

create policy "Admin can view all bookings" on public.bookings
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

create policy "Authenticated users can create bookings" on public.bookings
  for insert with check (auth.uid() = user_id);

create policy "Users can update own pending bookings" on public.bookings
  for update using (auth.uid() = user_id and status = 'pending');

create policy "Admin can update any booking" on public.bookings
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, phone, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to get user's booking count (for repeat user badge)
create or replace function public.get_user_booking_count(user_uuid uuid)
returns integer
language sql
security definer
as $$
  select count(*)::integer
  from public.bookings
  where user_id = user_uuid
  and status in ('approved', 'completed');
$$;

-- View for slots with booking info (for admin)
create or replace view public.slots_with_bookings as
select
  s.*,
  b.id as booking_id,
  b.user_id as booked_by,
  b.status as booking_status,
  p.email as booker_email,
  p.phone as booker_phone,
  p.full_name as booker_name,
  public.get_user_booking_count(b.user_id) as booker_previous_loans
from public.slots s
left join public.bookings b on s.id = b.slot_id
left join public.profiles p on b.user_id = p.id;

-- Grant access to the view
grant select on public.slots_with_bookings to authenticated;

-- Create index for faster queries
create index idx_slots_date on public.slots(date);
create index idx_slots_status on public.slots(status);
create index idx_bookings_user_id on public.bookings(user_id);
create index idx_bookings_status on public.bookings(status);
