import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import { SlotList } from './SlotList';
import type { Slot } from '../../lib/types';

const mockSlots: Slot[] = [
  {
    id: 'slot-1',
    date: '2025-01-15',
    start_time: '08:00:00',
    duration: '8 timmar',
    status: 'available',
    notes: null,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'slot-2',
    date: '2025-01-16',
    start_time: '14:00:00',
    duration: '4 timmar',
    status: 'available',
    notes: 'Special notes',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
];

describe('SlotList', () => {
  it('should render loading state with skeleton cards', () => {
    render(<SlotList slots={undefined} isLoading={true} />);
    // Check for animate-pulse class in loading skeleton
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should render empty state when no slots', () => {
    render(<SlotList slots={[]} isLoading={false} />);
    expect(screen.getByText('Inga tider tillgängliga just nu.')).toBeInTheDocument();
    expect(screen.getByText('Kom tillbaka senare för att se nya tider.')).toBeInTheDocument();
  });

  it('should render empty state when slots is undefined', () => {
    render(<SlotList slots={undefined} isLoading={false} />);
    expect(screen.getByText('Inga tider tillgängliga just nu.')).toBeInTheDocument();
  });

  it('should render all slots', () => {
    render(<SlotList slots={mockSlots} isLoading={false} />);
    expect(screen.getByText('Onsdag')).toBeInTheDocument(); // Jan 15
    expect(screen.getByText('Torsdag')).toBeInTheDocument(); // Jan 16
  });

  it('should render slot details', () => {
    render(<SlotList slots={mockSlots} isLoading={false} />);
    expect(screen.getByText(/08:00/)).toBeInTheDocument();
    expect(screen.getByText(/14:00/)).toBeInTheDocument();
    expect(screen.getByText(/8 timmar/)).toBeInTheDocument();
    expect(screen.getByText(/4 timmar/)).toBeInTheDocument();
  });

  it('should render notes when present', () => {
    render(<SlotList slots={mockSlots} isLoading={false} />);
    expect(screen.getByText('Special notes')).toBeInTheDocument();
  });

  it('should render book buttons for each slot', () => {
    render(<SlotList slots={mockSlots} isLoading={false} />);
    const bookButtons = screen.getAllByRole('button', { name: /boka/i });
    expect(bookButtons).toHaveLength(2);
  });
});
