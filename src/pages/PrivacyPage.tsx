import { Link } from 'react-router-dom';
import { MobileContainer } from '../components/layout';
import { Card } from '../components/ui/Card';

export function PrivacyPage() {
  return (
    <MobileContainer>
      <div className="p-4 pb-20">
        <h1 className="text-2xl font-bold mb-6">Integritetspolicy</h1>

        <Card className="space-y-4 text-sm text-lender-text-secondary">
          <section>
            <h2 className="text-white font-semibold mb-2">Vilka uppgifter samlar vi in?</h2>
            <p>
              Vi samlar in den information du anger vid registrering: e-postadress,
              telefonnummer och namn. Vi sparar även information om dina bokningar.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">Hur använder vi uppgifterna?</h2>
            <p>
              Dina uppgifter används för att hantera ditt konto, möjliggöra bokningar,
              och för att kortinnehavare ska kunna kontakta dig vid godkänd bokning.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">Lagring</h2>
            <p>
              Din data lagras säkert hos Supabase inom EU. Vi behåller dina uppgifter
              så länge du har ett aktivt konto.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">Delning</h2>
            <p>
              Vi delar inte dina uppgifter med tredje part utöver vad som krävs
              för att tillhandahålla tjänsten. Vid godkänd bokning delas din
              kontaktinformation med kortinnehavaren.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">Dina rättigheter</h2>
            <p>
              Du har rätt att begära tillgång till, rättelse av, eller radering av
              dina personuppgifter. Kontakta oss för att utöva dessa rättigheter.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">Cookies</h2>
            <p>
              Vi använder endast nödvändiga cookies för autentisering och
              session-hantering. Inga tredjepartscookies används.
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
