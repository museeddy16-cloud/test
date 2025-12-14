import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Calendar, MapPin, Users, Download, MessageCircle, Home, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function BookingConfirmation() {
  const { user } = useAuth();
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

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
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
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
      <style>{`
        .confirmation-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f0fff0 0%, #fff 50%);
          padding: 60px 20px;
        }
        .confirmation-container {
          max-width: 800px;
          margin: 0 auto;
        }
        .confirmation-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .success-icon {
          width: 80px;
          height: 80px;
          background: #e8f5e9;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
        }
        .success-icon svg {
          color: #4caf50;
        }
        .confirmation-header h1 {
          font-size: 32px;
          margin: 0 0 12px;
          color: #222;
        }
        .confirmation-header p {
          color: #717171;
          font-size: 16px;
          margin: 0;
        }
        .confirmation-number {
          display: inline-block;
          background: #f7f7f7;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          margin-top: 16px;
        }
        .confirmation-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          overflow: hidden;
          margin-bottom: 24px;
        }
        .property-banner {
          height: 200px;
          background-size: cover;
          background-position: center;
          position: relative;
        }
        .property-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 20px;
          background: linear-gradient(transparent, rgba(0,0,0,0.7));
          color: white;
        }
        .property-overlay h2 {
          margin: 0 0 8px;
          font-size: 24px;
        }
        .property-overlay p {
          margin: 0;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          opacity: 0.9;
        }
        .booking-details {
          padding: 24px;
        }
        .details-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 24px;
        }
        .detail-item {
          text-align: center;
          padding: 20px;
          background: #f7f7f7;
          border-radius: 12px;
        }
        .detail-item svg {
          color: #FF5A5F;
          margin-bottom: 12px;
        }
        .detail-item h4 {
          margin: 0 0 4px;
          font-size: 12px;
          color: #717171;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .detail-item p {
          margin: 0;
          font-weight: 600;
          font-size: 16px;
        }
        .host-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px;
          background: #f7f7f7;
          border-radius: 12px;
        }
        .host-info-text h4 {
          margin: 0 0 4px;
          font-size: 14px;
        }
        .host-info-text p {
          margin: 0;
          font-size: 14px;
          color: #717171;
        }
        .btn-message {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
        }
        .btn-message:hover {
          background: #f7f7f7;
        }
        .price-summary {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 20px;
          border-top: 1px solid #eee;
          margin-top: 20px;
        }
        .price-summary h3 {
          margin: 0;
          font-size: 14px;
          color: #717171;
          font-weight: normal;
        }
        .price-summary p {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
        }
        .confirmation-actions {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .action-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 24px;
          background: white;
          border-radius: 12px;
          border: 1px solid #eee;
          cursor: pointer;
          text-decoration: none;
          color: #222;
          transition: all 0.2s;
        }
        .action-btn:hover {
          border-color: #222;
          background: #f7f7f7;
        }
        .action-btn svg {
          color: #FF5A5F;
        }
        .action-btn span {
          font-size: 14px;
          font-weight: 500;
        }
        .continue-exploring {
          text-align: center;
          margin-top: 40px;
        }
        .continue-exploring a {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #FF5A5F;
          text-decoration: none;
          font-weight: 500;
        }
        .continue-exploring a:hover {
          text-decoration: underline;
        }
        @media (max-width: 768px) {
          .details-grid {
            grid-template-columns: 1fr;
          }
          .confirmation-actions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

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
