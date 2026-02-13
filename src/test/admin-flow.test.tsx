/**
 * Integration tests for the admin flow
 * Tests the admin journey for managing slots and approving bookings
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../context/AuthContext';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import type { SlotWithBooking } from '../lib/types';

// Test data
const mockPendingRequests: SlotWithBooking[] = [
  {
    id: 'slot-1',
    date: '2025-01-20',
    start_time: '08:00:00',
    duration: '8 timmar',
    status: 'available',
    notes: null,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    booking_id: 'booking-1',
    booked_by: 'user-1',
    booking_status: 'pending',
    booker_email: 'customer@example.com',
    booker_phone: '070-123 45 67',
    booker_name: 'Anna Andersson',
    booker_previous_loans: 3,
  },
  {
    id: 'slot-2',
    date: '2025-01-22',
    start_time: '14:00:00',
    duration: '4 timmar',
    status: 'available',
    notes: null,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    booking_id: 'booking-2',
    booked_by: 'user-2',
    booking_status: 'pending',
    booker_email: 'newuser@example.com',
    booker_phone: '070-987 65 43',
    booker_name: 'Erik Eriksson',
    booker_previous_loans: 0,
  },
];

const mockStats = {
  availableSlots: 5,
  pendingRequests: 2,
  completedLoans: 15,
};

// Mock hooks
const mockUpdateStatus = vi.fn();
const mockCreateSlot = vi.fn();

vi.mock('../hooks/useAdmin', () => ({
  usePendingBookings: () => ({
    data: mockPendingRequests,
    isLoading: false,
  }),
  useAdminStats: () => ({
    data: mockStats,
    isLoading: false,
  }),
  useAdminSlots: () => ({
    data: mockPendingRequests,
    isLoading: false,
  }),
  useUpdateBookingStatus: () => ({
    mutate: mockUpdateStatus,
    isPending: false,
  }),
}));

vi.mock('../hooks/useSlots', () => ({
  useCreateSlot: () => ({
    mutateAsync: mockCreateSlot,
    isPending: false,
  }),
}));

// Mock auth with admin user
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'admin-1', email: 'admin@example.com' },
    profile: {
      id: 'admin-1',
      email: 'admin@example.com',
      phone: '070-000 00 00',
      full_name: 'Admin User',
      is_admin: true,
    },
    session: {},
    isLoading: false,
    isAdmin: true,
    isDemoMode: true,
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    demoLogin: vi.fn(),
  }),
}));

vi.mock('../lib/supabase', () => ({
  supabase: {},
  isSupabaseConfigured: false,
}));

function renderAdmin() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/admin']}>
        <AuthProvider>
          <Routes>
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('Admin Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Stats Display', () => {
    it('should display admin title', () => {
      renderAdmin();
      expect(screen.getByRole('heading', { name: 'Admin' })).toBeInTheDocument();
    });

    it('should display available slots count', () => {
      renderAdmin();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('Tillgängliga')).toBeInTheDocument();
    });

    it('should display pending requests count', () => {
      renderAdmin();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('Förfrågningar')).toBeInTheDocument();
    });

    it('should display completed loans count', () => {
      renderAdmin();
      expect(screen.getByText('15')).toBeInTheDocument();
      expect(screen.getByText('Slutförda')).toBeInTheDocument();
    });
  });

  describe('Pending Requests', () => {
    it('should display pending requests section', () => {
      renderAdmin();
      expect(screen.getByText(/nya förfrågningar/i)).toBeInTheDocument();
    });

    it('should display customer information', () => {
      renderAdmin();
      expect(screen.getByText('Anna Andersson')).toBeInTheDocument();
      expect(screen.getByText('customer@example.com')).toBeInTheDocument();
      expect(screen.getByText('070-123 45 67')).toBeInTheDocument();
    });

    it('should display returning user badge', () => {
      renderAdmin();
      expect(screen.getByText('3 lån tidigare')).toBeInTheDocument();
    });

    it('should display new user badge', () => {
      renderAdmin();
      expect(screen.getByText('Ny användare')).toBeInTheDocument();
    });

    it('should display approve and reject buttons', () => {
      renderAdmin();
      const approveButtons = screen.getAllByRole('button', { name: /godkänn/i });
      const rejectButtons = screen.getAllByRole('button', { name: /neka/i });

      expect(approveButtons).toHaveLength(2);
      expect(rejectButtons).toHaveLength(2);
    });
  });

  describe('Approve/Reject Actions', () => {
    it('should call updateStatus with approved when approve is clicked', async () => {
      const user = userEvent.setup();
      renderAdmin();

      const approveButtons = screen.getAllByRole('button', { name: /godkänn/i });
      await user.click(approveButtons[0]);

      expect(mockUpdateStatus).toHaveBeenCalledWith({
        bookingId: 'booking-1',
        slotId: 'slot-1',
        status: 'approved',
      });
    });

    it('should call updateStatus with rejected when reject is clicked', async () => {
      const user = userEvent.setup();
      renderAdmin();

      const rejectButtons = screen.getAllByRole('button', { name: /neka/i });
      await user.click(rejectButtons[0]);

      expect(mockUpdateStatus).toHaveBeenCalledWith({
        bookingId: 'booking-1',
        slotId: 'slot-1',
        status: 'rejected',
      });
    });
  });

  describe('Add Slot Form', () => {
    it('should display add slot section', () => {
      renderAdmin();
      expect(screen.getByText('Lägg till tid')).toBeInTheDocument();
    });

    it('should have date input', () => {
      renderAdmin();
      expect(screen.getByLabelText(/datum/i)).toBeInTheDocument();
    });

    it('should have time input', () => {
      renderAdmin();
      expect(screen.getByLabelText(/starttid/i)).toBeInTheDocument();
    });

    it('should have duration select', () => {
      renderAdmin();
      expect(screen.getByLabelText(/längd/i)).toBeInTheDocument();
    });

    it('should have notes input', () => {
      renderAdmin();
      expect(screen.getByLabelText(/anteckningar/i)).toBeInTheDocument();
    });

    it('should have submit button', () => {
      renderAdmin();
      expect(screen.getByRole('button', { name: /lägg till tid/i })).toBeInTheDocument();
    });

    it('should allow filling out the form', async () => {
      const user = userEvent.setup();
      renderAdmin();

      const dateInput = screen.getByLabelText(/datum/i);
      const timeInput = screen.getByLabelText(/starttid/i);
      const durationSelect = screen.getByLabelText(/längd/i);
      const notesInput = screen.getByLabelText(/anteckningar/i);

      await user.type(dateInput, '2025-02-01');
      await user.clear(timeInput);
      await user.type(timeInput, '10:00');
      await user.selectOptions(durationSelect, '4 timmar');
      await user.type(notesInput, 'Test notes');

      expect(dateInput).toHaveValue('2025-02-01');
      expect(timeInput).toHaveValue('10:00');
      expect(durationSelect).toHaveValue('4 timmar');
      expect(notesInput).toHaveValue('Test notes');
    });
  });
});

describe('Admin Access Control', () => {
  it('should redirect non-admin users', () => {
    // Override to simulate non-admin user
    vi.mocked(require('../hooks/useAuth').useAuth).mockReturnValue({
      user: { id: 'user-1', email: 'user@example.com' },
      profile: {
        id: 'user-1',
        email: 'user@example.com',
        phone: '070-111 11 11',
        full_name: 'Regular User',
        is_admin: false,
      },
      session: {},
      isLoading: false,
      isAdmin: false,
      isDemoMode: true,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      demoLogin: vi.fn(),
    });

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/admin']}>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<div>Home</div>} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    // Should not see admin content
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
  });
});
