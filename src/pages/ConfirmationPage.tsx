import { useParams, Navigate } from 'react-router-dom';
import { useBooking } from '../hooks/useBookings';
import { useAuth } from '../hooks/useAuth';
import { MobileContainer } from '../components/layout';
import { BookingConfirmation } from '../components/booking';
import { Card } from '../components/ui/Card';

export function ConfirmationPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { user, isLoading: authLoading } = useAuth();
  const { data: booking, isLoading: bookingLoading, error } = useBooking(bookingId);

  if (authLoading || bookingLoading) {
    return (
      <MobileContainer>
        <div className="p-4">
          <Card className="animate-pulse">
            <div className="h-16 w-16 bg-lender-card-hover rounded-full mx-auto mb-4" />
            <div className="h-6 bg-lender-card-hover rounded w-1/2 mx-auto mb-2" />
            <div className="h-4 bg-lender-card-hover rounded w-3/4 mx-auto" />
          </Card>
        </div>
      </MobileContainer>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (error || !booking) {
    return (
      <MobileContainer>
        <div className="p-4">
          <Card>
            <p className="text-red-400">Bokningen kunde inte hittas.</p>
          </Card>
        </div>
      </MobileContainer>
    );
  }

  return (
    <MobileContainer>
      <div className="p-4">
        <BookingConfirmation booking={booking} />
      </div>
    </MobileContainer>
  );
}
