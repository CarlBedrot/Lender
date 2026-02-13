import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MobileContainer } from '../components/layout';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export function ForgotPasswordPage() {
  const { resetPassword, isDemoMode } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Något gick fel');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MobileContainer showHeader={false}>
      <div className="p-4 min-h-screen flex flex-col justify-center">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-lender-accent">
            Lender
          </Link>
          <p className="text-lender-text-secondary mt-2">
            Återställ ditt lösenord
          </p>
        </div>

        {isDemoMode && (
          <Card className="mb-4 border border-yellow-500/30 bg-yellow-500/5">
            <p className="text-yellow-400 text-sm text-center">
              Lösenordsåterställning är inte tillgänglig i demo-läge
            </p>
          </Card>
        )}

        {success ? (
          <Card>
            <div className="text-center py-4">
              <p className="text-lender-accent mb-2">✓ E-post skickat!</p>
              <p className="text-lender-text-secondary text-sm">
                Kolla din inkorg för en länk att återställa ditt lösenord.
              </p>
            </div>
            <Link to="/login" className="block mt-4">
              <Button variant="secondary" className="w-full">
                Tillbaka till inloggning
              </Button>
            </Link>
          </Card>
        ) : (
          <>
            <Card>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="email"
                  label="E-post"
                  placeholder="din@email.se"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={isDemoMode}
                />

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <Button
                  type="submit"
                  disabled={isLoading || isDemoMode}
                  className="w-full"
                >
                  {isLoading ? 'Skickar...' : 'Skicka återställningslänk'}
                </Button>
              </form>
            </Card>

            <p className="text-center text-lender-text-secondary mt-6">
              Kom du ihåg lösenordet?{' '}
              <Link to="/login" className="text-lender-accent hover:underline">
                Logga in
              </Link>
            </p>
          </>
        )}

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
