/**
 * NOTE: Contains DEMO MODE code - search for "DEMO MODE" to find and remove
 */

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MobileContainer } from '../components/layout';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, isDemoMode, demoLogin } = useAuth(); // DEMO MODE

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as { from?: string })?.from || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signIn(email, password);
      navigate(from);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('Invalid login credentials')) {
          setError('Fel e-post eller lösenord');
        } else {
          setError(err.message);
        }
      } else {
        setError('Något gick fel');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // DEMO MODE - demo login handlers
  const handleDemoLogin = (asAdmin: boolean) => {
    demoLogin(asAdmin);
    navigate(asAdmin ? '/admin' : from);
  };

  return (
    <MobileContainer showHeader={false}>
      <div className="p-4 min-h-screen flex flex-col justify-center">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-lender-accent">
            Lender
          </Link>
          <p className="text-lender-text-secondary mt-2">
            Logga in för att boka tider
          </p>
        </div>

        {/* DEMO MODE - Demo login buttons */}
        {isDemoMode && (
          <Card className="mb-4 border border-yellow-500/30 bg-yellow-500/5">
            <p className="text-yellow-400 text-sm mb-3 text-center">
              Demo-läge aktivt (Supabase ej konfigurerad)
            </p>
            <div className="space-y-2">
              <Button
                onClick={() => handleDemoLogin(false)}
                className="w-full"
              >
                Logga in som användare
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleDemoLogin(true)}
                className="w-full"
              >
                Logga in som admin
              </Button>
            </div>
          </Card>
        )}

        {/* Regular login form - hidden in demo mode */}
        {!isDemoMode && (
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
                />

                <Input
                  type="password"
                  label="Lösenord"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? 'Loggar in...' : 'Logga in'}
                </Button>
              </form>

              <Link
                to="/forgot-password"
                className="block text-center text-lender-text-secondary text-sm mt-4 hover:text-lender-accent transition-colors"
              >
                Glömt lösenordet?
              </Link>
            </Card>

            <p className="text-center text-lender-text-secondary mt-6">
              Har du inget konto?{' '}
              <Link to="/register" className="text-lender-accent hover:underline">
                Registrera dig
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
