import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MobileContainer } from '../components/layout';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export function RegisterPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (password.length < 6) {
      setError('Lösenordet måste vara minst 6 tecken');
      setIsLoading(false);
      return;
    }

    try {
      await signUp(email, password, phone, fullName || undefined);
      setSuccess(true);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('already registered')) {
          setError('E-postadressen är redan registrerad');
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

  if (success) {
    return (
      <MobileContainer showHeader={false}>
        <div className="p-4 min-h-screen flex flex-col justify-center">
          <Card className="text-center">
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Kolla din e-post!</h2>
            <p className="text-lender-text-secondary">
              Vi har skickat en bekräftelselänk till {email}
            </p>
          </Card>

          <Button
            variant="secondary"
            onClick={() => navigate('/login')}
            className="mt-6"
          >
            Gå till inloggning
          </Button>
        </div>
      </MobileContainer>
    );
  }

  return (
    <MobileContainer showHeader={false}>
      <div className="p-4 min-h-screen flex flex-col justify-center">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-lender-accent">
            Lender
          </Link>
          <p className="text-lender-text-secondary mt-2">
            Skapa ett konto för att boka tider
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              label="Namn"
              placeholder="Ditt namn"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
            />

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
              type="tel"
              label="Telefon"
              placeholder="070-123 45 67"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              autoComplete="tel"
            />

            <Input
              type="password"
              label="Lösenord"
              placeholder="Minst 6 tecken"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Registrerar...' : 'Registrera dig'}
            </Button>
          </form>
        </Card>

        <p className="text-center text-lender-text-secondary mt-6">
          Har du redan ett konto?{' '}
          <Link to="/login" className="text-lender-accent hover:underline">
            Logga in
          </Link>
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
