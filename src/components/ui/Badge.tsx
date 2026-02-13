import { cn, getStatusBadgeClass, getStatusLabel } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'neutral' | 'pending' | 'rejected';
  className?: string;
}

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  const variantClass = `badge-${variant}`;
  return <span className={cn(variantClass, className)}>{children}</span>;
}

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span className={cn(getStatusBadgeClass(status), className)}>
      {getStatusLabel(status)}
    </span>
  );
}
