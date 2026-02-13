import { Card } from '../ui/Card';

interface AdminStatsProps {
  availableSlots: number;
  pendingRequests: number;
  completedLoans: number;
}

export function AdminStats({
  availableSlots,
  pendingRequests,
  completedLoans,
}: AdminStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <Card className="text-center">
        <p className="text-2xl font-bold text-lender-accent">{availableSlots}</p>
        <p className="text-lender-text-secondary text-xs">Tillgängliga</p>
      </Card>
      <Card className="text-center">
        <p className="text-2xl font-bold text-lender-warning">{pendingRequests}</p>
        <p className="text-lender-text-secondary text-xs">Förfrågningar</p>
      </Card>
      <Card className="text-center">
        <p className="text-2xl font-bold text-white">{completedLoans}</p>
        <p className="text-lender-text-secondary text-xs">Slutförda</p>
      </Card>
    </div>
  );
}
