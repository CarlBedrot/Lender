import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../test/test-utils';
import { HomePage } from './HomePage';

// Mock the hooks
vi.mock('../hooks/useSlots', () => ({
  useAvailableSlots: vi.fn(),
}));

import { useAvailableSlots } from '../hooks/useSlots';

const mockSlots = [
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
    notes: null,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
];

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the ticket info card', () => {
    vi.mocked(useAvailableSlots).mockReturnValue({
      data: mockSlots,
      isLoading: false,
    } as ReturnType<typeof useAvailableSlots>);

    render(<HomePage />);
    expect(screen.getByText('Öresund Pendlarkort')).toBeInTheDocument();
    expect(screen.getByText('Malmö Triangeln ↔ Nørreport St.')).toBeInTheDocument();
  });

  it('should display the correct available count', () => {
    vi.mocked(useAvailableSlots).mockReturnValue({
      data: mockSlots,
      isLoading: false,
    } as ReturnType<typeof useAvailableSlots>);

    render(<HomePage />);
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('tillgängliga')).toBeInTheDocument();
  });

  it('should render the section title', () => {
    vi.mocked(useAvailableSlots).mockReturnValue({
      data: mockSlots,
      isLoading: false,
    } as ReturnType<typeof useAvailableSlots>);

    render(<HomePage />);
    expect(screen.getByText('Tillgängliga tider')).toBeInTheDocument();
  });

  it('should render all available slots', () => {
    vi.mocked(useAvailableSlots).mockReturnValue({
      data: mockSlots,
      isLoading: false,
    } as ReturnType<typeof useAvailableSlots>);

    render(<HomePage />);
    expect(screen.getByText('Onsdag')).toBeInTheDocument();
    expect(screen.getByText('Torsdag')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    vi.mocked(useAvailableSlots).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as ReturnType<typeof useAvailableSlots>);

    render(<HomePage />);
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should show empty state when no slots', () => {
    vi.mocked(useAvailableSlots).mockReturnValue({
      data: [] as typeof mockSlots,
      isLoading: false,
    } as ReturnType<typeof useAvailableSlots>);

    render(<HomePage />);
    expect(screen.getByText('Inga tider tillgängliga just nu.')).toBeInTheDocument();
  });

  it('should show footer text about free lending', () => {
    vi.mocked(useAvailableSlots).mockReturnValue({
      data: mockSlots,
      isLoading: false,
    } as ReturnType<typeof useAvailableSlots>);

    render(<HomePage />);
    expect(screen.getByText('Gratis utlåning via Skånetrafiken-appen')).toBeInTheDocument();
    expect(screen.getByText('Ingen betalning krävs')).toBeInTheDocument();
  });

  it('should display zero when no slots available', () => {
    vi.mocked(useAvailableSlots).mockReturnValue({
      data: [] as typeof mockSlots,
      isLoading: false,
    } as ReturnType<typeof useAvailableSlots>);

    render(<HomePage />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
