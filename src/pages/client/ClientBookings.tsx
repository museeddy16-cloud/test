import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  User, 
  MessageSquare,
  Download,
  X
} from 'lucide-react';
import { usePagination, usePut } from '../../hooks/useDashboard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { Booking } from '../../types/dashboard';

export default function ClientBookings() {
  const { data: bookings, loading, page, totalPages, goToPage, refresh } = usePagination<Booking>('/client/bookings', 10);
  const { put, loading: updating } = usePut();
  
  const [activeTab, setActiveTab] = useState('all');
  const [cancelModal, setCancelModal] = useState<{ open: boolean; booking: Booking | null }>({
    open: false,
    booking: null
  });

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming') return booking.status === 'confirmed';
    if (activeTab === 'completed') return booking.status === 'completed';
    if (activeTab === 'cancelled') return booking.status === 'cancelled';
    return true;
  });

  const handleCancelBooking = async () => {
    if (cancelModal.booking) {
      await put(`/client/bookings/${cancelModal.booking.id}/cancel`, {});
      setCancelModal({ open: false, booking: null });
      refresh();
    }
  };

  const getStatusVariant = (status: string): 'success' | 'warning' | 'danger' | 'info' | 'secondary' => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      case 'completed': return 'info';
      default: return 'secondary';
    }
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const getDaysBetween = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  if (loading === 'loading') {
    return <LoadingSpinner fullScreen message="Loading your bookings..." />;
  }

  return (
    <div className="client-bookings">
      <div className="page-header">
        <h1>My Bookings</h1>
        <p>View and manage your reservations</p>
      </div>

      <div className="tabs-header">
        {['all', 'upcoming', 'completed', 'cancelled'].map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {filteredBookings.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No bookings found"
          description={activeTab === 'all' 
            ? "You haven't made any bookings yet" 
            : `No ${activeTab} bookings`
          }
          action={{
            label: "Browse Listings",
            onClick: () => window.location.href = '/listings'
          }}
        />
      ) : (
        <div className="bookings-list">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <div 
                className="booking-image"
                style={{ backgroundImage: `url(${booking.listing?.images?.[0] || '/placeholder.jpg'})` }}
              >
                <Badge variant={getStatusVariant(booking.status)}>
                  {booking.status}
                </Badge>
              </div>
              
              <div className="booking-content">
                <div className="booking-main-info">
                  <h3>{booking.listing?.title}</h3>
                  <p className="booking-location">
                    <MapPin size={14} />
                    {booking.listing?.city}, {booking.listing?.country}
                  </p>
                </div>

                <div className="booking-details-grid">
                  <div className="detail">
                    <Calendar size={16} />
                    <div>
                      <span className="label">Check-in</span>
                      <span className="value">{formatDate(booking.checkIn)}</span>
                    </div>
                  </div>
                  <div className="detail">
                    <Calendar size={16} />
                    <div>
                      <span className="label">Check-out</span>
                      <span className="value">{formatDate(booking.checkOut)}</span>
                    </div>
                  </div>
                  <div className="detail">
                    <User size={16} />
                    <div>
                      <span className="label">Guests</span>
                      <span className="value">{booking.guests} guest{booking.guests > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <div className="detail">
                    <span className="label">Total</span>
                    <span className="value price">${booking.totalPrice}</span>
                  </div>
                </div>

                <div className="booking-footer">
                  <span className="nights">
                    {getDaysBetween(booking.checkIn, booking.checkOut)} nights
                  </span>
                  <div className="booking-actions">
                    <Link 
                      to={`/account/messages?booking=${booking.id}`} 
                      className="btn btn-secondary btn-sm"
                    >
                      <MessageSquare size={14} />
                      Message Host
                    </Link>
                    {booking.status === 'completed' && (
                      <Link 
                        to={`/account/reviews/write/${booking.id}`} 
                        className="btn btn-secondary btn-sm"
                      >
                        Write Review
                      </Link>
                    )}
                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => setCancelModal({ open: true, booking })}
                      >
                        <X size={14} />
                        Cancel
                      </button>
                    )}
                    <button className="btn btn-secondary btn-sm">
                      <Download size={14} />
                      Receipt
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => goToPage(page - 1)}>Previous</button>
          <span>Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => goToPage(page + 1)}>Next</button>
        </div>
      )}

      <Modal
        isOpen={cancelModal.open}
        onClose={() => setCancelModal({ open: false, booking: null })}
        title="Cancel Booking"
        footer={
          <>
            <button 
              className="btn btn-secondary"
              onClick={() => setCancelModal({ open: false, booking: null })}
            >
              Keep Booking
            </button>
            <button 
              className="btn btn-danger"
              onClick={handleCancelBooking}
              disabled={updating === 'loading'}
            >
              {updating === 'loading' ? 'Cancelling...' : 'Confirm Cancellation'}
            </button>
          </>
        }
      >
        <p>Are you sure you want to cancel your booking at "{cancelModal.booking?.listing?.title}"?</p>
        <p className="text-muted">Refund policy will be applied based on the host's cancellation policy.</p>
      </Modal>
    </div>
  );
}
