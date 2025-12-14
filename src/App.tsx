import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';
import HostLayout from './layouts/HostLayout';
import ClientLayout from './layouts/ClientLayout';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Listings from './pages/Listings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import EmailVerification from './pages/EmailVerification';
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
import Pricing from './pages/Pricing';
import HostOnboarding from './pages/HostOnboarding';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProperties from './pages/admin/AdminProperties';
import AdminBookings from './pages/admin/AdminBookings';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';
import AdminPricingPlans from './pages/admin/AdminPricingPlans';
import AdminPaymentsReports from './pages/admin/AdminPaymentsReports';
import AdminPlatformSettings from './pages/admin/AdminPlatformSettings';
import HostOverview from './pages/host/HostOverview';
import HostProfile from './pages/host/HostProfile';
import HostVerification from './pages/host/HostVerification';
import HostListings from './pages/host/HostListings';
import HostListingPricing from './pages/host/HostListingPricing';
import HostSubscription from './pages/host/HostSubscription';
import HostBillingHistory from './pages/host/HostBillingHistory';
import HostBookings from './pages/host/HostBookings';
import HostEarnings from './pages/host/HostEarnings';
import HostReviews from './pages/host/HostReviews';
import HostMessages from './pages/host/HostMessages';
import HostSettings from './pages/host/HostSettings';
import ClientOverview from './pages/client/ClientOverview';
import ClientProfile from './pages/client/ClientProfile';
import ClientSecurity from './pages/client/ClientSecurity';
import ClientBookings from './pages/client/ClientBookings';
import ClientPayments from './pages/client/ClientPayments';
import ClientReviews from './pages/client/ClientReviews';
import ClientMessages from './pages/client/ClientMessages';
import CreateListing from './pages/CreateListing';
import './styles/global.css';
import './styles/dashboard.css';

function DashboardRedirect() {
  const { user } = useAuth();
  
  if (user?.role === 'ADMIN') {
    return <Navigate to="/admin" />;
  } else if (user?.role === 'HOST') {
    return <Navigate to="/host" />;
  } else {
    return <Navigate to="/account" />;
  }
}

function ProtectedRoute({ children, adminOnly = false, hostOnly = false }: { children: React.ReactNode; adminOnly?: boolean; hostOnly?: boolean }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="loading-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (adminOnly && user.role !== 'ADMIN') {
    return <Navigate to="/account" />;
  }

  if (hostOnly && user.role !== 'HOST' && user.role !== 'ADMIN') {
    return <Navigate to="/account" />;
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
              <Route path="/pricing" element={<Pricing />} />
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
            
            <Route path="/dashboard" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />
            
            <Route element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/properties" element={<AdminProperties />} />
              <Route path="/admin/bookings" element={<AdminBookings />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              <Route path="/admin/pricing" element={<AdminPricingPlans />} />
              <Route path="/admin/payments" element={<AdminPaymentsReports />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/admin/platform-settings" element={<AdminPlatformSettings />} />
            </Route>

            <Route element={<ProtectedRoute hostOnly><HostLayout /></ProtectedRoute>}>
              <Route path="/host" element={<HostOverview />} />
              <Route path="/host/profile" element={<HostProfile />} />
              <Route path="/host/profile/verification" element={<HostVerification />} />
              <Route path="/host/listings" element={<HostListings />} />
              <Route path="/host/listings/create" element={<CreateListing />} />
              <Route path="/host/listings/:id/edit" element={<CreateListing />} />
              <Route path="/host/pricing" element={<HostListingPricing />} />
              <Route path="/host/pricing/seasonal" element={<HostListingPricing />} />
              <Route path="/host/pricing/discounts" element={<HostListingPricing />} />
              <Route path="/host/subscription" element={<HostSubscription />} />
              <Route path="/host/subscription/billing" element={<HostBillingHistory />} />
              <Route path="/host/bookings" element={<HostBookings />} />
              <Route path="/host/earnings" element={<HostEarnings />} />
              <Route path="/host/earnings/payouts" element={<HostEarnings />} />
              <Route path="/host/reviews" element={<HostReviews />} />
              <Route path="/host/messages" element={<HostMessages />} />
              <Route path="/host/settings" element={<HostSettings />} />
            </Route>

            <Route element={<ProtectedRoute><ClientLayout /></ProtectedRoute>}>
              <Route path="/account" element={<ClientOverview />} />
              <Route path="/account/profile" element={<ClientProfile />} />
              <Route path="/account/security" element={<ClientSecurity />} />
              <Route path="/account/bookings" element={<ClientBookings />} />
              <Route path="/account/bookings/:id" element={<ClientBookings />} />
              <Route path="/account/payments" element={<ClientPayments />} />
              <Route path="/account/reviews" element={<ClientReviews />} />
              <Route path="/account/reviews/write/:bookingId" element={<ClientReviews />} />
              <Route path="/account/messages" element={<ClientMessages />} />
            </Route>
            
            <Route path="/logout" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
