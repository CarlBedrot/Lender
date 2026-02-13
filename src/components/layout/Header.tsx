import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

export function Header() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="flex items-center justify-between p-4 border-b border-lender-border">
      <Link to="/" className="text-2xl font-bold text-lender-accent">
        Lender
      </Link>

      <nav className="flex items-center gap-3">
        {user ? (
          <>
            {isAdmin && (
              <Link
                to="/admin"
                className="text-sm text-lender-text-secondary hover:text-white transition-colors"
              >
                Admin
              </Link>
            )}
            <Link
              to="/my-bookings"
              className="text-sm text-lender-text-secondary hover:text-white transition-colors"
            >
              Mina bokningar
            </Link>
            <Link
              to="/profile"
              className="text-sm text-lender-text-secondary hover:text-white transition-colors"
            >
              Profil
            </Link>
            <button
              onClick={handleSignOut}
              className="text-sm text-lender-text-secondary hover:text-white transition-colors"
            >
              Logga ut
            </button>
          </>
        ) : (
          <Button
            variant="secondary"
            className="py-2 px-4 text-sm"
            onClick={() => navigate('/login')}
          >
            Logga in
          </Button>
        )}
      </nav>
    </header>
  );
}
