import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import { RequestCard } from './RequestCard';
import type { SlotWithBooking } from '../../lib/types';

const mockSlot: SlotWithBooking = {
  id: 'slot-1',
  date: '2025-01-15',
  start_time: '08:00:00',
  duration: '8 timmar',
  status: 'available',
  notes: null,
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
  booking_id: 'booking-1',
  booked_by: 'user-1',
  booking_status: 'pending',
  booker_email: 'test@example.com',
  booker_phone: '070-123 45 67',
  booker_name: 'Test User',
  booker_previous_loans: 3,
};

describe('RequestCard', () => {
  const defaultProps = {
    slot: mockSlot,
    onApprove: vi.fn(),
    onReject: vi.fn(),
    isLoading: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render booker name', () => {
    render(<RequestCard {...defaultProps} />);
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('should render booker email', () => {
    render(<RequestCard {...defaultProps} />);
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('should render booker phone', () => {
    render(<RequestCard {...defaultProps} />);
    expect(screen.getByText('070-123 45 67')).toBeInTheDocument();
  });

  it('should render slot date and time', () => {
    render(<RequestCard {...defaultProps} />);
    expect(screen.getByText(/Onsdag/)).toBeInTheDocument();
    expect(screen.getByText(/08:00/)).toBeInTheDocument();
    expect(screen.getByText(/8 timmar/)).toBeInTheDocument();
  });

  it('should render previous loans badge for returning users', () => {
    render(<RequestCard {...defaultProps} />);
    expect(screen.getByText('3 lån tidigare')).toBeInTheDocument();
  });

  it('should render new user badge for first-time users', () => {
    const newUserSlot = { ...mockSlot, booker_previous_loans: 0 };
    render(<RequestCard {...defaultProps} slot={newUserSlot} />);
    expect(screen.getByText('Ny användare')).toBeInTheDocument();
  });

  it('should render unknown user when name is null', () => {
    const noNameSlot = { ...mockSlot, booker_name: null };
    render(<RequestCard {...defaultProps} slot={noNameSlot} />);
    expect(screen.getByText('Okänd användare')).toBeInTheDocument();
  });

  it('should call onApprove when approve button is clicked', async () => {
    const user = userEvent.setup();
    const onApprove = vi.fn();
    render(<RequestCard {...defaultProps} onApprove={onApprove} />);

    await user.click(screen.getByRole('button', { name: /godkänn/i }));
    expect(onApprove).toHaveBeenCalledTimes(1);
  });

  it('should call onReject when reject button is clicked', async () => {
    const user = userEvent.setup();
    const onReject = vi.fn();
    render(<RequestCard {...defaultProps} onReject={onReject} />);

    await user.click(screen.getByRole('button', { name: /neka/i }));
    expect(onReject).toHaveBeenCalledTimes(1);
  });

  it('should disable buttons when isLoading is true', () => {
    render(<RequestCard {...defaultProps} isLoading={true} />);
    expect(screen.getByRole('button', { name: /godkänn/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /neka/i })).toBeDisabled();
  });

  it('should enable buttons when isLoading is false', () => {
    render(<RequestCard {...defaultProps} isLoading={false} />);
    expect(screen.getByRole('button', { name: /godkänn/i })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: /neka/i })).not.toBeDisabled();
  });
});
