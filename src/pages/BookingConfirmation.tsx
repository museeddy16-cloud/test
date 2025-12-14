import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Calendar, MapPin, Users, Download, MessageCircle, Home, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getApiUrl } from '../config/api';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/booking-confirmation.css';

interface BookingData {
  id: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: string;
  property: {
    id: string;
    title: string;
    images: string[];
    location: string;
    address: string;
    host: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
}

export default function BookingConfirmation() {
  const { user, token } = useAuth();
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchBooking();
  }, [bookingId, token]);

  const fetchBooking = async () => {
    try {
      const response = await fetch(getApiUrl(`/bookings/${bookingId}`), {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setBooking(data);
      }
    } catch (error) {
      console.error('Failed to fetch booking');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateNights = () => {
    if (!booking) return 0;
    const start = new Date(booking.checkIn);
    const end = new Date(booking.checkOut);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading confirmation..." />;
  }

  if (!booking) {
    return (
      <div className="confirmation-error">
        <h1>Booking not found</h1>
        <button onClick={() => {
          const bookingsPath = user?.role === 'HOST' ? '/host/bookings' : '/account/bookings';
          navigate(bookingsPath);
        }}>View My Bookings</button>
      </div>
    );
  }

  return (
    <div className="confirmation-page">
      <div className="confirmation-container">
        <div className="confirmation-header">
          <div className="success-icon">
            <CheckCircle size={48} />
          </div>
          <h1>Booking Confirmed!</h1>
          <p>Your reservation has been confirmed. You'll receive a confirmation email shortly.</p>
          <span className="confirmation-number">Confirmation #{booking.id.slice(0, 8).toUpperCase()}</span>
        </div>

        <div className="confirmation-card">
          <div 
            className="property-banner"
            style={{ backgroundImage: `url(${booking.property.images?.[0] || ''})` }}
          >
            <div className="property-overlay">
              <h2>{booking.property.title}</h2>
              <p>
                <MapPin size={16} />
                {booking.property.location}
              </p>
            </div>
          </div>

          <div className="booking-details">
            <div className="details-grid">
              <div className="detail-item">
                <Calendar size={24} />
                <h4>Check-in</h4>
                <p>{formatDate(booking.checkIn)}</p>
              </div>
              <div className="detail-item">
                <Calendar size={24} />
                <h4>Check-out</h4>
                <p>{formatDate(booking.checkOut)}</p>
              </div>
              <div className="detail-item">
                <Users size={24} />
                <h4>Guests</h4>
                <p>{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</p>
              </div>
            </div>

            <div className="host-info">
              <div className="host-info-text">
                <h4>Your Host</h4>
                <p>{booking.property.host.firstName} {booking.property.host.lastName}</p>
              </div>
              <button className="btn-message" onClick={() => {
                const messagesPath = user?.role === 'HOST' ? '/host/messages' : '/account/messages';
                navigate(messagesPath);
              }}>
                <MessageCircle size={18} />
                Message Host
              </button>
            </div>

            <div className="price-summary">
              <h3>Total ({calculateNights()} nights)</h3>
              <p>${booking.totalPrice.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="confirmation-actions">
          <Link to={user?.role === 'HOST' ? '/host/bookings' : '/account/bookings'} className="action-btn">
            <Calendar size={24} />
            <span>View My Trips</span>
          </Link>
          <a href="#" className="action-btn" onClick={(e) => { e.preventDefault(); window.print(); }}>
            <Download size={24} />
            <span>Download Receipt</span>
          </a>
          <Link to="/" className="action-btn">
            <Home size={24} />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="continue-exploring">
          <Link to="/listings">
            Continue exploring
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
