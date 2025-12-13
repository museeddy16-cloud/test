import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getApiUrl } from '../../config/api';
import { 
  Users, 
  Home, 
  CalendarDays, 
  DollarSign, 
  TrendingUp,
  AlertCircle,
  ArrowUpRight,
  Menu
} from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import './AdminDashboard.css';

interface Stats {
  totalUsers: number;
  totalProperties: number;
  totalBookings: number;
  totalRevenue: number;
  pendingProperties: number;
  recentBookings: any[];
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalProperties: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingProperties: 0,
    recentBookings: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(getApiUrl('/admin/stats'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { icon: Users, label: 'Total Users', value: stats.totalUsers, color: '#1a3b8f' },
    { icon: Home, label: 'Total Properties', value: stats.totalProperties, color: '#28a745' },
    { icon: CalendarDays, label: 'Total Bookings', value: stats.totalBookings, color: '#ffc107' },
    { icon: DollarSign, label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, color: '#17a2b8' }
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="admin-main">
        <header className="admin-header">
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome back! Here's an overview of your platform</p>
          </div>
        </header>

        <div className="admin-content">
          <section className="admin-stats">
            {statCards.map((stat, index) => (
              <div key={index} className="admin-stat-card">
                <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                  <stat.icon size={24} />
                </div>
                <div className="stat-info">
                  <span className="stat-value">{loading ? '...' : stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              </div>
            ))}
          </section>

          {stats.pendingProperties > 0 && (
            <div className="admin-alert">
              <AlertCircle size={20} />
              <span>{stats.pendingProperties} properties pending approval</span>
              <Link to="/admin/properties?status=PENDING">Review now</Link>
            </div>
          )}

          <div className="admin-grid">
            <section className="admin-section">
              <div className="section-header">
                <h2>Recent Bookings</h2>
                <Link to="/admin/bookings" className="view-all">
                  View all <ArrowUpRight size={16} />
                </Link>
              </div>
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Guest</th>
                      <th>Property</th>
                      <th>Status</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentBookings.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="empty-state">No recent bookings</td>
                      </tr>
                    ) : (
                      stats.recentBookings.map((booking: any) => (
                        <tr key={booking.id}>
                          <td>{booking.user?.firstName} {booking.user?.lastName}</td>
                          <td>{booking.property?.title}</td>
                          <td>
                            <span className={`status-badge ${booking.status.toLowerCase()}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td>${booking.totalPrice}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="admin-section quick-actions">
              <h2>Quick Actions</h2>
              <div className="action-buttons">
                <Link to="/admin/users" className="action-btn">
                  <Users size={20} />
                  <span>Manage Users</span>
                </Link>
                <Link to="/admin/properties" className="action-btn">
                  <Home size={20} />
                  <span>Manage Properties</span>
                </Link>
                <Link to="/admin/bookings" className="action-btn">
                  <CalendarDays size={20} />
                  <span>View Bookings</span>
                </Link>
                <Link to="/admin/analytics" className="action-btn">
                  <TrendingUp size={20} />
                  <span>Analytics</span>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
