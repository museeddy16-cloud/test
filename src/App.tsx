import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Listings from './pages/Listings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import EmailVerification from './pages/EmailVerification';
import Dashboard from './pages/Dashboard';
import DashboardListings from './pages/DashboardListings';
import CreateListing from './pages/CreateListing';
import DashboardReservations from './pages/DashboardReservations';
import DashboardMessages from './pages/DashboardMessages';
import DashboardWishlist from './pages/DashboardWishlist';
import DashboardReviews from './pages/DashboardReviews';
import DashboardEarnings from './pages/DashboardEarnings';
import DashboardSettings from './pages/DashboardSettings';
import DashboardProfile from './pages/DashboardProfile';
import DashboardNotifications from './pages/DashboardNotifications';
import HostOnboarding from './pages/HostOnboarding';
import PropertyDetail from './pages/PropertyDetail';
import Checkout from './pages/Checkout';
import BookingConfirmation from './pages/BookingConfirmation';
import VisitRwanda from './pages/Rwanda';
import Help from './pages/Help';
import Safety from './pages/Safety';
import About from './pages/About';
import Careers from './pages/Careers';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Hosting from './pages/Hosting';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProperties from './pages/admin/AdminProperties';
import AdminBookings from './pages/admin/AdminBookings';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';
import './styles/global.css';

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="loading-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (adminOnly && user.role !== 'ADMIN') {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/listings" element={<Listings />} />
              <Route path="/listing/:id" element={<Listings />} />
              <Route path="/property/:id" element={<PropertyDetail />} />
              <Route path="/host-onboarding" element={<HostOnboarding />} />
              <Route path="/visit-rwanda" element={<VisitRwanda />} />
              <Route path="/help" element={<Help />} />
              <Route path="/safety" element={<Safety />} />
              <Route path="/about" element={<About />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/hosting" element={<Hosting />} />
            </Route>
            
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verify-email" element={<EmailVerification />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Route>
            
            <Route path="/checkout/:bookingId" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/booking-confirmation/:bookingId" element={<ProtectedRoute><BookingConfirmation /></ProtectedRoute>} />
            
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/listings" element={<ProtectedRoute><DashboardListings /></ProtectedRoute>} />
            <Route path="/dashboard/listings/create" element={<ProtectedRoute><CreateListing /></ProtectedRoute>} />
            <Route path="/dashboard/reservations" element={<ProtectedRoute><DashboardReservations /></ProtectedRoute>} />
            <Route path="/dashboard/messages" element={<ProtectedRoute><DashboardMessages /></ProtectedRoute>} />
            <Route path="/dashboard/wishlist" element={<ProtectedRoute><DashboardWishlist /></ProtectedRoute>} />
            <Route path="/dashboard/reviews" element={<ProtectedRoute><DashboardReviews /></ProtectedRoute>} />
            <Route path="/dashboard/earnings" element={<ProtectedRoute><DashboardEarnings /></ProtectedRoute>} />
            <Route path="/dashboard/settings" element={<ProtectedRoute><DashboardSettings /></ProtectedRoute>} />
            <Route path="/dashboard/profile" element={<ProtectedRoute><DashboardProfile /></ProtectedRoute>} />
            <Route path="/dashboard/notifications" element={<ProtectedRoute><DashboardNotifications /></ProtectedRoute>} />
            
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/properties" element={<ProtectedRoute adminOnly><AdminProperties /></ProtectedRoute>} />
            <Route path="/admin/bookings" element={<ProtectedRoute adminOnly><AdminBookings /></ProtectedRoute>} />
            <Route path="/admin/analytics" element={<ProtectedRoute adminOnly><AdminAnalytics /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute adminOnly><AdminSettings /></ProtectedRoute>} />
            
            <Route path="/logout" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
