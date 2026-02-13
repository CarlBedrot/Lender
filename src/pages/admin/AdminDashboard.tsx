import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { usePendingBookings, useAdminStats } from '../../hooks/useAdmin';
import { MobileContainer } from '../../components/layout';
import { AdminStats, RequestList, AddSlotForm } from '../../components/admin';
import { Card } from '../../components/ui/Card';

export function AdminDashboard() {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: pendingBookings, isLoading: pendingLoading } = usePendingBookings();

  if (authLoading) {
    return (
      <MobileContainer>
        <div className="p-4">
          <div className="animate-pulse">
            <div className="h-8 bg-lender-card-hover rounded w-1/4 mb-6" />
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <div className="h-8 bg-lender-card-hover rounded w-1/2 mx-auto mb-2" />
                  <div className="h-4 bg-lender-card-hover rounded w-3/4 mx-auto" />
                </Card>
              ))}
            </div>
          </div>
        </div>
      </MobileContainer>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  const pendingCount = pendingBookings?.length ?? 0;

  return (
    <MobileContainer>
      <div className="p-4 pb-20">
        <h1 className="text-2xl font-bold mb-6">Admin</h1>

        {/* Stats */}
        {statsLoading ? (
          <div className="grid grid-cols-3 gap-3 mb-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <div className="h-8 bg-lender-card-hover rounded w-1/2 mx-auto mb-2" />
                <div className="h-4 bg-lender-card-hover rounded w-3/4 mx-auto" />
              </Card>
            ))}
          </div>
        ) : stats ? (
          <div className="mb-6">
            <AdminStats
              availableSlots={stats.availableSlots}
              pendingRequests={stats.pendingRequests}
              completedLoans={stats.completedLoans}
            />
          </div>
        ) : null}

        {/* Pending Requests */}
        {pendingCount > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">
              Nya förfrågningar ({pendingCount})
            </h2>
            <RequestList requests={pendingBookings} isLoading={pendingLoading} />
          </div>
        )}

        {/* Add Slot Form */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Lägg till tid</h2>
          <AddSlotForm />
        </div>
      </div>
    </MobileContainer>
  );
}
