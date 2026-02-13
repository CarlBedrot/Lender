import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import { AdminStats } from './AdminStats';

describe('AdminStats', () => {
  it('should render available slots count', () => {
    render(
      <AdminStats
        availableSlots={5}
        pendingRequests={2}
        completedLoans={10}
      />
    );
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Tillgängliga')).toBeInTheDocument();
  });

  it('should render pending requests count', () => {
    render(
      <AdminStats
        availableSlots={5}
        pendingRequests={2}
        completedLoans={10}
      />
    );
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Förfrågningar')).toBeInTheDocument();
  });

  it('should render completed loans count', () => {
    render(
      <AdminStats
        availableSlots={5}
        pendingRequests={2}
        completedLoans={10}
      />
    );
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('Slutförda')).toBeInTheDocument();
  });

  it('should render zero values correctly', () => {
    render(
      <AdminStats
        availableSlots={0}
        pendingRequests={0}
        completedLoans={0}
      />
    );
    const zeros = screen.getAllByText('0');
    expect(zeros).toHaveLength(3);
  });

  it('should render large numbers correctly', () => {
    render(
      <AdminStats
        availableSlots={100}
        pendingRequests={50}
        completedLoans={1000}
      />
    );
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('1000')).toBeInTheDocument();
  });

  it('should have correct styling for available slots (green)', () => {
    render(
      <AdminStats
        availableSlots={5}
        pendingRequests={2}
        completedLoans={10}
      />
    );
    const availableCount = screen.getByText('5');
    expect(availableCount).toHaveClass('text-lender-accent');
  });

  it('should have correct styling for pending requests (yellow)', () => {
    render(
      <AdminStats
        availableSlots={5}
        pendingRequests={2}
        completedLoans={10}
      />
    );
    const pendingCount = screen.getByText('2');
    expect(pendingCount).toHaveClass('text-lender-warning');
  });
});
