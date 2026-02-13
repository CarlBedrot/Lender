import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useCreateBooking, useHasActiveBooking } from '../../hooks/useBookings';
import { formatSwedishDate, formatTime } from '../../lib/utils';
import type { Slot } from '../../lib/types';

interface BookingFormProps {
  slot: Slot;
}

export function BookingForm({ slot }: BookingFormProps) {
  const navigate = useNavigate();
  const createBooking = useCreateBooking();
  const { data: hasActiveBooking, isLoading: checkingActive } = useHasActiveBooking();
  const [error, setError] = useState<string | null>(null);

  const { dayName, fullDate } = formatSwedishDate(slot.date);

  const handleSubmit = async () => {
    setError(null);
    try {
      const booking = await createBooking.mutateAsync({ slot_id: slot.id });
      navigate(`/confirmation/${booking.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Något gick fel. Försök igen.'
      );
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="text-xl font-semibold mb-4">Bekräfta bokning</h2>

        <div className="space-y-3">
          <div>
            <p className="text-lender-text-secondary text-sm">Datum</p>
            <p className="font-medium">
              {dayName}, {fullDate}
            </p>
          </div>

          <div>
            <p className="text-lender-text-secondary text-sm">Tid</p>
            <p className="font-medium">
              Från kl. {formatTime(slot.start_time)} • {slot.duration}
            </p>
          </div>

          <div>
            <p className="text-lender-text-secondary text-sm">Sträcka</p>
            <p className="font-medium">Malmö Triangeln ↔ Nørreport St.</p>
          </div>
        </div>
      </Card>

      {/* Warning if user already has an active booking */}
      {hasActiveBooking && (
        <Card className="border border-red-500/30 bg-red-500/5">
          <p className="text-red-400 text-sm">
            <strong>Du har redan en aktiv bokning.</strong> Du kan bara ha en
            bokning åt gången. Gå till{' '}
            <Link to="/my-bookings" className="underline">
              Mina bokningar
            </Link>{' '}
            för att avboka din nuvarande bokning först.
          </p>
        </Card>
      )}

      <Card className="border border-yellow-500/30 bg-yellow-500/5">
        <p className="text-yellow-400 text-sm">
          <strong>Viktigt:</strong> Efter godkännande får du biljetten via
          Skånetrafikens app. Du måste ha appen installerad.
        </p>
      </Card>

      {error && (
        <Card className="border border-red-500/30 bg-red-500/5">
          <p className="text-red-400 text-sm">{error}</p>
        </Card>
      )}

      <div className="space-y-3">
        <Button
          onClick={handleSubmit}
          disabled={createBooking.isPending || checkingActive || hasActiveBooking}
          className="w-full"
        >
          {createBooking.isPending ? 'Skickar...' : 'Skicka förfrågan'}
        </Button>

        <Button
          variant="secondary"
          onClick={() => navigate('/')}
          className="w-full"
        >
          Avbryt
        </Button>
      </div>

      <p className="text-center text-lender-text-secondary text-sm">
        Gratis utlåning - ingen betalning krävs
      </p>
    </div>
  );
}
