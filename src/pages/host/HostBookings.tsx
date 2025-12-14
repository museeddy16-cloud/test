import { useState } from 'react';
import { 
  Calendar, 
  Search, 
  Filter, 
  Check, 
  X,
  MessageSquare,
  User,
  Clock
} from 'lucide-react';
import { usePagination, usePut } from '../../hooks/useDashboard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Tabs from '../../components/ui/Tabs';
import { Booking } from '../../types/dashboard';

export default function HostBookings() {
  const { data: bookings, loading, page, totalPages, goToPage, refresh } = usePagination<Booking>('/host/bookings', 10);
  const { put, loading: updating } = usePut();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [actionModal, setActionModal] = useState<{ type: 'confirm' | 'cancel' | null; booking: Booking | null }>({
    type: null,
    booking: null
  });

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = booking.guest?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          booking.listing?.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || booking.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleAction = async (action: 'confirm' | 'cancel') => {
    if (actionModal.booking) {
      await put(`/host/bookings/${actionModal.booking.id}/${action}`, {});
      refresh();
      setActionModal({ type: null, booking: null });
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
    return <LoadingSpinner fullScreen message="Loading bookings..." />;
  }

  const tabs = [
    { id: 'all', label: 'All Bookings', content: null },
    { id: 'pending', label: 'Pending', content: null },
    { id: 'confirmed', label: 'Confirmed', content: null },
    { id: 'completed', label: 'Completed', content: null },
    { id: 'cancelled', label: 'Cancelled', content: null },
  ];

  return (
    <div className="host-bookings">
      <div className="page-header">
        <div>
          <h1>Bookings</h1>
          <p>Manage your property reservations</p>
        </div>
      </div>

      <div className="bookings-toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by guest or listing..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="tabs-inline">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No bookings found"
          description={searchQuery ? "Try adjusting your search" : "You don't have any bookings yet"}
        />
      ) : (
        <div className="bookings-list">
          {filteredBookings.map((booking) => (
            <div 
              key={booking.id} 
              className={`booking-card ${selectedBooking?.id === booking.id ? 'selected' : ''}`}
              onClick={() => setSelectedBooking(booking)}
            >
              <div className="booking-main">
                <div className="guest-info">
                  <div className="guest-avatar">
                    {booking.guest?.avatar ? (
                      <img src={booking.guest.avatar} alt={booking.guest.firstName} />
                    ) : (
                      <User size={24} />
                    )}
                  </div>
                  <div>
                    <h4>{booking.guest?.firstName} {booking.guest?.lastName}</h4>
                    <p className="listing-name">{booking.listing?.title}</p>
                  </div>
                </div>

                <div className="booking-dates">
                  <Calendar size={16} />
                  <span>{formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}</span>
                  <span className="nights">({getDaysBetween(booking.checkIn, booking.checkOut)} nights)</span>
                </div>

                <div className="booking-guests">
                  <User size={16} />
                  <span>{booking.guests} guest{booking.guests > 1 ? 's' : ''}</span>
                </div>

                <div className="booking-amount">
                  <span className="amount">${booking.totalPrice}</span>
                  <Badge variant={getStatusVariant(booking.status)}>
                    {booking.status}
                  </Badge>
                </div>

                <div className="booking-actions">
                  {booking.status === 'pending' && (
                    <>
                      <button 
                        className="btn btn-success btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActionModal({ type: 'confirm', booking });
                        }}
                      >
                        <Check size={14} />
                      </button>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActionModal({ type: 'cancel', booking });
                        }}
                      >
                        <X size={14} />
                      </button>
                    </>
                  )}
                  <button className="btn btn-secondary btn-sm">
                    <MessageSquare size={14} />
                  </button>
                </div>
              </div>

              {selectedBooking?.id === booking.id && (
                <div className="booking-details">
                  <div className="detail-section">
                    <h5>Booking Details</h5>
                    <div className="detail-grid">
                      <div>
                        <span className="label">Booking ID</span>
                        <span className="value">{booking.id}</span>
                      </div>
                      <div>
                        <span className="label">Created</span>
                        <span className="value">{formatDate(booking.createdAt)}</span>
                      </div>
                      <div>
                        <span className="label">Payment Status</span>
                        <Badge variant={booking.paymentStatus === 'paid' ? 'success' : 'warning'}>
                          {booking.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
        isOpen={!!actionModal.type}
        onClose={() => setActionModal({ type: null, booking: null })}
        title={actionModal.type === 'confirm' ? 'Confirm Booking' : 'Cancel Booking'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setActionModal({ type: null, booking: null })}>
              Close
            </button>
            <button 
              className={`btn ${actionModal.type === 'confirm' ? 'btn-success' : 'btn-danger'}`}
              onClick={() => handleAction(actionModal.type!)}
              disabled={updating === 'loading'}
            >
              {updating === 'loading' ? 'Processing...' : actionModal.type === 'confirm' ? 'Confirm' : 'Cancel Booking'}
            </button>
          </>
        }
      >
        {actionModal.type === 'confirm' ? (
          <p>Are you sure you want to confirm this booking for {actionModal.booking?.guest?.firstName}?</p>
        ) : (
          <p>Are you sure you want to cancel this booking? The guest will be notified and refunded according to your cancellation policy.</p>
        )}
      </Modal>
    </div>
  );
}
