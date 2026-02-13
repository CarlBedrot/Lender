/**
 * NOTE: Contains DEMO MODE code - search for "DEMO MODE" to find and remove
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DEMO_SLOTS } from '../lib/demoData'; // DEMO MODE
import type { Slot, CreateSlotInput } from '../lib/types';

export function useAvailableSlots() {
  return useQuery({
    queryKey: ['slots', 'available'],
    queryFn: async () => {
      // DEMO MODE
      if (!isSupabaseConfigured) {
        return DEMO_SLOTS;
      }

      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('slots')
        .select('*')
        .eq('status', 'available')
        .gte('date', today)
        .order('date', { ascending: true });

      if (error) throw error;
      return data as Slot[];
    },
  });
}

export function useSlot(slotId: string | undefined) {
  return useQuery({
    queryKey: ['slots', slotId],
    queryFn: async () => {
      if (!slotId) throw new Error('Slot ID required');

      // DEMO MODE
      if (!isSupabaseConfigured) {
        const slot = DEMO_SLOTS.find((s) => s.id === slotId);
        if (!slot) throw new Error('Slot not found');
        return slot;
      }

      const { data, error } = await supabase
        .from('slots')
        .select('*')
        .eq('id', slotId)
        .single();

      if (error) throw error;
      return data as Slot;
    },
    enabled: !!slotId,
  });
}

export function useCreateSlot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateSlotInput) => {
      // DEMO MODE
      if (!isSupabaseConfigured) {
        const newSlot: Slot = {
          id: `slot-${Date.now()}`,
          ...input,
          status: 'available',
          notes: input.notes || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        DEMO_SLOTS.push(newSlot);
        return newSlot;
      }

      const { data, error } = await supabase
        .from('slots')
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data as Slot;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
  });
}

export function useDeleteSlot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (slotId: string) => {
      // DEMO MODE
      if (!isSupabaseConfigured) {
        const index = DEMO_SLOTS.findIndex((s) => s.id === slotId);
        if (index > -1) DEMO_SLOTS.splice(index, 1);
        return;
      }

      const { error } = await supabase.from('slots').delete().eq('id', slotId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
  });
}
