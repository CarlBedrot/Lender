import { Link } from 'react-router-dom';
import { MobileContainer } from '../components/layout';
import { Card } from '../components/ui/Card';

export function TermsPage() {
  return (
    <MobileContainer>
      <div className="p-4 pb-20">
        <h1 className="text-2xl font-bold mb-6">Användarvillkor</h1>

        <Card className="space-y-4 text-sm text-lender-text-secondary">
          <section>
            <h2 className="text-white font-semibold mb-2">1. Tjänsten</h2>
            <p>
              Lender är en plattform för att dela Öresund pendlarkort mellan privatpersoner.
              Tjänsten förmedlar kontakt mellan kortinnehavare och låntagare.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">2. Användning</h2>
            <p>
              Du ansvarar för att använda lånade kort enligt Skånetrafikens regler.
              Kortet får endast användas av en person åt gången.
              Missbruk kan leda till avstängning från tjänsten.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">3. Ansvar</h2>
            <p>
              Lender ansvarar inte för förlorade kort, missade resor eller andra
              skador som kan uppstå vid användning av tjänsten. Utlåning sker
              på eget ansvar.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">4. Bokning</h2>
            <p>
              Bokningar är inte bindande förrän de godkänts av kortinnehavaren.
              Avbokning ska ske i god tid innan låneperioden börjar.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">5. Ändringar</h2>
            <p>
              Vi förbehåller oss rätten att ändra dessa villkor. Fortsatt
              användning av tjänsten innebär godkännande av eventuella ändringar.
            </p>
          </section>
        </Card>

        <p className="text-center text-lender-text-secondary text-xs mt-6">
          Senast uppdaterad: Februari 2026
        </p>

        <Link
          to="/"
          className="block text-center text-lender-text-secondary mt-4 hover:text-white transition-colors"
        >
          ← Tillbaka
        </Link>
      </div>
    </MobileContainer>
  );
}
