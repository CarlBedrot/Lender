import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import {
  HomePage,
  BookingPage,
  ConfirmationPage,
  LoginPage,
  RegisterPage,
  MyBookingsPage,
  ForgotPasswordPage,
  ProfilePage,
  TermsPage,
  PrivacyPage,
} from './pages';
import { AdminDashboard } from './pages/admin';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/book/:slotId" element={<BookingPage />} />
      <Route path="/confirmation/:bookingId" element={<ConfirmationPage />} />
      <Route path="/my-bookings" element={<MyBookingsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
