import { useParams, Navigate } from 'react-router-dom';
import { useSlot } from '../hooks/useSlots';
import { useAuth } from '../hooks/useAuth';
import { MobileContainer } from '../components/layout';
import { BookingForm } from '../components/booking';
import { Card } from '../components/ui/Card';

export function BookingPage() {
  const { slotId } = useParams<{ slotId: string }>();
  const { user, isLoading: authLoading } = useAuth();
  const { data: slot, isLoading: slotLoading, error } = useSlot(slotId);

  if (authLoading) {
    return (
      <MobileContainer>
        <div className="p-4">
          <Card className="animate-pulse">
            <div className="h-6 bg-lender-card-hover rounded w-1/2 mb-4" />
            <div className="h-4 bg-lender-card-hover rounded w-full mb-2" />
            <div className="h-4 bg-lender-card-hover rounded w-3/4" />
          </Card>
        </div>
      </MobileContainer>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: `/book/${slotId}` }} />;
  }

  if (slotLoading) {
    return (
      <MobileContainer>
        <div className="p-4">
          <Card className="animate-pulse">
            <div className="h-6 bg-lender-card-hover rounded w-1/2 mb-4" />
            <div className="h-4 bg-lender-card-hover rounded w-full mb-2" />
            <div className="h-4 bg-lender-card-hover rounded w-3/4" />
          </Card>
        </div>
      </MobileContainer>
    );
  }

  if (error || !slot) {
    return (
      <MobileContainer>
        <div className="p-4">
          <Card>
            <p className="text-red-400">Tiden kunde inte hittas.</p>
          </Card>
        </div>
      </MobileContainer>
    );
  }

  if (slot.status !== 'available') {
    return (
      <MobileContainer>
        <div className="p-4">
          <Card>
            <p className="text-lender-warning">Denna tid är inte längre tillgänglig.</p>
          </Card>
        </div>
      </MobileContainer>
    );
  }

  return (
    <MobileContainer>
      <div className="p-4">
        <BookingForm slot={slot} />
      </div>
    </MobileContainer>
  );
}
