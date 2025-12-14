import { useState } from 'react';
import { Search, ChevronDown, Edit2, Trash2, Eye, MoreVertical } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import { adminProperties } from '../../data/adminMockData';
import '../Dashboard.css';

export default function AdminProperties() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = adminProperties.filter((prop) => {
    const matchesSearch = prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prop.host.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prop.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || prop.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="admin-main dashboard-main">
        <header className="admin-header dashboard-header">
          <div>
            <h1>Properties Management</h1>
            <p>Manage and monitor all properties on the platform</p>
          </div>
        </header>

        <div className="admin-content dashboard-content">
          {/* Filters */}
          <div className="filters-bar">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search by title, host, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Properties Table */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">Properties ({filtered.length})</h3>
            </div>
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Host</th>
                    <th>Location</th>
                    <th>Price/Night</th>
                    <th>Status</th>
                    <th>Bookings</th>
                    <th>Revenue</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((property) => (
                    <tr key={property.id}>
                      <td>
                        <div className="property-cell">
                          <img src={property.image} alt={property.title} />
                          <div>
                            <p className="font-semibold">{property.title}</p>
                            <p className="text-xs text-gray-500">⭐ {property.rating}</p>
                          </div>
                        </div>
                      </td>
                      <td>{property.host}</td>
                      <td>{property.location}</td>
                      <td className="font-semibold">${property.price}</td>
                      <td>
                        <span className={`status-badge status-${property.status}`}>
                          {property.status}
                        </span>
                      </td>
                      <td className="font-semibold">{property.bookings}</td>
                      <td className="text-green-600 font-semibold">${property.revenue.toLocaleString()}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-icon" title="View">
                            <Eye size={16} />
                          </button>
                          <button className="btn-icon" title="Edit">
                            <Edit2 size={16} />
                          </button>
                          <button className="btn-icon btn-danger" title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
