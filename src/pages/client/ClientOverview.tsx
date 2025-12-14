import { Link } from 'react-router-dom';
import { 
  CalendarDays, 
  CreditCard, 
  Star, 
  MessageSquare,
  ArrowRight,
  MapPin
} from 'lucide-react';
import { useFetch } from '../../hooks/useDashboard';
import StatCard from '../../components/ui/StatCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Booking, DashboardStats } from '../../types/dashboard';

export default function ClientOverview() {
  const { data: stats, loading: statsLoading } = useFetch<DashboardStats>('/client/dashboard/stats');
  const { data: upcomingBookings, loading: bookingsLoading } = useFetch<Booking[]>('/client/bookings?status=confirmed&limit=3');
  const { data: recentBookings, loading: recentLoading } = useFetch<Booking[]>('/client/bookings?status=completed&limit=3');

  if (statsLoading === 'loading') {
    return <LoadingSpinner fullScreen message="Loading your dashboard..." />;
  }

  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="client-overview">
      <div className="page-header">
        <h1>My Account</h1>
        <p>Welcome back! Here's your travel overview.</p>
      </div>

      <div className="stats-grid cols-4">
        <StatCard 
          title="Upcoming Trips" 
          value={stats?.pendingBookings ?? 0} 
          icon={CalendarDays}
          color="primary"
        />
        <StatCard 
          title="Total Bookings" 
          value={stats?.totalBookings ?? 0} 
          icon={CalendarDays}
          color="info"
        />
        <StatCard 
          title="Reviews Given" 
          value={stats?.totalListings ?? 0} 
          icon={Star}
          color="warning"
        />
        <StatCard 
          title="Unread Messages" 
          value={stats?.unreadMessages ?? 0} 
          icon={MessageSquare}
          color="success"
        />
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card upcoming-trips">
          <div className="card-header">
            <h3>Upcoming Trips</h3>
            <Link to="/account/bookings" className="view-all">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="card-body">
            {bookingsLoading === 'loading' ? (
              <LoadingSpinner message="Loading trips..." />
            ) : upcomingBookings && upcomingBookings.length > 0 ? (
              <div className="trips-list">
                {upcomingBookings.map((booking) => (
                  <div key={booking.id} className="trip-card">
                    <div 
                      className="trip-image"
                      style={{ backgroundImage: `url(${booking.listing?.images?.[0] || '/placeholder.jpg'})` }}
                    />
                    <div className="trip-details">
                      <h4>{booking.listing?.title}</h4>
                      <p className="trip-location">
                        <MapPin size={14} />
                        {booking.listing?.city}, {booking.listing?.country}
                      </p>
                      <div className="trip-dates">
                        <CalendarDays size={14} />
                        <span>{formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}</span>
                      </div>
                    </div>
                    <Link to={`/account/bookings/${booking.id}`} className="btn btn-secondary btn-sm">
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state-inline">
                <p>No upcoming trips</p>
                <Link to="/listings" className="btn btn-primary btn-sm">
                  Browse Listings
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-card past-trips">
          <div className="card-header">
            <h3>Recent Trips</h3>
          </div>
          <div className="card-body">
            {recentLoading === 'loading' ? (
              <LoadingSpinner message="Loading trips..." />
            ) : recentBookings && recentBookings.length > 0 ? (
              <div className="past-trips-list">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="past-trip-item">
                    <div 
                      className="trip-thumb"
                      style={{ backgroundImage: `url(${booking.listing?.images?.[0] || '/placeholder.jpg'})` }}
                    />
                    <div className="trip-info">
                      <h4>{booking.listing?.title}</h4>
                      <span>{formatDate(booking.checkIn)}</span>
                    </div>
                    <Link to={`/account/reviews/write/${booking.id}`} className="btn btn-secondary btn-sm">
                      Write Review
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-message">No past trips yet</p>
            )}
          </div>
        </div>

        <div className="dashboard-card quick-links">
          <div className="card-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="card-body">
            <div className="quick-link-list">
              <Link to="/account/profile" className="quick-link">
                <span>Edit Profile</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/account/payments" className="quick-link">
                <span>Payment Methods</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/account/security" className="quick-link">
                <span>Security Settings</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/account/messages" className="quick-link">
                <span>Messages</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
