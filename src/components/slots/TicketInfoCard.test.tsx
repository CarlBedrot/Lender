import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import { TicketInfoCard } from './TicketInfoCard';

describe('TicketInfoCard', () => {
  it('should render the ticket route', () => {
    render(<TicketInfoCard availableCount={5} />);
    expect(screen.getByText('Malmö Triangeln ↔ Nørreport St.')).toBeInTheDocument();
  });

  it('should render the ticket type', () => {
    render(<TicketInfoCard availableCount={5} />);
    expect(screen.getByText('Öresund Pendlarkort')).toBeInTheDocument();
  });

  it('should render the zone information', () => {
    render(<TicketInfoCard availableCount={5} />);
    expect(screen.getByText('Zon A-H (Skåne + Köpenhamn)')).toBeInTheDocument();
  });

  it('should display the available count', () => {
    render(<TicketInfoCard availableCount={5} />);
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('tillgängliga')).toBeInTheDocument();
  });

  it('should display zero when no slots available', () => {
    render(<TicketInfoCard availableCount={0} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should display large numbers correctly', () => {
    render(<TicketInfoCard availableCount={100} />);
    expect(screen.getByText('100')).toBeInTheDocument();
  });
});
