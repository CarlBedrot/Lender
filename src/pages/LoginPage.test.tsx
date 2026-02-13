import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../test/test-utils';
import userEvent from '@testing-library/user-event';
import { LoginPage } from './LoginPage';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: null }),
  };
});

// Mock useAuth
const mockSignIn = vi.fn();
const mockDemoLogin = vi.fn();
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    signIn: mockSignIn,
    isDemoMode: false,
    demoLogin: mockDemoLogin,
  }),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the Lender logo', () => {
    render(<LoginPage />);
    expect(screen.getByText('Lender')).toBeInTheDocument();
  });

  it('should render login prompt', () => {
    render(<LoginPage />);
    expect(screen.getByText('Logga in för att boka tider')).toBeInTheDocument();
  });

  it('should render email input', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/e-post/i)).toBeInTheDocument();
  });

  it('should render password input', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/lösenord/i)).toBeInTheDocument();
  });

  it('should render login button', () => {
    render(<LoginPage />);
    expect(screen.getByRole('button', { name: /logga in/i })).toBeInTheDocument();
  });

  it('should render register link', () => {
    render(<LoginPage />);
    expect(screen.getByText('Har du inget konto?')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /registrera dig/i })).toBeInTheDocument();
  });

  it('should render back link', () => {
    render(<LoginPage />);
    expect(screen.getByRole('link', { name: /tillbaka/i })).toBeInTheDocument();
  });

  it('should allow entering email', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/e-post/i);
    await user.type(emailInput, 'test@example.com');

    expect(emailInput).toHaveValue('test@example.com');
  });

  it('should allow entering password', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const passwordInput = screen.getByLabelText(/lösenord/i);
    await user.type(passwordInput, 'password123');

    expect(passwordInput).toHaveValue('password123');
  });

  it('should call signIn when form is submitted', async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValue(undefined);
    render(<LoginPage />);

    await user.type(screen.getByLabelText(/e-post/i), 'test@example.com');
    await user.type(screen.getByLabelText(/lösenord/i), 'password123');
    await user.click(screen.getByRole('button', { name: /logga in/i }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('should navigate after successful login', async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValue(undefined);
    render(<LoginPage />);

    await user.type(screen.getByLabelText(/e-post/i), 'test@example.com');
    await user.type(screen.getByLabelText(/lösenord/i), 'password123');
    await user.click(screen.getByRole('button', { name: /logga in/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('should show error on invalid credentials', async () => {
    const user = userEvent.setup();
    mockSignIn.mockRejectedValue(new Error('Invalid login credentials'));
    render(<LoginPage />);

    await user.type(screen.getByLabelText(/e-post/i), 'test@example.com');
    await user.type(screen.getByLabelText(/lösenord/i), 'wrong');
    await user.click(screen.getByRole('button', { name: /logga in/i }));

    await waitFor(() => {
      expect(screen.getByText('Fel e-post eller lösenord')).toBeInTheDocument();
    });
  });

  it('should show loading state while submitting', async () => {
    const user = userEvent.setup();
    mockSignIn.mockImplementation(() => new Promise(() => {})); // Never resolves
    render(<LoginPage />);

    await user.type(screen.getByLabelText(/e-post/i), 'test@example.com');
    await user.type(screen.getByLabelText(/lösenord/i), 'password123');
    await user.click(screen.getByRole('button', { name: /logga in/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /loggar in/i })).toBeInTheDocument();
    });
  });
});

describe('LoginPage - Demo Mode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show demo login buttons when in demo mode', () => {
    vi.mocked(require('../hooks/useAuth').useAuth).mockReturnValue({
      signIn: mockSignIn,
      isDemoMode: true,
      demoLogin: mockDemoLogin,
    });

    render(<LoginPage />);
    expect(screen.getByText(/demo-läge aktivt/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logga in som användare/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logga in som admin/i })).toBeInTheDocument();
  });

  it('should call demoLogin for user when user button clicked', async () => {
    vi.mocked(require('../hooks/useAuth').useAuth).mockReturnValue({
      signIn: mockSignIn,
      isDemoMode: true,
      demoLogin: mockDemoLogin,
    });

    const user = userEvent.setup();
    render(<LoginPage />);

    await user.click(screen.getByRole('button', { name: /logga in som användare/i }));

    expect(mockDemoLogin).toHaveBeenCalledWith(false);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should call demoLogin for admin when admin button clicked', async () => {
    vi.mocked(require('../hooks/useAuth').useAuth).mockReturnValue({
      signIn: mockSignIn,
      isDemoMode: true,
      demoLogin: mockDemoLogin,
    });

    const user = userEvent.setup();
    render(<LoginPage />);

    await user.click(screen.getByRole('button', { name: /logga in som admin/i }));

    expect(mockDemoLogin).toHaveBeenCalledWith(true);
    expect(mockNavigate).toHaveBeenCalledWith('/admin');
  });
});
