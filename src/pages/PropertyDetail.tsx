import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Users, Bed, Bath, ChevronLeft, Heart, Share2, ChevronRight, X, Calendar, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getApiUrl } from '../config/api';
import './PropertyDetail.css';
import './PropertyDetailLuxury.css';

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
  const [activeTab, setActiveTab] = useState('overview');

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
    <div className="property-detail-luxury">
      {/* Sticky Header with Price */}
      <div className="property-header-luxury">
        <div className="header-luxury-container">
          <div className="property-title-section">
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
          </div>
          <div className="property-price-display">
            <span className="price-currency">RWF</span>
            <span>{Math.floor(property.price).toLocaleString()}</span>
            <span className="price-period">/ night</span>
          </div>
          <div className="header-actions-luxury">
            <button 
              className={`action-btn ${isWishlisted ? 'active' : ''}`} 
              onClick={handleWishlist}
              title="Add to wishlist"
            >
              <Heart size={20} fill={isWishlisted ? '#e53e3e' : 'none'} color={isWishlisted ? '#e53e3e' : 'currentColor'} />
              Wishlist
            </button>
            <button className="action-btn" title="Share">
              <Share2 size={20} />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
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

      {/* Premium Gallery Grid */}
      <div className="gallery-luxury">
        <div className="gallery-grid-luxury">
          <div className="gallery-main-luxury" onClick={() => { setSelectedImage(0); setShowGalleryModal(true); }}>
            <img src={images[0]} alt={property.title} />
          </div>
          {images.slice(1, 4).map((img, idx) => (
            <div key={idx} className="gallery-item" onClick={() => { setSelectedImage(idx + 1); setShowGalleryModal(true); }}>
              <img src={img} alt={`Gallery ${idx + 1}`} />
              {idx === 2 && images.length > 4 && (
                <div className="gallery-item-overlay">+{images.length - 4} more</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content with Tabs and Sidebar */}
      <div className="property-content-luxury">
        <div className="property-main">
          {/* Tab Navigation */}
          <div className="property-tabs-luxury">
            {['overview', 'amenities', 'package', 'rates', 'calendar'].map(tab => (
              <button
                key={tab}
                className={`tab-button-luxury ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'overview' && 'Overview'}
                {tab === 'amenities' && 'Amenities'}
                {tab === 'package' && 'Package'}
                {tab === 'rates' && 'Rates'}
                {tab === 'calendar' && 'Calendar'}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="tab-content-luxury">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <div className="property-about">
                  <h2>About this place</h2>
                  <p>{property.description}</p>
                </div>

                <div className="property-about">
                  <h2>Property Details</h2>
                  <div className="property-details-grid">
                    <div className="detail-item">
                      <Users size={20} />
                      <span><strong>{property.maxGuests}</strong> guests</span>
                    </div>
                    <div className="detail-item">
                      <Bed size={20} />
                      <span><strong>{property.bedrooms}</strong> bedrooms</span>
                    </div>
                    <div className="detail-item">
                      <Bath size={20} />
                      <span><strong>{property.bathrooms}</strong> bathrooms</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Amenities Tab - Organized by Sections */}
            {activeTab === 'amenities' && (
              <div className="amenities-sections">
                {property.amenities && property.amenities.length > 0 ? (
                  <>
                    {/* Living Room Amenities */}
                    {property.amenities.slice(0, 3).length > 0 && (
                      <div className="amenity-section">
                        <h3>Living Area</h3>
                        <ul>
                          {property.amenities.slice(0, 3).map((amenity, idx) => (
                            <li key={idx}>
                              <span className="amenity-bullet"></span>
                              <span>{amenity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Bedroom Amenities */}
                    {property.amenities.slice(3, 6).length > 0 && (
                      <div className="amenity-section">
                        <h3>Bedroom</h3>
                        <ul>
                          {property.amenities.slice(3, 6).map((amenity, idx) => (
                            <li key={idx}>
                              <span className="amenity-bullet"></span>
                              <span>{amenity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Kitchen Amenities */}
                    {property.amenities.slice(6, 9).length > 0 && (
                      <div className="amenity-section">
                        <h3>Kitchen</h3>
                        <ul>
                          {property.amenities.slice(6, 9).map((amenity, idx) => (
                            <li key={idx}>
                              <span className="amenity-bullet"></span>
                              <span>{amenity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Bathroom Amenities */}
                    {property.amenities.slice(9).length > 0 && (
                      <div className="amenity-section">
                        <h3>Bathroom</h3>
                        <ul>
                          {property.amenities.slice(9).map((amenity, idx) => (
                            <li key={idx}>
                              <span className="amenity-bullet"></span>
                              <span>{amenity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                ) : (
                  <p>No amenities listed for this property.</p>
                )}
              </div>
            )}

            {/* Package Tab */}
            {activeTab === 'package' && (
              <div className="property-about">
                <h2>Available Packages</h2>
                <p>This property offers flexible booking options:</p>
                <ul style={{ marginTop: '16px', paddingLeft: '20px' }}>
                  <li>Nightly rate: RWF {Math.floor(property.price).toLocaleString()}</li>
                  <li>Weekly discount: Up to 10% off</li>
                  <li>Monthly discount: Up to 20% off</li>
                  <li>Flexible cancellation available</li>
                </ul>
              </div>
            )}

            {/* Rates Tab */}
            {activeTab === 'rates' && (
              <div className="property-about">
                <h2>Pricing Information</h2>
                <div style={{ marginTop: '24px', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #e0e0e0' }}>
                    <span>Nightly Rate</span>
                    <strong>RWF {Math.floor(property.price).toLocaleString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #e0e0e0' }}>
                    <span>Cleaning Fee</span>
                    <strong>RWF {Math.floor(property.price * 0.1).toLocaleString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #e0e0e0' }}>
                    <span>Service Fee (per booking)</span>
                    <strong>12%</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '700' }}>
                    <span>Total per night (estimated)</span>
                    <strong>RWF {Math.floor(property.price * 1.22).toLocaleString()}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Calendar Tab */}
            {activeTab === 'calendar' && (
              <div className="property-about">
                <h2>Availability Calendar</h2>
                <p style={{ marginTop: '16px', color: 'var(--text-light)' }}>
                  Check availability and book your dates. This property is available for bookings starting from today.
                </p>
                <div style={{ marginTop: '24px', padding: '20px', background: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-light)', marginBottom: '12px' }}>Interactive calendar feature</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-light)' }}>Use the booking form on the right to select your check-in and check-out dates</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Booking Card Sidebar */}
        <div className="booking-card-luxury">
          {bookingSuccess ? (
            <div className="booking-success">
              <Check size={48} color="#48bb78" />
              <h3>Booking Confirmed!</h3>
              {bookingRef && <p className="booking-ref">Reference: {bookingRef.slice(-8).toUpperCase()}</p>}
              <p>Redirecting to your reservations...</p>
            </div>
          ) : (
            <>
              <div className="booking-price-luxury">
                <span className="currency">RWF</span>
                <span>{Math.floor(property.price).toLocaleString()}</span>
                <span className="period">/ night</span>
              </div>

              <div className="booking-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Arrive</label>
                    <input 
                      type="date" 
                      value={checkIn} 
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="form-group">
                    <label>Departure</label>
                    <input 
                      type="date" 
                      value={checkOut} 
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Adults</label>
                    <select value={guests} onChange={(e) => setGuests(parseInt(e.target.value))}>
                      {[...Array(property.maxGuests)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Children</label>
                    <select>
                      <option>0</option>
                      <option>1</option>
                      <option>2</option>
                      <option>3+</option>
                    </select>
                  </div>
                </div>

                {bookingError && (
                  <div className="booking-error">{bookingError}</div>
                )}

                {nights > 0 && (
                  <div className="total-price">
                    <span>Total ({nights} nights)</span>
                    <strong>RWF {Math.floor(calculateTotal()).toLocaleString()}</strong>
                  </div>
                )}

                <button 
                  className="booking-btn-luxury" 
                  onClick={handleBooking}
                  disabled={bookingLoading}
                >
                  {bookingLoading ? 'PROCESSING...' : user ? 'BOOK NOW' : 'LOGIN TO BOOK'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Related Properties Section */}
      {fallbackProperties.length > 1 && (
        <div className="related-properties-luxury">
          <h2>Similar Accommodations</h2>
          <div className="properties-grid-luxury">
            {fallbackProperties.slice(0, 4).map(prop => (
              <div 
                key={prop.id} 
                className="property-card-luxury"
                onClick={() => navigate(`/property/${prop.id}`)}
              >
                <img src={prop.images[0]} alt={prop.title} className="property-card-image" />
                <div className="property-card-info">
                  <h3 className="property-card-title">{prop.title}</h3>
                  <div className="property-card-price">
                    RWF {Math.floor(prop.price).toLocaleString()}
                    <span style={{ fontSize: '12px', fontWeight: '400', color: 'var(--text-light)' }}> /night</span>
                  </div>
                  <div className="property-card-details">
                    <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    {prop.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
