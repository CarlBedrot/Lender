/**
 * ============================================
 * DEMO MODE - REMOVE BEFORE PRODUCTION
 * ============================================
 * This file provides mock data for previewing the UI without Supabase.
 * Delete this file and remove all references when connecting to real backend.
 */

import type { Slot, Profile, BookingWithSlot, SlotWithBooking } from './types';

// Demo user - acts as logged in user
export const DEMO_USER: Profile = {
  id: 'demo-user-123',
  email: 'demo@example.com',
  phone: '070-123 45 67',
  full_name: 'Demo Användare',
  is_admin: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Demo admin user
export const DEMO_ADMIN: Profile = {
  id: 'demo-admin-456',
  email: 'admin@example.com',
  phone: '070-987 65 43',
  full_name: 'Admin Användare',
  is_admin: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Helper to get future dates
function getFutureDate(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
}

// Demo slots
export const DEMO_SLOTS: Slot[] = [
  {
    id: 'slot-1',
    date: getFutureDate(1),
    start_time: '08:00:00',
    duration: '8 timmar',
    status: 'available',
    notes: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'slot-2',
    date: getFutureDate(3),
    start_time: '14:00:00',
    duration: '4 timmar',
    status: 'available',
    notes: 'Hämta vid Triangeln',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'slot-3',
    date: getFutureDate(5),
    start_time: '06:00:00',
    duration: '24 timmar',
    status: 'available',
    notes: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'slot-4',
    date: getFutureDate(7),
    start_time: '10:00:00',
    duration: '2 dagar',
    status: 'available',
    notes: 'Helgresa',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Demo user's bookings
export const DEMO_MY_BOOKINGS: BookingWithSlot[] = [
  {
    id: 'booking-1',
    slot_id: 'slot-old-1',
    user_id: DEMO_USER.id,
    status: 'completed',
    admin_notes: null,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    slot: {
      id: 'slot-old-1',
      date: getFutureDate(-7),
      start_time: '09:00:00',
      duration: '8 timmar',
      status: 'completed',
      notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: 'booking-2',
    slot_id: 'slot-pending-1',
    user_id: DEMO_USER.id,
    status: 'pending',
    admin_notes: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    slot: {
      id: 'slot-pending-1',
      date: getFutureDate(2),
      start_time: '12:00:00',
      duration: '4 timmar',
      status: 'available',
      notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
];

// Demo pending requests (for admin view)
export const DEMO_PENDING_REQUESTS: SlotWithBooking[] = [
  {
    id: 'slot-req-1',
    date: getFutureDate(2),
    start_time: '09:00:00',
    duration: '8 timmar',
    status: 'available',
    notes: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    booking_id: 'booking-req-1',
    booked_by: 'user-1',
    booking_status: 'pending',
    booker_email: 'anna@example.com',
    booker_phone: '070-111 22 33',
    booker_name: 'Anna Andersson',
    booker_previous_loans: 3,
  },
  {
    id: 'slot-req-2',
    date: getFutureDate(4),
    start_time: '14:00:00',
    duration: '4 timmar',
    status: 'available',
    notes: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    booking_id: 'booking-req-2',
    booked_by: 'user-2',
    booking_status: 'pending',
    booker_email: 'erik@example.com',
    booker_phone: '070-444 55 66',
    booker_name: 'Erik Eriksson',
    booker_previous_loans: 0,
  },
];

// Demo stats for admin
export const DEMO_ADMIN_STATS = {
  availableSlots: DEMO_SLOTS.length,
  pendingRequests: DEMO_PENDING_REQUESTS.length,
  completedLoans: 12,
};
