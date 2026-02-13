import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/Badge';
import { formatSwedishDate, formatTime } from '../../lib/utils';
import type { BookingWithSlot } from '../../lib/types';

interface BookingConfirmationProps {
  booking: BookingWithSlot;
}

export function BookingConfirmation({ booking }: BookingConfirmationProps) {
  const { dayName, fullDate } = formatSwedishDate(booking.slot.date);

  return (
    <div className="space-y-4">
      <Card className="text-center">
        <div className="mb-4">
          <div className="w-16 h-16 bg-lender-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-lender-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold">Förfrågan skickad!</h2>
          <p className="text-lender-text-secondary mt-2">
            Du får ett mejl när din bokning godkänns.
          </p>
        </div>

        <div className="flex justify-center mb-4">
          <StatusBadge status={booking.status} />
        </div>
      </Card>

      <Card>
        <h3 className="font-semibold mb-3">Bokningsdetaljer</h3>

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
              Från kl. {formatTime(booking.slot.start_time)} •{' '}
              {booking.slot.duration}
            </p>
          </div>

          <div>
            <p className="text-lender-text-secondary text-sm">Sträcka</p>
            <p className="font-medium">Malmö Triangeln ↔ Nørreport St.</p>
          </div>
        </div>
      </Card>

      <Card className="border border-lender-border">
        <h3 className="font-semibold mb-2">Nästa steg</h3>
        <ol className="list-decimal list-inside space-y-2 text-lender-text-secondary text-sm">
          <li>Invänta godkännande (vanligtvis inom några timmar)</li>
          <li>Installera Skånetrafiken-appen om du inte redan har den</li>
          <li>Du får biljetten via appens "Dela biljett"-funktion</li>
          <li>Returnera biljetten när lånetiden är slut</li>
        </ol>
      </Card>

      <div className="space-y-3">
        <Link to="/my-bookings" className="block">
          <Button variant="secondary" className="w-full">
            Visa mina bokningar
          </Button>
        </Link>

        <Link to="/" className="block">
          <Button variant="secondary" className="w-full">
            Tillbaka till startsidan
          </Button>
        </Link>
      </div>
    </div>
  );
}
