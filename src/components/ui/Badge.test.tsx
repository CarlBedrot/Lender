import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import { Badge, StatusBadge } from './Badge';

describe('Badge', () => {
  it('should render children correctly', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('should apply neutral variant by default', () => {
    render(<Badge>Default</Badge>);
    expect(screen.getByText('Default')).toHaveClass('badge-neutral');
  });

  it('should apply success variant', () => {
    render(<Badge variant="success">Success</Badge>);
    expect(screen.getByText('Success')).toHaveClass('badge-success');
  });

  it('should apply warning variant', () => {
    render(<Badge variant="warning">Warning</Badge>);
    expect(screen.getByText('Warning')).toHaveClass('badge-warning');
  });

  it('should apply pending variant', () => {
    render(<Badge variant="pending">Pending</Badge>);
    expect(screen.getByText('Pending')).toHaveClass('badge-pending');
  });

  it('should apply rejected variant', () => {
    render(<Badge variant="rejected">Rejected</Badge>);
    expect(screen.getByText('Rejected')).toHaveClass('badge-rejected');
  });

  it('should accept additional className', () => {
    render(<Badge className="extra-class">Custom</Badge>);
    expect(screen.getByText('Custom')).toHaveClass('extra-class');
  });
});

describe('StatusBadge', () => {
  it('should render pending status correctly', () => {
    render(<StatusBadge status="pending" />);
    expect(screen.getByText('Väntar')).toBeInTheDocument();
    expect(screen.getByText('Väntar')).toHaveClass('badge-pending');
  });

  it('should render approved status correctly', () => {
    render(<StatusBadge status="approved" />);
    expect(screen.getByText('Godkänd')).toBeInTheDocument();
    expect(screen.getByText('Godkänd')).toHaveClass('badge-success');
  });

  it('should render rejected status correctly', () => {
    render(<StatusBadge status="rejected" />);
    expect(screen.getByText('Nekad')).toBeInTheDocument();
    expect(screen.getByText('Nekad')).toHaveClass('badge-rejected');
  });

  it('should render completed status correctly', () => {
    render(<StatusBadge status="completed" />);
    expect(screen.getByText('Slutförd')).toBeInTheDocument();
    expect(screen.getByText('Slutförd')).toHaveClass('badge-success');
  });

  it('should render cancelled status correctly', () => {
    render(<StatusBadge status="cancelled" />);
    expect(screen.getByText('Avbokad')).toBeInTheDocument();
    expect(screen.getByText('Avbokad')).toHaveClass('badge-rejected');
  });

  it('should render available status correctly', () => {
    render(<StatusBadge status="available" />);
    expect(screen.getByText('Tillgänglig')).toBeInTheDocument();
  });

  it('should render booked status correctly', () => {
    render(<StatusBadge status="booked" />);
    expect(screen.getByText('Bokad')).toBeInTheDocument();
  });

  it('should accept additional className', () => {
    render(<StatusBadge status="pending" className="custom-badge" />);
    expect(screen.getByText('Väntar')).toHaveClass('custom-badge');
  });
});
