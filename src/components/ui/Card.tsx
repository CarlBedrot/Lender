import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export function Card({ children, className, onClick, hoverable }: CardProps) {
  return (
    <div
      className={cn(
        'card',
        hoverable && 'cursor-pointer hover:bg-lender-card-hover transition-colors',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
