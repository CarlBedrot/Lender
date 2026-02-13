import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../test/test-utils';
import userEvent from '@testing-library/user-event';
import { MyBookingsPage } from './MyBookingsPage';
import type { BookingWithSlot } from '../lib/types';

// Mock useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// Mock useAuth
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'user-1' },
    isLoading: false,
  }),
}));

// Mock useBookings
const mockCancelBooking = vi.fn();
vi.mock('../hooks/useBookings', () => ({
  useMyBookings: vi.fn(),
  useCancelBooking: () => ({
    mutate: mockCancelBooking,
    isPending: false,
  }),
}));

import { useMyBookings } from '../hooks/useBookings';

const mockBookings: BookingWithSlot[] = [
  {
    id: 'booking-1',
    slot_id: 'slot-1',
    user_id: 'user-1',
    status: 'pending',
    admin_notes: null,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    slot: {
      id: 'slot-1',
      date: '2025-01-20',
      start_time: '08:00:00',
      duration: '8 timmar',
      status: 'available',
      notes: null,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    },
  },
  {
    id: 'booking-2',
    slot_id: 'slot-2',
    user_id: 'user-1',
    status: 'approved',
    admin_notes: null,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    slot: {
      id: 'slot-2',
      date: '2025-01-15',
      start_time: '14:00:00',
      duration: '4 timmar',
      status: 'booked',
      notes: null,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    },
  },
  {
    id: 'booking-3',
    slot_id: 'slot-3',
    user_id: 'user-1',
    status: 'completed',
    admin_notes: null,
    created_at: '2024-12-01T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
    slot: {
      id: 'slot-3',
      date: '2024-12-10',
      start_time: '10:00:00',
      duration: '24 timmar',
      status: 'completed',
      notes: null,
      created_at: '2024-12-01T00:00:00Z',
      updated_at: '2024-12-01T00:00:00Z',
    },
  },
];

describe('MyBookingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.confirm
    vi.spyOn(window, 'confirm').mockReturnValue(true);
  });

  it('should render page title', () => {
    vi.mocked(useMyBookings).mockReturnValue({
      data: mockBookings,
      isLoading: false,
    } as ReturnType<typeof useMyBookings>);

    render(<MyBookingsPage />);
    expect(screen.getByRole('heading', { name: 'Mina bokningar' })).toBeInTheDocument();
  });

  it('should render all bookings', () => {
    vi.mocked(useMyBookings).mockReturnValue({
      data: mockBookings,
      isLoading: false,
    } as ReturnType<typeof useMyBookings>);

    render(<MyBookingsPage />);
    expect(screen.getByText('Måndag')).toBeInTheDocument(); // Jan 20
    expect(screen.getByText('Onsdag')).toBeInTheDocument(); // Jan 15
    expect(screen.getByText('Tisdag')).toBeInTheDocument(); // Dec 10
  });

  it('should show status badges for each booking', () => {
    vi.mocked(useMyBookings).mockReturnValue({
      data: mockBookings,
      isLoading: false,
    } as ReturnType<typeof useMyBookings>);

    render(<MyBookingsPage />);
    expect(screen.getByText('Väntar')).toBeInTheDocument();
    expect(screen.getByText('Godkänd')).toBeInTheDocument();
    expect(screen.getByText('Slutförd')).toBeInTheDocument();
  });

  it('should show cancel button only for pending bookings', () => {
    vi.mocked(useMyBookings).mockReturnValue({
      data: mockBookings,
      isLoading: false,
    } as ReturnType<typeof useMyBookings>);

    render(<MyBookingsPage />);
    const cancelButtons = screen.getAllByRole('button', { name: /avboka/i });
    expect(cancelButtons).toHaveLength(1); // Only one pending booking
  });

  it('should show approval message for approved bookings', () => {
    vi.mocked(useMyBookings).mockReturnValue({
      data: mockBookings,
      isLoading: false,
    } as ReturnType<typeof useMyBookings>);

    render(<MyBookingsPage />);
    expect(screen.getByText(/din bokning är godkänd/i)).toBeInTheDocument();
  });

  it('should call cancel function when cancel button is clicked', async () => {
    vi.mocked(useMyBookings).mockReturnValue({
      data: mockBookings,
      isLoading: false,
    } as ReturnType<typeof useMyBookings>);

    const user = userEvent.setup();
    render(<MyBookingsPage />);

    await user.click(screen.getByRole('button', { name: /avboka/i }));

    expect(window.confirm).toHaveBeenCalledWith('Är du säker på att du vill avboka?');
    expect(mockCancelBooking).toHaveBeenCalledWith('booking-1');
  });

  it('should not cancel if user declines confirmation', async () => {
    vi.mocked(useMyBookings).mockReturnValue({
      data: mockBookings,
      isLoading: false,
    } as ReturnType<typeof useMyBookings>);
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    const user = userEvent.setup();
    render(<MyBookingsPage />);

    await user.click(screen.getByRole('button', { name: /avboka/i }));

    expect(mockCancelBooking).not.toHaveBeenCalled();
  });

  it('should show loading state', () => {
    vi.mocked(useMyBookings).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as ReturnType<typeof useMyBookings>);

    render(<MyBookingsPage />);
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should show empty state when no bookings', () => {
    vi.mocked(useMyBookings).mockReturnValue({
      data: [] as BookingWithSlot[],
      isLoading: false,
    } as ReturnType<typeof useMyBookings>);

    render(<MyBookingsPage />);
    expect(screen.getByText('Du har inga bokningar än.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /se tillgängliga tider/i })).toBeInTheDocument();
  });

  it('should display route for each booking', () => {
    vi.mocked(useMyBookings).mockReturnValue({
      data: [mockBookings[0]],
      isLoading: false,
    } as ReturnType<typeof useMyBookings>);

    render(<MyBookingsPage />);
    expect(screen.getByText('Malmö Triangeln ↔ Nørreport St.')).toBeInTheDocument();
  });
});
