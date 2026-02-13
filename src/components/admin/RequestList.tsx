import { RequestCard } from './RequestCard';
import { Card } from '../ui/Card';
import { useUpdateBookingStatus } from '../../hooks/useAdmin';
import type { SlotWithBooking } from '../../lib/types';

interface RequestListProps {
  requests: SlotWithBooking[] | undefined;
  isLoading: boolean;
}

export function RequestList({ requests, isLoading }: RequestListProps) {
  const updateStatus = useUpdateBookingStatus();

  const handleApprove = (slot: SlotWithBooking) => {
    if (!slot.booking_id) return;
    updateStatus.mutate({
      bookingId: slot.booking_id,
      slotId: slot.id,
      status: 'approved',
    });
  };

  const handleReject = (slot: SlotWithBooking) => {
    if (!slot.booking_id) return;
    updateStatus.mutate({
      bookingId: slot.booking_id,
      slotId: slot.id,
      status: 'rejected',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-5 bg-lender-card-hover rounded w-1/3 mb-2" />
            <div className="h-4 bg-lender-card-hover rounded w-1/2 mb-4" />
            <div className="flex gap-2">
              <div className="h-10 bg-lender-card-hover rounded flex-1" />
              <div className="h-10 bg-lender-card-hover rounded flex-1" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <Card>
        <p className="text-lender-text-secondary text-center py-2">
          Inga nya förfrågningar
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((slot) => (
        <RequestCard
          key={slot.id}
          slot={slot}
          onApprove={() => handleApprove(slot)}
          onReject={() => handleReject(slot)}
          isLoading={updateStatus.isPending}
        />
      ))}
    </div>
  );
}
