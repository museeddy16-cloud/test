import { useState } from 'react';
import { Search, Calendar, DollarSign, User, Edit2, Trash2, Eye } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import { adminBookings } from '../../data/adminMockData';
import '../Dashboard.css';

export default function AdminBookings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = adminBookings.filter((booking) => {
    const matchesSearch = booking.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.guest.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const calculateStats = () => {
    const total = adminBookings.length;
    const confirmed = adminBookings.filter(b => b.status === 'confirmed').length;
    const pending = adminBookings.filter(b => b.status === 'pending').length;
    const completed = adminBookings.filter(b => b.status === 'completed').length;
    const totalRevenue = adminBookings.reduce((sum, b) => sum + b.amount, 0);

    return { total, confirmed, pending, completed, totalRevenue };
  };

  const stats = calculateStats();

  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="admin-main dashboard-main">
        <header className="admin-header dashboard-header">
          <div>
            <h1>Bookings Management</h1>
            <p>Monitor and manage all property bookings</p>
          </div>
        </header>

        <div className="admin-content dashboard-content">
          {/* Stats */}
          <div className="stat-cards-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <Calendar size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Total Bookings</p>
                <p className="stat-value">{stats.total}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                <Calendar size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Confirmed</p>
                <p className="stat-value">{stats.confirmed}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                <Calendar size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Pending</p>
                <p className="stat-value">{stats.pending}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
                <DollarSign size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Revenue</p>
                <p className="stat-value">${stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="filters-bar">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search by property or guest..."
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
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Bookings Table */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">Bookings ({filtered.length})</h3>
            </div>
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Property</th>
                    <th>Guest</th>
                    <th>Dates</th>
                    <th>Nights</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((booking) => {
                    const nights = Math.ceil(
                      (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24)
                    );
                    return (
                    <tr key={booking.id}>
                      <td>
                        <span className="text-blue-600 font-mono text-sm">#{booking.id}</span>
                      </td>
                      <td className="font-semibold">{booking.property}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-gray-400" />
                          {booking.guest}
                        </div>
                      </td>
                      <td className="text-sm">
                        {booking.checkIn} to {booking.checkOut}
                      </td>
                      <td className="font-semibold">{nights}</td>
                      <td className="text-green-600 font-semibold">${booking.amount}</td>
                      <td>
                        <span className={`status-badge status-${booking.status}`}>
                          {booking.status}
                        </span>
                      </td>
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
                  );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
