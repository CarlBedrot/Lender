import { SlotCard } from './SlotCard';
import { Card } from '../ui/Card';
import type { Slot } from '../../lib/types';

interface SlotListProps {
  slots: Slot[] | undefined;
  isLoading: boolean;
}

export function SlotList({ slots, isLoading }: SlotListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-6 bg-lender-card-hover rounded w-1/3 mb-2" />
            <div className="h-4 bg-lender-card-hover rounded w-1/2 mb-2" />
            <div className="h-4 bg-lender-card-hover rounded w-2/3" />
          </Card>
        ))}
      </div>
    );
  }

  if (!slots || slots.length === 0) {
    return (
      <Card>
        <p className="text-lender-text-secondary text-center py-4">
          Inga tider tillgängliga just nu.
        </p>
        <p className="text-lender-text-secondary text-center text-sm">
          Kom tillbaka senare för att se nya tider.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {slots.map((slot) => (
        <SlotCard key={slot.id} slot={slot} />
      ))}
    </div>
  );
}
