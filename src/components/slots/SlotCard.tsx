import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatSwedishDate, formatTime } from '../../lib/utils';
import type { Slot } from '../../lib/types';

interface SlotCardProps {
  slot: Slot;
}

export function SlotCard({ slot }: SlotCardProps) {
  const navigate = useNavigate();
  const { dayName, shortDate } = formatSwedishDate(slot.date);

  return (
    <Card hoverable onClick={() => navigate(`/book/${slot.id}`)}>
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-lg">{dayName}</p>
          <p className="text-lender-text-secondary">{shortDate}</p>
          <p className="text-lender-text-secondary mt-2">
            Från kl. {formatTime(slot.start_time)} • {slot.duration}
          </p>
          {slot.notes && (
            <p className="text-lender-text-secondary text-sm mt-2 italic">
              {slot.notes}
            </p>
          )}
        </div>
        <Button variant="secondary" className="py-2 px-4">
          Boka
        </Button>
      </div>
    </Card>
  );
}
