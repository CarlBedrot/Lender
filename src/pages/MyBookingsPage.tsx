import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useMyBookings, useCancelBooking } from '../hooks/useBookings';
import { MobileContainer } from '../components/layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/Badge';
import { formatSwedishDate, formatTime } from '../lib/utils';

export function MyBookingsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: bookings, isLoading: bookingsLoading } = useMyBookings();
  const cancelBooking = useCancelBooking();

  if (authLoading) {
    return (
      <MobileContainer>
        <div className="p-4">
          <div className="animate-pulse space-y-3">
            {[1, 2].map((i) => (
              <Card key={i}>
                <div className="h-5 bg-lender-card-hover rounded w-1/3 mb-2" />
                <div className="h-4 bg-lender-card-hover rounded w-1/2" />
              </Card>
            ))}
          </div>
        </div>
      </MobileContainer>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleCancel = (bookingId: string) => {
    if (confirm('Är du säker på att du vill avboka?')) {
      cancelBooking.mutate(bookingId);
    }
  };

  return (
    <MobileContainer>
      <div className="p-4 pb-20">
        <h1 className="text-2xl font-bold mb-6">Mina bokningar</h1>

        {bookingsLoading ? (
          <div className="animate-pulse space-y-3">
            {[1, 2].map((i) => (
              <Card key={i}>
                <div className="h-5 bg-lender-card-hover rounded w-1/3 mb-2" />
                <div className="h-4 bg-lender-card-hover rounded w-1/2" />
              </Card>
            ))}
          </div>
        ) : !bookings || bookings.length === 0 ? (
          <Card>
            <p className="text-lender-text-secondary text-center py-4">
              Du har inga bokningar än.
            </p>
            <Link to="/" className="block">
              <Button className="w-full mt-4">Se tillgängliga tider</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => {
              const { dayName, shortDate } = formatSwedishDate(booking.slot.date);
              const canCancel = booking.status === 'pending';

              return (
                <Card key={booking.id}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold">{dayName}</p>
                      <p className="text-lender-text-secondary text-sm">
                        {shortDate}
                      </p>
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>

                  <p className="text-lender-text-secondary text-sm mb-3">
                    Från kl. {formatTime(booking.slot.start_time)} •{' '}
                    {booking.slot.duration}
                  </p>

                  <p className="text-lender-text-secondary text-sm">
                    Malmö Triangeln ↔ Nørreport St.
                  </p>

                  {canCancel && (
                    <Button
                      variant="secondary"
                      onClick={() => handleCancel(booking.id)}
                      disabled={cancelBooking.isPending}
                      className="w-full mt-4"
                    >
                      Avboka
                    </Button>
                  )}

                  {booking.status === 'approved' && (
                    <Card className="mt-4 border border-lender-accent/30 bg-lender-accent/5">
                      <p className="text-lender-accent text-sm">
                        Din bokning är godkänd! Du kommer få biljetten via
                        Skånetrafiken-appen.
                      </p>
                    </Card>
                  )}

                  {booking.status === 'rejected' && booking.admin_notes && (
                    <Card className="mt-4 border border-red-500/30 bg-red-500/5">
                      <p className="text-red-400 text-sm">{booking.admin_notes}</p>
                    </Card>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </MobileContainer>
  );
}
