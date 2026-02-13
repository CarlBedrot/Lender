/**
 * NOTE: Contains DEMO MODE code - search for "DEMO MODE" to find and remove
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DEMO_MY_BOOKINGS, DEMO_SLOTS } from '../lib/demoData'; // DEMO MODE
import type { Booking, BookingWithSlot, CreateBookingInput } from '../lib/types';
import { useAuth } from './useAuth';

export function useCreateBooking() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (input: CreateBookingInput) => {
      if (!user) throw new Error('Must be logged in');

      // DEMO MODE
      if (!isSupabaseConfigured) {
        // Check for existing active booking
        const hasActiveBooking = DEMO_MY_BOOKINGS.some(
          (b) => b.status === 'pending' || b.status === 'approved'
        );
        if (hasActiveBooking) {
          throw new Error('Du har redan en aktiv bokning. Avboka den först för att boka en ny tid.');
        }

        const slot = DEMO_SLOTS.find((s) => s.id === input.slot_id);
        if (!slot) throw new Error('Slot not found');

        const newBooking: Booking = {
          id: `booking-${Date.now()}`,
          slot_id: input.slot_id,
          user_id: user.id,
          status: 'pending',
          admin_notes: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Add to demo bookings
        DEMO_MY_BOOKINGS.unshift({
          ...newBooking,
          slot,
        });

        return newBooking;
      }

      // Check for existing active booking (pending or approved)
      const { data: existingBookings, error: checkError } = await supabase
        .from('bookings')
        .select('id, status')
        .eq('user_id', user.id)
        .in('status', ['pending', 'approved']);

      if (checkError) throw checkError;

      if (existingBookings && existingBookings.length > 0) {
        throw new Error('Du har redan en aktiv bokning. Avboka den först för att boka en ny tid.');
      }

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          ...input,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

export function useMyBookings() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['bookings', 'mine', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // DEMO MODE
      if (!isSupabaseConfigured) {
        return DEMO_MY_BOOKINGS;
      }

      const { data, error } = await supabase
        .from('bookings')
        .select(
          `
          *,
          slot:slots(*)
        `
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as BookingWithSlot[];
    },
    enabled: !!user,
  });
}

export function useBooking(bookingId: string | undefined) {
  return useQuery({
    queryKey: ['bookings', bookingId],
    queryFn: async () => {
      if (!bookingId) throw new Error('Booking ID required');

      // DEMO MODE
      if (!isSupabaseConfigured) {
        const booking = DEMO_MY_BOOKINGS.find((b) => b.id === bookingId);
        if (!booking) throw new Error('Booking not found');
        return booking;
      }

      const { data, error } = await supabase
        .from('bookings')
        .select(
          `
          *,
          slot:slots(*)
        `
        )
        .eq('id', bookingId)
        .single();

      if (error) throw error;
      return data as BookingWithSlot;
    },
    enabled: !!bookingId,
  });
}

export function useHasActiveBooking() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['bookings', 'hasActive', user?.id],
    queryFn: async () => {
      if (!user) return false;

      // DEMO MODE
      if (!isSupabaseConfigured) {
        return DEMO_MY_BOOKINGS.some(
          (b) => b.status === 'pending' || b.status === 'approved'
        );
      }

      const { data, error } = await supabase
        .from('bookings')
        .select('id')
        .eq('user_id', user.id)
        .in('status', ['pending', 'approved'])
        .limit(1);

      if (error) throw error;
      return data.length > 0;
    },
    enabled: !!user,
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      // DEMO MODE
      if (!isSupabaseConfigured) {
        const booking = DEMO_MY_BOOKINGS.find((b) => b.id === bookingId);
        if (booking) booking.status = 'cancelled';
        return;
      }

      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', bookingId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['slots'] });
    },
  });
}
