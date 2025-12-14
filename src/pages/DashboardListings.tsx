import { Plus, Edit2, Trash2, Eye, MoreVertical } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../config/api';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

interface Property {
  id: string;
  title: string;
  location: string;
  city: string;
  country: string;
  price: number;
  status: string;
  images: string[];
  _count?: {
    reviews: number;
    bookings: number;
  };
}

export default function MyListings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [listings, setListings] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const res = await fetch(getApiUrl('/listings/host'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setListings(data.data || data);
      }
    } catch (error) {
      console.error('Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    
    try {
      const res = await fetch(getApiUrl(`/listings/${id}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setListings(listings.filter(l => l.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete listing');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'active';
      case 'PENDING': return 'pending';
      case 'INACTIVE': return 'inactive';
      case 'DRAFT': return 'draft';
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
            <h1>My Listings</h1>
            <p>Manage your properties and listings</p>
          </div>
          <button className="btn-primary" onClick={() => navigate('/host/listings/create')}>
            <Plus size={20} />
            Create New Listing
          </button>
        </header>

        <div className="dashboard-content">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading your listings...</p>
            </div>
          ) : listings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏠</div>
              <h3>No listings yet</h3>
              <p>Start hosting by creating your first property listing</p>
              <button className="btn-primary" onClick={() => navigate('/host/listings/create')}>
                <Plus size={20} />
                Create Your First Listing
              </button>
            </div>
          ) : (
            <div className="listings-table-container">
              <table className="listings-table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Location</th>
                    <th>Price/Night</th>
                    <th>Status</th>
                    <th>Bookings</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((listing) => (
                    <tr key={listing.id}>
                      <td>
                        <div className="listing-cell">
                          <img 
                            src={(listing.images && listing.images[0]) || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200'} 
                            alt={listing.title || 'Property'} 
                          />
                          <span>{listing.title || 'Untitled'}</span>
                        </div>
                      </td>
                      <td>{listing.location || (listing.city && listing.country ? `${listing.city}, ${listing.country}` : 'N/A')}</td>
                      <td>${listing.price || 0}</td>
                      <td>
                        <span className={`status-badge ${getStatusColor(listing.status || 'PENDING')}`}>
                          {(listing.status || 'pending').toLowerCase()}
                        </span>
                      </td>
                      <td>{listing._count?.bookings ?? 0}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-icon" 
                            title="View"
                            onClick={() => navigate(`/property/${listing.id}`)}
                          >
                            <Eye size={18} />
                          </button>
                          <button className="btn-icon" title="Edit">
                            <Edit2 size={18} />
                          </button>
                          <button 
                            className="btn-icon btn-danger" 
                            title="Delete"
                            onClick={() => handleDelete(listing.id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
