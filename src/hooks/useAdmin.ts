/**
 * NOTE: Contains DEMO MODE code - search for "DEMO MODE" to find and remove
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DEMO_PENDING_REQUESTS, DEMO_ADMIN_STATS } from '../lib/demoData'; // DEMO MODE
import type { SlotWithBooking, BookingStatus } from '../lib/types';
import { useAuth } from './useAuth';

export function useAdminSlots() {
  const { isAdmin } = useAuth();

  return useQuery({
    queryKey: ['admin', 'slots'],
    queryFn: async () => {
      // DEMO MODE
      if (!isSupabaseConfigured) {
        return DEMO_PENDING_REQUESTS;
      }

      const { data, error } = await supabase
        .from('slots_with_bookings')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      return data as SlotWithBooking[];
    },
    enabled: isAdmin,
  });
}

export function usePendingBookings() {
  const { isAdmin } = useAuth();

  return useQuery({
    queryKey: ['admin', 'bookings', 'pending'],
    queryFn: async () => {
      // DEMO MODE
      if (!isSupabaseConfigured) {
        return DEMO_PENDING_REQUESTS;
      }

      const { data, error } = await supabase
        .from('slots_with_bookings')
        .select('*')
        .eq('booking_status', 'pending')
        .order('date', { ascending: true });

      if (error) throw error;
      return data as SlotWithBooking[];
    },
    enabled: isAdmin,
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bookingId,
      status,
      slotId,
    }: {
      bookingId: string;
      status: BookingStatus;
      slotId: string;
    }) => {
      // DEMO MODE
      if (!isSupabaseConfigured) {
        const request = DEMO_PENDING_REQUESTS.find((r) => r.booking_id === bookingId);
        if (request) {
          request.booking_status = status;
          if (status === 'approved') request.status = 'booked';
        }
        return;
      }

      const { error: bookingError } = await supabase
        .from('bookings')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', bookingId);

      if (bookingError) throw bookingError;

      if (status === 'approved') {
        const { error: slotError } = await supabase
          .from('slots')
          .update({ status: 'booked', updated_at: new Date().toISOString() })
          .eq('id', slotId);

        if (slotError) throw slotError;
      }

      if (status === 'rejected') {
        const { error: slotError } = await supabase
          .from('slots')
          .update({ status: 'available', updated_at: new Date().toISOString() })
          .eq('id', slotId);

        if (slotError) throw slotError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

export function useAdminStats() {
  const { isAdmin } = useAuth();

  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      // DEMO MODE
      if (!isSupabaseConfigured) {
        return DEMO_ADMIN_STATS;
      }

      const today = new Date().toISOString().split('T')[0];

      const [slotsResult, pendingResult, completedResult] = await Promise.all([
        supabase
          .from('slots')
          .select('id', { count: 'exact' })
          .eq('status', 'available')
          .gte('date', today),
        supabase
          .from('bookings')
          .select('id', { count: 'exact' })
          .eq('status', 'pending'),
        supabase
          .from('bookings')
          .select('id', { count: 'exact' })
          .eq('status', 'completed'),
      ]);

      return {
        availableSlots: slotsResult.count ?? 0,
        pendingRequests: pendingResult.count ?? 0,
        completedLoans: completedResult.count ?? 0,
      };
    },
    enabled: isAdmin,
  });
}
