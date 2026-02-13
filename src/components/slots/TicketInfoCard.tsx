import { Card } from '../ui/Card';

interface TicketInfoCardProps {
  availableCount: number;
}

export function TicketInfoCard({ availableCount }: TicketInfoCardProps) {
  return (
    <Card className="border border-lender-border">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-lender-text-secondary text-sm mb-1">
            Öresund Pendlarkort
          </p>
          <p className="text-lg font-semibold">Malmö Triangeln ↔ Nørreport St.</p>
          <p className="text-lender-text-secondary text-sm mt-2">
            Zon A-H (Skåne + Köpenhamn)
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-lender-accent">{availableCount}</p>
          <p className="text-lender-text-secondary text-sm">tillgängliga</p>
        </div>
      </div>
    </Card>
  );
}
