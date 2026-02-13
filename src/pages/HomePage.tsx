import { useAvailableSlots } from '../hooks/useSlots';
import { MobileContainer } from '../components/layout';
import { TicketInfoCard, SlotList } from '../components/slots';

export function HomePage() {
  const { data: slots, isLoading } = useAvailableSlots();

  const availableCount = slots?.length ?? 0;

  return (
    <MobileContainer>
      <div className="p-4 pb-20">
        <div className="mb-6">
          <TicketInfoCard availableCount={availableCount} />
        </div>

        <h2 className="text-xl font-semibold mb-4">Tillgängliga tider</h2>

        <SlotList slots={slots} isLoading={isLoading} />

        <div className="mt-8 text-center text-lender-text-secondary text-sm">
          <p>Gratis utlåning via Skånetrafiken-appen</p>
          <p className="mt-1">Ingen betalning krävs</p>
        </div>
      </div>
    </MobileContainer>
  );
}
