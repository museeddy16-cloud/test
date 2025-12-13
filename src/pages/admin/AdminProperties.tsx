import { useState, useEffect } from 'react';
import { Search, Menu, Check, X, Star, Trash2, Eye } from 'lucide-react';
import { getApiUrl } from '../../config/api';
import AdminSidebar from '../../components/AdminSidebar';
import './AdminDashboard.css';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  status: string;
  featured: boolean;
  host: { firstName: string; lastName: string; email: string };
  _count: { bookings: number; reviews: number };
  createdAt: string;
}

export default function AdminProperties() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProperties();
  }, [search, statusFilter, page]);

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      params.append('page', page.toString());

      const res = await fetch(getApiUrl(`/admin/properties?${params}`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProperties(data.properties);
        setTotalPages(data.pages);
      }
    } catch (error) {
      console.error('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (propertyId: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(getApiUrl(`/admin/properties/${propertyId}/status`), {
        method: 'PUT',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      fetchProperties();
    } catch (error) {
      console.error('Failed to update status');
    }
  };

  const toggleFeatured = async (propertyId: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(getApiUrl(`/admin/properties/${propertyId}/featured`), {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProperties();
    } catch (error) {
      console.error('Failed to toggle featured');
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="admin-main">
        <header className="admin-header">
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <div>
            <h1>Properties Management</h1>
            <p>Manage all platform properties</p>
          </div>
        </header>

        <div className="admin-content">
          <div className="admin-filters">
            <div className="search-input">
              <Search size={20} />
              <input 
                type="text" 
                placeholder="Search properties..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>

          <section className="admin-section">
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Host</th>
                    <th>Price/Night</th>
                    <th>Status</th>
                    <th>Bookings</th>
                    <th>Featured</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={7} className="empty-state">Loading...</td></tr>
                  ) : properties.length === 0 ? (
                    <tr><td colSpan={7} className="empty-state">No properties found</td></tr>
                  ) : (
                    properties.map((property) => (
                      <tr key={property.id}>
                        <td>
                          <div className="property-cell">
                            <strong>{property.title}</strong>
                            <span>{property.location}</span>
                          </div>
                        </td>
                        <td>{property.host.firstName} {property.host.lastName}</td>
                        <td>${property.price}</td>
                        <td>
                          <select 
                            value={property.status}
                            onChange={(e) => updateStatus(property.id, e.target.value)}
                            className="status-select"
                          >
                            <option value="PENDING">Pending</option>
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                            <option value="DRAFT">Draft</option>
                          </select>
                        </td>
                        <td>{property._count.bookings}</td>
                        <td>
                          <button 
                            className={`featured-btn ${property.featured ? 'active' : ''}`}
                            onClick={() => toggleFeatured(property.id)}
                          >
                            <Star size={16} fill={property.featured ? 'currentColor' : 'none'} />
                          </button>
                        </td>
                        <td>
                          <div className="action-icons">
                            <a href={`/property/${property.id}`} className="icon-action view" title="View">
                              <Eye size={16} />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </button>
                <span>Page {page} of {totalPages}</span>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
