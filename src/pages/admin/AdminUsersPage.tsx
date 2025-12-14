import { useState } from 'react';
import { Search, Mail, Phone, MapPin, Edit2, Trash2, MoreVertical, Shield } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import { adminUsers } from '../../data/adminMockData';
import '../Dashboard.css';

export default function AdminUsers() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const filtered = adminUsers.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="admin-main dashboard-main">
        <header className="admin-header dashboard-header">
          <div>
            <h1>Users Management</h1>
            <p>Manage hosts, guests, and platform users</p>
          </div>
        </header>

        <div className="admin-content dashboard-content">
          {/* Filters */}
          <div className="filters-bar">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Roles</option>
              <option value="host">Hosts</option>
              <option value="guest">Guests</option>
            </select>
          </div>

          {/* Users Stats */}
          <div className="stat-cards-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <Shield size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Total Users</p>
                <p className="stat-value">{adminUsers.length}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                <Shield size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Active Hosts</p>
                <p className="stat-value">{adminUsers.filter(u => u.role === 'host').length}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                <Shield size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Active Guests</p>
                <p className="stat-value">{adminUsers.filter(u => u.role === 'guest').length}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
                <Shield size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Verified Users</p>
                <p className="stat-value">{adminUsers.length}</p>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">Users ({filtered.length})</h3>
            </div>
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Verified</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-cell">
                          <img src={user.avatar} alt={user.name} />
                          <div>
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.role}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <Mail size={14} className="text-gray-400" />
                          {user.email}
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge status-${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>N/A</td>
                      <td>
                        <span className="status-badge status-active">Active</span>
                      </td>
                      <td>
                        <span className="text-green-600 font-semibold">✓ Yes</span>
                      </td>
                      <td className="text-sm text-gray-500">{user.joined}</td>
                      <td>
                        <div className="action-buttons">
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
