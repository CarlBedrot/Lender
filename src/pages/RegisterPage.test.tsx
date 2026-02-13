import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../test/test-utils';
import userEvent from '@testing-library/user-event';
import { RegisterPage } from './RegisterPage';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock useAuth
const mockSignUp = vi.fn();
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    signUp: mockSignUp,
  }),
}));

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the Lender logo', () => {
    render(<RegisterPage />);
    expect(screen.getByText('Lender')).toBeInTheDocument();
  });

  it('should render registration prompt', () => {
    render(<RegisterPage />);
    expect(screen.getByText('Skapa ett konto för att boka tider')).toBeInTheDocument();
  });

  it('should render name input', () => {
    render(<RegisterPage />);
    expect(screen.getByLabelText(/namn/i)).toBeInTheDocument();
  });

  it('should render email input', () => {
    render(<RegisterPage />);
    expect(screen.getByLabelText(/e-post/i)).toBeInTheDocument();
  });

  it('should render phone input', () => {
    render(<RegisterPage />);
    expect(screen.getByLabelText(/telefon/i)).toBeInTheDocument();
  });

  it('should render password input', () => {
    render(<RegisterPage />);
    expect(screen.getByLabelText(/lösenord/i)).toBeInTheDocument();
  });

  it('should render register button', () => {
    render(<RegisterPage />);
    expect(screen.getByRole('button', { name: /registrera dig/i })).toBeInTheDocument();
  });

  it('should render login link', () => {
    render(<RegisterPage />);
    expect(screen.getByText('Har du redan ett konto?')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /logga in/i })).toBeInTheDocument();
  });

  it('should render back link', () => {
    render(<RegisterPage />);
    expect(screen.getByRole('link', { name: /tillbaka/i })).toBeInTheDocument();
  });

  it('should allow entering all fields', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/namn/i), 'Test User');
    await user.type(screen.getByLabelText(/e-post/i), 'test@example.com');
    await user.type(screen.getByLabelText(/telefon/i), '070-123 45 67');
    await user.type(screen.getByLabelText(/lösenord/i), 'password123');

    expect(screen.getByLabelText(/namn/i)).toHaveValue('Test User');
    expect(screen.getByLabelText(/e-post/i)).toHaveValue('test@example.com');
    expect(screen.getByLabelText(/telefon/i)).toHaveValue('070-123 45 67');
    expect(screen.getByLabelText(/lösenord/i)).toHaveValue('password123');
  });

  it('should show error for short password', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/e-post/i), 'test@example.com');
    await user.type(screen.getByLabelText(/telefon/i), '070-123 45 67');
    await user.type(screen.getByLabelText(/lösenord/i), '12345');
    await user.click(screen.getByRole('button', { name: /registrera dig/i }));

    await waitFor(() => {
      expect(screen.getByText('Lösenordet måste vara minst 6 tecken')).toBeInTheDocument();
    });
  });

  it('should call signUp when form is submitted', async () => {
    const user = userEvent.setup();
    mockSignUp.mockResolvedValue(undefined);
    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/namn/i), 'Test User');
    await user.type(screen.getByLabelText(/e-post/i), 'test@example.com');
    await user.type(screen.getByLabelText(/telefon/i), '070-123 45 67');
    await user.type(screen.getByLabelText(/lösenord/i), 'password123');
    await user.click(screen.getByRole('button', { name: /registrera dig/i }));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
        '070-123 45 67',
        'Test User'
      );
    });
  });

  it('should show success message after registration', async () => {
    const user = userEvent.setup();
    mockSignUp.mockResolvedValue(undefined);
    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/e-post/i), 'test@example.com');
    await user.type(screen.getByLabelText(/telefon/i), '070-123 45 67');
    await user.type(screen.getByLabelText(/lösenord/i), 'password123');
    await user.click(screen.getByRole('button', { name: /registrera dig/i }));

    await waitFor(() => {
      expect(screen.getByText('Kolla din e-post!')).toBeInTheDocument();
    });
  });

  it('should show error for already registered email', async () => {
    const user = userEvent.setup();
    mockSignUp.mockRejectedValue(new Error('User already registered'));
    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/e-post/i), 'existing@example.com');
    await user.type(screen.getByLabelText(/telefon/i), '070-123 45 67');
    await user.type(screen.getByLabelText(/lösenord/i), 'password123');
    await user.click(screen.getByRole('button', { name: /registrera dig/i }));

    await waitFor(() => {
      expect(screen.getByText('E-postadressen är redan registrerad')).toBeInTheDocument();
    });
  });

  it('should show loading state while submitting', async () => {
    const user = userEvent.setup();
    mockSignUp.mockImplementation(() => new Promise(() => {})); // Never resolves
    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/e-post/i), 'test@example.com');
    await user.type(screen.getByLabelText(/telefon/i), '070-123 45 67');
    await user.type(screen.getByLabelText(/lösenord/i), 'password123');
    await user.click(screen.getByRole('button', { name: /registrera dig/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /registrerar/i })).toBeInTheDocument();
    });
  });
});
