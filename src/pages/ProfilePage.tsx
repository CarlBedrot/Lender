import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MobileContainer } from '../components/layout';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export function ProfilePage() {
  const { user, profile, isLoading: authLoading, updateProfile } = useAuth();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
    }
  }, [profile]);

  if (authLoading) {
    return (
      <MobileContainer>
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-lender-card-hover rounded w-1/3" />
            <Card>
              <div className="h-12 bg-lender-card-hover rounded mb-4" />
              <div className="h-12 bg-lender-card-hover rounded mb-4" />
              <div className="h-10 bg-lender-card-hover rounded" />
            </Card>
          </div>
        </div>
      </MobileContainer>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    try {
      await updateProfile({
        full_name: fullName || undefined,
        phone: phone || undefined,
      });
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
    <MobileContainer>
      <div className="p-4 pb-20">
        <h1 className="text-2xl font-bold mb-6">Min profil</h1>

        <Card className="mb-4">
          <p className="text-lender-text-secondary text-sm mb-1">E-post</p>
          <p className="font-medium">{profile?.email}</p>
        </Card>

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
              type="tel"
              label="Telefon"
              placeholder="07X-XXX XX XX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
            />

            {error && <p className="text-red-400 text-sm">{error}</p>}
            
            {success && (
              <p className="text-lender-accent text-sm">
                ✓ Profilen har uppdaterats!
              </p>
            )}

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Sparar...' : 'Spara ändringar'}
            </Button>
          </form>
        </Card>

        <Link
          to="/my-bookings"
          className="block text-center text-lender-text-secondary mt-6 hover:text-white transition-colors"
        >
          ← Tillbaka till mina bokningar
        </Link>
      </div>
    </MobileContainer>
  );
}
