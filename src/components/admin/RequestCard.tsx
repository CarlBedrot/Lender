import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatSwedishDate } from '../../lib/utils';
import type { SlotWithBooking } from '../../lib/types';

interface RequestCardProps {
  slot: SlotWithBooking;
  onApprove: () => void;
  onReject: () => void;
  isLoading: boolean;
}

export function RequestCard({
  slot,
  onApprove,
  onReject,
  isLoading,
}: RequestCardProps) {
  const { dayName, shortDate } = formatSwedishDate(slot.date);

  return (
    <Card>
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="font-semibold">{slot.booker_name || 'Okänd användare'}</p>
          <p className="text-lender-text-secondary text-sm">{slot.booker_email}</p>
          <p className="text-lender-text-secondary text-sm">{slot.booker_phone}</p>
        </div>
        {slot.booker_previous_loans > 0 ? (
          <Badge variant="success">{slot.booker_previous_loans} lån tidigare</Badge>
        ) : (
          <Badge variant="neutral">Ny användare</Badge>
        )}
      </div>

      <p className="text-lender-text-secondary text-sm mb-4">
        {dayName}, {shortDate} • Från kl. {slot.start_time.slice(0, 5)} •{' '}
        {slot.duration}
      </p>

      <div className="flex gap-2">
        <Button onClick={onApprove} disabled={isLoading} className="flex-1">
          Godkänn
        </Button>
        <Button
          variant="secondary"
          onClick={onReject}
          disabled={isLoading}
          className="flex-1"
        >
          Neka
        </Button>
      </div>
    </Card>
  );
}
