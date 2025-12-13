import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Users, Bed, Bath, ChevronLeft, Heart, Share2, ChevronRight, X, Calendar, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getApiUrl } from '../config/api';
import './PropertyDetail.css';

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  address: string;
  city: string;
  country: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  amenities: string[];
  images: string[];
  status: string;
  featured: boolean;
  host: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  reviews: {
    id: string;
    rating: number;
    comment: string;
    user: { firstName: string; lastName: string };
    createdAt: string;
  }[];
  _count?: {
    reviews: number;
    bookings: number;
  };
}

const fallbackProperties = [
  {
    id: '1',
    title: 'Modern Beach House',
    description: 'Stunning modern beach house with panoramic ocean views, private beach access, and luxury amenities.',
    price: 450,
    location: 'Malibu, California',
    address: '123 Beach Road',
    city: 'Malibu',
    country: 'USA',
    bedrooms: 4,
    bathrooms: 3,
    maxGuests: 8,
    amenities: ['WiFi', 'Kitchen', 'Pool', 'Hot Tub', 'Parking', 'Air Conditioning'],
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
      'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=800',
    ],
    status: 'ACTIVE',
    featured: true,
    host: { id: '1', firstName: 'John', lastName: 'Doe' },
    reviews: [],
    _count: { reviews: 128, bookings: 45 }
  }
];

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const res = await fetch(getApiUrl(`/properties/${id}`));
      if (res.ok) {
        const data = await res.json();
        setProperty(data);
      } else {
        const fallback = fallbackProperties.find(p => p.id === id);
        if (fallback) {
          setProperty(fallback as Property);
        }
      }
    } catch (error) {
      const fallback = fallbackProperties.find(p => p.id === id);
      if (fallback) {
        setProperty(fallback as Property);
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    if (!property) return 0;
    const nights = calculateNights();
    const subtotal = nights * property.price;
    const serviceFee = subtotal * 0.12;
    return subtotal + serviceFee;
  };

  const [bookingRef, setBookingRef] = useState('');

  const handleBooking = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/property/${id}` } });
      return;
    }

    if (!checkIn || !checkOut) {
      setBookingError('Please select check-in and check-out dates');
      return;
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      setBookingError('Check-in date cannot be in the past');
      return;
    }

    if (checkOutDate <= checkInDate) {
      setBookingError('Check-out must be after check-in');
      return;
    }

    const nights = calculateNights();
    if (nights < 1) {
      setBookingError('Please select at least 1 night stay');
      return;
    }

    setBookingLoading(true);
    setBookingError('');

    try {
      const res = await fetch(getApiUrl('/bookings'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          propertyId: id,
          checkIn,
          checkOut,
          guests
        })
      });

      if (res.ok) {
        const booking = await res.json();
        setBookingRef(booking.id);
        setBookingSuccess(true);
        setTimeout(() => {
          navigate('/dashboard/reservations');
        }, 3000);
      } else {
        const error = await res.json();
        setBookingError(error.error || 'Booking failed. Please try again.');
      }
    } catch (error) {
      setBookingError('Something went wrong. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleWishlist = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (isWishlisted) {
        await fetch(getApiUrl(`/wishlist/${id}`), {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await fetch(getApiUrl('/wishlist'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ propertyId: id })
        });
      }
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      console.error('Wishlist error:', error);
    }
  };

  const getAverageRating = () => {
    if (!property?.reviews?.length) return 4.9;
    const sum = property.reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / property.reviews.length).toFixed(2);
  };

  if (loading) {
    return (
      <div className="property-detail">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading property...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="property-detail">
        <div className="not-found">
          <h2>Property not found</h2>
          <button onClick={() => navigate('/listings')} className="btn-primary">
            Browse Listings
          </button>
        </div>
      </div>
    );
  }

  const nights = calculateNights();
  const images = property.images?.length > 0 ? property.images : fallbackProperties[0].images;

  return (
    <div className="property-detail">
      <div className="property-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} /> Back
        </button>
        <div className="header-actions">
          <button 
            className={`action-btn ${isWishlisted ? 'active' : ''}`} 
            onClick={handleWishlist}
          >
            <Heart size={20} fill={isWishlisted ? '#e53e3e' : 'none'} color={isWishlisted ? '#e53e3e' : 'currentColor'} />
          </button>
          <button className="action-btn"><Share2 size={20} /></button>
        </div>
      </div>

      {showGalleryModal && (
        <div className="gallery-modal" onClick={() => setShowGalleryModal(false)}>
          <button className="modal-close" onClick={() => setShowGalleryModal(false)}>
            <X size={28} />
          </button>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={images[selectedImage]} alt={`Gallery ${selectedImage}`} />
            <button className="modal-nav prev" onClick={() => setSelectedImage((selectedImage - 1 + images.length) % images.length)}>
              <ChevronLeft size={32} />
            </button>
            <button className="modal-nav next" onClick={() => setSelectedImage((selectedImage + 1) % images.length)}>
              <ChevronRight size={32} />
            </button>
            <div className="modal-counter">{selectedImage + 1} / {images.length}</div>
          </div>
        </div>
      )}

      <div className="property-image-section">
        <div className="gallery-grid">
          <div className="main-image" onClick={() => { setSelectedImage(0); setShowGalleryModal(true); }}>
            <img src={images[0]} alt={property.title} />
          </div>
          <div className="side-images">
            {images.slice(1, 4).map((img, idx) => (
              <div key={idx} className="side-image" onClick={() => { setSelectedImage(idx + 1); setShowGalleryModal(true); }}>
                <img src={img} alt={`Gallery ${idx + 1}`} />
              </div>
            ))}
          </div>
          <button className="view-all-gallery" onClick={() => { setSelectedImage(0); setShowGalleryModal(true); }}>
            <span>View all {images.length} photos</span>
          </button>
        </div>
      </div>

      <div className="property-content">
        <div className="property-main">
          <h1>{property.title}</h1>
          <div className="property-meta">
            <div className="property-rating">
              <Star size={16} fill="#ffc107" color="#ffc107" />
              <span>{getAverageRating()}</span>
              <span className="review-count">({property._count?.reviews || property.reviews?.length || 0} reviews)</span>
            </div>
            <div className="property-location">
              <MapPin size={16} />
              <span>{property.location || `${property.city}, ${property.country}`}</span>
            </div>
          </div>

          <div className="property-details-grid">
            <div className="detail-item">
              <Users size={20} />
              <span>{property.maxGuests} guests</span>
            </div>
            <div className="detail-item">
              <Bed size={20} />
              <span>{property.bedrooms} bedrooms</span>
            </div>
            <div className="detail-item">
              <Bath size={20} />
              <span>{property.bathrooms} bathrooms</span>
            </div>
          </div>

          <div className="property-section">
            <h2>About this place</h2>
            <p>{property.description}</p>
          </div>

          <div className="property-section">
            <h2>What this place offers</h2>
            <div className="amenities-grid">
              {property.amenities?.map((amenity, idx) => (
                <div key={idx} className="amenity-item">
                  <Check size={18} />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {property.host && (
            <div className="property-section host-section">
              <h2>Hosted by {property.host.firstName} {property.host.lastName}</h2>
              <div className="host-info">
                <div className="host-avatar">
                  {property.host.avatar ? (
                    <img src={property.host.avatar} alt={property.host.firstName} />
                  ) : (
                    <div className="avatar-placeholder">
                      {property.host.firstName[0]}{property.host.lastName[0]}
                    </div>
                  )}
                </div>
                <div className="host-details">
                  <p>Superhost</p>
                  <p>Response rate: 100%</p>
                </div>
              </div>
            </div>
          )}

          {property.reviews && property.reviews.length > 0 && (
            <div className="property-section">
              <h2>Reviews</h2>
              <div className="reviews-list">
                {property.reviews.slice(0, 5).map((review) => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <div className="review-user">
                        <div className="user-avatar">
                          {review.user.firstName[0]}{review.user.lastName[0]}
                        </div>
                        <div>
                          <h4>{review.user.firstName} {review.user.lastName}</h4>
                          <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="review-rating">
                        <Star size={14} fill="#ffc107" color="#ffc107" />
                        <span>{review.rating}</span>
                      </div>
                    </div>
                    <p>{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="property-sidebar">
          <div className="booking-card">
            {bookingSuccess ? (
              <div className="booking-success">
                <Check size={48} color="#48bb78" />
                <h3>Booking Confirmed!</h3>
                {bookingRef && <p className="booking-ref">Reference: {bookingRef.slice(-8).toUpperCase()}</p>}
                <p>Redirecting to your reservations...</p>
              </div>
            ) : (
              <>
                <div className="booking-price">
                  <span className="price">${property.price}</span>
                  <span className="per-night">/ night</span>
                </div>

                <div className="booking-form">
                  <div className="date-inputs">
                    <div className="date-input">
                      <label>Check-in</label>
                      <input 
                        type="date" 
                        value={checkIn} 
                        onChange={(e) => setCheckIn(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="date-input">
                      <label>Check-out</label>
                      <input 
                        type="date" 
                        value={checkOut} 
                        onChange={(e) => setCheckOut(e.target.value)}
                        min={checkIn || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  <div className="guests-input">
                    <label>Guests</label>
                    <select value={guests} onChange={(e) => setGuests(parseInt(e.target.value))}>
                      {[...Array(property.maxGuests)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1} guest{i > 0 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  {bookingError && (
                    <div className="booking-error">{bookingError}</div>
                  )}

                  <button 
                    className="reserve-btn" 
                    onClick={handleBooking}
                    disabled={bookingLoading}
                  >
                    {bookingLoading ? 'Processing...' : user ? 'Reserve' : 'Login to Book'}
                  </button>
                </div>

                {nights > 0 && (
                  <div className="booking-summary">
                    <div className="summary-row">
                      <span>${property.price} x {nights} night{nights > 1 ? 's' : ''}</span>
                      <span>${property.price * nights}</span>
                    </div>
                    <div className="summary-row">
                      <span>Service fee</span>
                      <span>${Math.round(property.price * nights * 0.12)}</span>
                    </div>
                    <div className="summary-row total">
                      <span>Total</span>
                      <span>${Math.round(calculateTotal())}</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
