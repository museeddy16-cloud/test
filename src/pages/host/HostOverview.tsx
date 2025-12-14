import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  CalendarDays, 
  DollarSign, 
  Star, 
  TrendingUp,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { useFetch } from '../../hooks/useDashboard';
import StatCard from '../../components/ui/StatCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorState from '../../components/ui/ErrorState';
import { DashboardStats, Booking, Listing } from '../../types/dashboard';

export default function HostOverview() {
  const { data: stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useFetch<DashboardStats>('/host/dashboard/stats');
  const { data: recentBookings, loading: bookingsLoading } = useFetch<Booking[]>('/host/bookings?limit=5');
  const { data: listings, loading: listingsLoading } = useFetch<Listing[]>('/host/listings?limit=4');

  const isLoading = statsLoading === 'loading' || bookingsLoading === 'loading' || listingsLoading === 'loading';

  if (statsLoading === 'loading') {
    return <LoadingSpinner fullScreen message="Loading dashboard..." />;
  }

  if (statsError) {
    return <ErrorState message={statsError} onRetry={refetchStats} />;
  }

  return (
    <div className="host-overview">
      <div className="page-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back! Here's what's happening with your listings.</p>
      </div>

      <div className="stats-grid">
        <StatCard 
          title="Active Listings" 
          value={stats?.activeListings ?? 0} 
          icon={Home}
          color="primary"
        />
        <StatCard 
          title="Total Bookings" 
          value={stats?.totalBookings ?? 0} 
          icon={CalendarDays}
          color="info"
        />
        <StatCard 
          title="Total Revenue" 
          value={`$${stats?.totalRevenue?.toLocaleString() ?? 0}`} 
          icon={DollarSign}
          color="success"
          change={{ value: 12, type: 'increase' }}
        />
        <StatCard 
          title="Average Rating" 
          value={stats?.averageRating?.toFixed(1) ?? '0.0'} 
          icon={Star}
          color="warning"
        />
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Recent Bookings</h3>
            <Link to="/host/bookings" className="view-all">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="card-body">
            {bookingsLoading === 'loading' ? (
              <LoadingSpinner message="Loading bookings..." />
            ) : recentBookings && recentBookings.length > 0 ? (
              <div className="booking-list">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="booking-item">
                    <div className="booking-info">
                      <h4>{booking.listing?.title || 'Listing'}</h4>
                      <p>{booking.guest?.firstName} {booking.guest?.lastName}</p>
                      <span className="booking-dates">
                        {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="booking-status">
                      <span className={`status-badge status-${booking.status}`}>
                        {booking.status}
                      </span>
                      <span className="booking-amount">${booking.totalPrice}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-message">No recent bookings</p>
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3>Your Listings</h3>
            <Link to="/host/listings" className="view-all">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="card-body">
            {listingsLoading === 'loading' ? (
              <LoadingSpinner message="Loading listings..." />
            ) : listings && listings.length > 0 ? (
              <div className="listing-grid-small">
                {listings.map((listing) => (
                  <div key={listing.id} className="listing-item-small">
                    <div 
                      className="listing-image" 
                      style={{ backgroundImage: `url(${listing.images?.[0] || '/placeholder.jpg'})` }}
                    />
                    <div className="listing-details">
                      <h4>{listing.title}</h4>
                      <p>{listing.city}, {listing.country}</p>
                      <div className="listing-meta">
                        <span className={`status-badge status-${listing.status}`}>
                          {listing.status}
                        </span>
                        <span className="price">${listing.price}/night</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state-inline">
                <p>You haven't created any listings yet.</p>
                <Link to="/host/listings/create" className="btn btn-primary btn-sm">
                  Create Your First Listing
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-card performance-card">
          <div className="card-header">
            <h3>Performance</h3>
          </div>
          <div className="card-body">
            <div className="performance-metrics">
              <div className="metric">
                <TrendingUp size={20} />
                <div>
                  <span className="metric-value">{stats?.occupancyRate ?? 0}%</span>
                  <span className="metric-label">Occupancy Rate</span>
                </div>
              </div>
              <div className="metric">
                <MessageSquare size={20} />
                <div>
                  <span className="metric-value">{stats?.unreadMessages ?? 0}</span>
                  <span className="metric-label">Unread Messages</span>
                </div>
              </div>
              <div className="metric">
                <CalendarDays size={20} />
                <div>
                  <span className="metric-value">{stats?.pendingBookings ?? 0}</span>
                  <span className="metric-label">Pending Bookings</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card quick-actions">
          <div className="card-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="card-body">
            <div className="action-buttons">
              <Link to="/host/listings/create" className="action-btn">
                <Home size={20} />
                <span>Add Listing</span>
              </Link>
              <Link to="/host/pricing" className="action-btn">
                <DollarSign size={20} />
                <span>Update Pricing</span>
              </Link>
              <Link to="/host/messages" className="action-btn">
                <MessageSquare size={20} />
                <span>Messages</span>
              </Link>
              <Link to="/host/earnings" className="action-btn">
                <TrendingUp size={20} />
                <span>View Earnings</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
