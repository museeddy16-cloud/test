import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, MapPin, Shield, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getApiUrl } from '../config/api';
import PaymentForm from '../components/PaymentForm';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/checkout.css';

interface BookingDetails {
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  propertyLocation: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  pricePerNight: number;
  subtotal: number;
  serviceFee: number;
  total: number;
}

export default function Checkout() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useAuth();
  const [booking, setBooking] = useState<BookingDetails | null>(location.state?.booking || null);
  const [loading, setLoading] = useState(!booking);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (!booking && bookingId) {
      fetchBooking();
    }
  }, [bookingId, user]);

  const fetchBooking = async () => {
    try {
      const response = await fetch(getApiUrl(`/bookings/${bookingId}`), {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Booking not found');
      }

      const data = await response.json();
      setBooking({
        propertyId: data.property.id,
        propertyTitle: data.property.title,
        propertyImage: data.property.images?.[0] || '',
        propertyLocation: data.property.location,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        guests: data.guests,
        nights: calculateNights(data.checkIn, data.checkOut),
        pricePerNight: data.property.price,
        subtotal: data.totalPrice * 0.88,
        serviceFee: data.totalPrice * 0.12,
        total: data.totalPrice
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handlePayment = async (provider: 'STRIPE' | 'MTN_MOMO' | 'AIRTEL_MONEY', details: any) => {
    if (!booking) return;

    setPaymentLoading(true);
    setError(null);

    try {
      const response = await fetch(getApiUrl('/payments/intent'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          bookingId,
          provider,
          amount: booking.total,
          currency: 'USD'
        })
      });

      const paymentIntent = await response.json();

      if (!response.ok) {
        throw new Error(paymentIntent.error || 'Payment failed');
      }

      const confirmResponse = await fetch(getApiUrl(`/payments/${paymentIntent.payment.id}/confirm`), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!confirmResponse.ok) {
        throw new Error('Payment confirmation failed');
      }

      navigate(`/booking-confirmation/${bookingId}`, {
        state: { paymentId: paymentIntent.payment.id }
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading booking details..." />;
  }

  if (!booking) {
    return (
      <div className="checkout-error">
        <h1>Booking not found</h1>
        <p>The booking you're looking for doesn't exist or has expired.</p>
        <button onClick={() => navigate('/listings')}>Browse Properties</button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Back
        </button>
      </div>

      <div className="checkout-container">
        <div className="checkout-main">
          <h1>Confirm and pay</h1>

          <div className="checkout-section">
            <h2>Your trip</h2>
            <div className="trip-details">
              <div className="trip-detail">
                <div className="trip-detail-icon">
                  <Calendar size={20} />
                </div>
                <div className="trip-detail-info">
                  <h4>Dates</h4>
                  <p>{formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}</p>
                </div>
              </div>
              <div className="trip-detail">
                <div className="trip-detail-icon">
                  <Users size={20} />
                </div>
                <div className="trip-detail-info">
                  <h4>Guests</h4>
                  <p>{booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="checkout-section">
            <h2>Pay with</h2>
            <PaymentForm
              amount={booking.total}
              currency="USD"
              onSubmit={handlePayment}
              loading={paymentLoading}
              error={error}
            />
          </div>
        </div>

        <div className="checkout-sidebar">
          <div className="booking-card">
            <div className="booking-property">
              <img src={booking.propertyImage} alt={booking.propertyTitle} />
              <div className="booking-property-info">
                <h3>{booking.propertyTitle}</h3>
                <p>
                  <MapPin size={14} />
                  {booking.propertyLocation}
                </p>
              </div>
            </div>

            <div className="price-breakdown">
              <div className="price-row">
                <span>${booking.pricePerNight} x {booking.nights} nights</span>
                <span>${booking.subtotal.toFixed(2)}</span>
              </div>
              <div className="price-row">
                <span>Service fee</span>
                <span>${booking.serviceFee.toFixed(2)}</span>
              </div>
              <div className="price-row total">
                <span>Total (USD)</span>
                <span>${booking.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="security-badges">
              <div className="security-badge">
                <Shield size={18} />
                <span>Your payment is protected</span>
              </div>
              <div className="security-badge">
                <Check size={18} />
                <span>Free cancellation within 48 hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
