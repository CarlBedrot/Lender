import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import { SlotCard } from './SlotCard';
import type { Slot } from '../../lib/types';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockSlot: Slot = {
  id: 'slot-1',
  date: '2025-01-15',
  start_time: '08:00:00',
  duration: '8 timmar',
  status: 'available',
  notes: null,
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
};

describe('SlotCard', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('should render the day name', () => {
    render(<SlotCard slot={mockSlot} />);
    expect(screen.getByText('Onsdag')).toBeInTheDocument();
  });

  it('should render the date', () => {
    render(<SlotCard slot={mockSlot} />);
    expect(screen.getByText('15 januari')).toBeInTheDocument();
  });

  it('should render the start time', () => {
    render(<SlotCard slot={mockSlot} />);
    expect(screen.getByText(/Från kl\. 08:00/)).toBeInTheDocument();
  });

  it('should render the duration', () => {
    render(<SlotCard slot={mockSlot} />);
    expect(screen.getByText(/8 timmar/)).toBeInTheDocument();
  });

  it('should render the book button', () => {
    render(<SlotCard slot={mockSlot} />);
    expect(screen.getByRole('button', { name: /boka/i })).toBeInTheDocument();
  });

  it('should render notes when provided', () => {
    const slotWithNotes: Slot = {
      ...mockSlot,
      notes: 'Hämta vid Triangeln',
    };
    render(<SlotCard slot={slotWithNotes} />);
    expect(screen.getByText('Hämta vid Triangeln')).toBeInTheDocument();
  });

  it('should not render notes when null', () => {
    render(<SlotCard slot={mockSlot} />);
    expect(screen.queryByText(/hämta/i)).not.toBeInTheDocument();
  });

  it('should navigate to booking page when clicked', async () => {
    const user = userEvent.setup();
    render(<SlotCard slot={mockSlot} />);

    const card = screen.getByText('Onsdag').closest('div');
    if (card) {
      await user.click(card);
      expect(mockNavigate).toHaveBeenCalledWith('/book/slot-1');
    }
  });

  it('should handle different durations', () => {
    const slotWith4Hours: Slot = { ...mockSlot, duration: '4 timmar' };
    const { rerender } = render(<SlotCard slot={slotWith4Hours} />);
    expect(screen.getByText(/4 timmar/)).toBeInTheDocument();

    const slotWith2Days: Slot = { ...mockSlot, duration: '2 dagar' };
    rerender(<SlotCard slot={slotWith2Days} />);
    expect(screen.getByText(/2 dagar/)).toBeInTheDocument();
  });
});
