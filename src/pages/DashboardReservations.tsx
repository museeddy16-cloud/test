import { Calendar, Check, X, Eye, MapPin, Users, DollarSign } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { getApiUrl } from '../config/api';
import './Dashboard.css';

interface Booking {
  id: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: string;
  property: {
    id: string;
    title: string;
    location?: string;
    city: string;
    country: string;
    images: string[];
  };
  user?: {
    firstName: string;
    lastName: string;
  };
}

export default function Reservations() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [reservations, setReservations] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await fetch(getApiUrl('/bookings'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setReservations(data);
      }
    } catch (error) {
      console.error('Failed to fetch reservations');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (id: string) => {
    try {
      const res = await fetch(getApiUrl(`/bookings/${id}/status`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'CONFIRMED' })
      });
      if (res.ok) {
        fetchReservations();
      }
    } catch (error) {
      console.error('Failed to confirm booking');
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) return;
    
    try {
      const res = await fetch(getApiUrl(`/bookings/${id}/status`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'CANCELLED' })
      });
      if (res.ok) {
        fetchReservations();
      }
    } catch (error) {
      console.error('Failed to cancel booking');
    }
  };

  const filtered = selectedStatus === 'all' 
    ? reservations 
    : reservations.filter(r => (r.status || 'PENDING').toLowerCase() === selectedStatus);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'CONFIRMED': return 'confirmed';
      case 'PENDING': return 'pending';
      case 'CANCELLED': return 'cancelled';
      case 'COMPLETED': return 'completed';
      default: return '';
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="dashboard-main">
        {user?.role === 'HOST' || user?.role === 'ADMIN' ? (
          <div className="host-dashboard-badge">Host Dashboard</div>
        ) : null}
        
        <header className="dashboard-header">
          <div>
            <h1>Reservations</h1>
            <p>Manage your bookings and guests</p>
          </div>
        </header>

        <div className="dashboard-content">
          {/* Reservation Stats */}
          <div className="reservations-stats">
            <div className="stat-card">
              <div className="stat-icon">
                <Calendar size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Total Reservations</span>
                <span className="stat-value">{reservations.length}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Check size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Confirmed</span>
                <span className="stat-value">{reservations.filter(r => r.status === 'CONFIRMED').length}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <DollarSign size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Total Revenue</span>
                <span className="stat-value">${reservations.reduce((sum, r) => sum + (r.totalPrice || 0), 0).toLocaleString()}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Users size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Total Guests</span>
                <span className="stat-value">{reservations.reduce((sum, r) => sum + (r.guests || 0), 0)}</span>
              </div>
            </div>
          </div>

          <div className="filter-tabs">
            <button 
              className={`filter-tab ${selectedStatus === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedStatus('all')}
            >
              All Reservations ({reservations.length})
            </button>
            <button 
              className={`filter-tab ${selectedStatus === 'confirmed' ? 'active' : ''}`}
              onClick={() => setSelectedStatus('confirmed')}
            >
              Confirmed ({reservations.filter(r => (r.status || '') === 'CONFIRMED').length})
            </button>
            <button 
              className={`filter-tab ${selectedStatus === 'pending' ? 'active' : ''}`}
              onClick={() => setSelectedStatus('pending')}
            >
              Pending ({reservations.filter(r => (r.status || 'PENDING') === 'PENDING').length})
            </button>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading reservations...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📅</div>
              <h3>No reservations yet</h3>
              <p>Your bookings will appear here once you make a reservation</p>
              <button className="btn-primary" onClick={() => navigate('/listings')}>
                Browse Properties
              </button>
            </div>
          ) : (
            <div className="reservations-grid">
              {filtered.map((res) => (
                <div key={res.id} className="reservation-card">
                  <img 
                    src={(res.property?.images && res.property.images[0]) || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200'} 
                    alt={res.property?.title || 'Property'} 
                    className="res-image" 
                  />
                  
                  <div className="res-header">
                    <div>
                      <h3>{res.property?.title || 'Unknown Property'}</h3>
                      {res.user && (
                        <p className="res-guest">Guest: {res.user.firstName} {res.user.lastName}</p>
                      )}
                    </div>
                    <span className={`status-badge ${getStatusColor(res.status || 'PENDING')}`}>
                      {(res.status || 'pending').toLowerCase()}
                    </span>
                  </div>

                  <div className="res-details">
                    <div className="res-detail-item">
                      <MapPin size={16} />
                      <span>{res.property?.location || (res.property?.city && res.property?.country ? `${res.property.city}, ${res.property.country}` : 'Location N/A')}</span>
                    </div>
                    <div className="res-detail-item">
                      <Calendar size={16} />
                      <span>{formatDate(res.checkIn)} - {formatDate(res.checkOut)}</span>
                    </div>
                    <div className="res-detail-item">
                      <Users size={16} />
                      <span>{res.guests} Guest{res.guests > 1 ? 's' : ''}</span>
                    </div>
                    <div className="res-detail-item">
                      <DollarSign size={16} />
                      <span>${(res.totalPrice || 0).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="res-actions">
                    {res.property?.id && (
                      <button 
                        className="btn-secondary"
                        onClick={() => navigate(`/property/${res.property.id}`)}
                      >
                        <Eye size={16} />
                        View Property
                      </button>
                    )}
                    {res.status === 'PENDING' && user?.role !== 'CLIENT' && (
                      <>
                        <button className="btn-success" onClick={() => handleConfirm(res.id)}>
                          <Check size={16} />
                          Confirm
                        </button>
                        <button className="btn-danger-outline" onClick={() => handleCancel(res.id)}>
                          <X size={16} />
                          Cancel
                        </button>
                      </>
                    )}
                    {res.status === 'PENDING' && user?.role === 'CLIENT' && (
                      <button className="btn-danger-outline" onClick={() => handleCancel(res.id)}>
                        <X size={16} />
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
