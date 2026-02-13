export type SlotDuration =
  | '4 timmar'
  | '8 timmar'
  | '12 timmar'
  | '24 timmar'
  | '2 dagar'
  | '1 vecka';

export type SlotStatus = 'available' | 'booked' | 'completed' | 'cancelled';

export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed';

export interface Profile {
  id: string;
  email: string;
  phone: string;
  full_name: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Slot {
  id: string;
  date: string;
  start_time: string;
  duration: SlotDuration;
  status: SlotStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  slot_id: string;
  user_id: string;
  status: BookingStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface BookingWithSlot extends Booking {
  slot: Slot;
}

export interface SlotWithBooking extends Slot {
  booking_id: string | null;
  booked_by: string | null;
  booking_status: BookingStatus | null;
  booker_email: string | null;
  booker_phone: string | null;
  booker_name: string | null;
  booker_previous_loans: number;
}

export interface CreateSlotInput {
  date: string;
  start_time: string;
  duration: SlotDuration;
  notes?: string;
}

export interface CreateBookingInput {
  slot_id: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  phone: string;
  full_name?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
