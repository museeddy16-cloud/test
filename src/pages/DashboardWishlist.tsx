import { Heart, Trash2, MapPin, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { getApiUrl } from '../config/api';
import './Dashboard.css';

interface WishlistItem {
  id: string;
  property: {
    id: string;
    title: string;
    location?: string;
    city: string;
    country: string;
    price: number;
    images: string[];
    _count?: {
      reviews: number;
    };
  };
}

export default function Wishlist() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await fetch(getApiUrl('/wishlist'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setWishlist(data);
      }
    } catch (error) {
      console.error('Failed to fetch wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (propertyId: string | undefined) => {
    if (!propertyId) return;
    try {
      const res = await fetch(getApiUrl(`/wishlist/${propertyId}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setWishlist(wishlist.filter(w => w.property?.id !== propertyId));
      }
    } catch (error) {
      console.error('Failed to remove from wishlist');
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>My Wishlist</h1>
            <p>Properties you've saved for later</p>
          </div>
          <span className="wishlist-count">{wishlist.length} Saved</span>
        </header>

        <div className="dashboard-content">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading your wishlist...</p>
            </div>
          ) : wishlist.length === 0 ? (
            <div className="empty-state">
              <Heart size={64} />
              <h2>No items in your wishlist</h2>
              <p>Start saving properties you love to view them later</p>
              <button className="btn-primary" onClick={() => navigate('/listings')}>
                Browse Properties
              </button>
            </div>
          ) : (
            <div className="wishlist-grid">
              {wishlist.map((item) => (
                <div key={item.id} className="wishlist-card">
                  <div className="wishlist-image-container">
                    <img 
                      src={(item.property?.images && item.property.images[0]) || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300'} 
                      alt={item.property?.title || 'Property'} 
                      className="wishlist-image"
                      onClick={() => navigate(`/property/${item.property?.id}`)}
                    />
                    <button 
                      className="btn-heart"
                      onClick={() => handleRemove(item.property?.id)}
                    >
                      <Heart size={20} fill="currentColor" />
                    </button>
                  </div>

                  <div className="wishlist-card-body">
                    <h3 onClick={() => navigate(`/property/${item.property?.id}`)} style={{ cursor: 'pointer' }}>
                      {item.property?.title || 'Untitled Property'}
                    </h3>
                    
                    <div className="wishlist-info">
                      <span className="location">
                        <MapPin size={16} />
                        {item.property?.location || (item.property?.city && item.property?.country ? `${item.property.city}, ${item.property.country}` : 'Location N/A')}
                      </span>
                    </div>

                    <div className="wishlist-footer">
                      <div className="price-rating">
                        <div className="price">${item.property?.price || 0}/night</div>
                        <div className="rating">
                          <Star size={14} fill="currentColor" />
                          {(4.9)?.toFixed(1) || '4.9'} ({item.property?._count?.reviews ?? 0})
                        </div>
                      </div>
                    </div>

                    <div className="wishlist-actions">
                      <button 
                        className="btn-secondary btn-small"
                        onClick={() => navigate(`/property/${item.property?.id}`)}
                      >
                        View Property
                      </button>
                      <button 
                        className="btn-danger-outline btn-small"
                        onClick={() => handleRemove(item.property?.id)}
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    </div>
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
