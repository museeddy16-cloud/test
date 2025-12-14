import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getApiUrl } from '../../config/api';
import { 
  Users, 
  Home, 
  CalendarDays, 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  AlertCircle,
  ArrowUpRight,
  Menu,
  Eye
} from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import { adminStats, adminProperties, adminUsers, adminBookings, revenueData } from '../../data/adminMockData';
import '../Dashboard.css';

interface Stats {
  totalUsers: number;
  totalProperties: number;
  totalBookings: number;
  totalRevenue: number;
  pendingProperties: number;
  recentBookings: any[];
  revenueChange?: number;
  bookingsChange?: number;
  propertiesChange?: number;
  usersChange?: number;
}

interface RevenueData {
  month: string;
  revenue: number;
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalProperties: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingProperties: 0,
    recentBookings: [],
    revenueChange: 12.5,
    bookingsChange: 8.3,
    propertiesChange: 15.2,
    usersChange: 22.1,
  });
  const [loading, setLoading] = useState(true);

  // Mock revenue data
  const revenueData: RevenueData[] = [
    { month: 'January', revenue: 180000 },
    { month: 'February', revenue: 220000 },
    { month: 'March', revenue: 195000 },
    { month: 'April', revenue: 250000 },
    { month: 'May', revenue: 280000 },
    { month: 'June', revenue: 320000 },
    { month: 'July', revenue: 350000 },
    { month: 'August', revenue: 420000 },
  ];

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
    { 
      title: 'Total Revenue',
      value: `$${(stats.totalRevenue / 1000).toFixed(1)}K`,
      change: stats.revenueChange || 0,
      icon: DollarSign,
      color: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    },
    { 
      title: 'Total Bookings',
      value: stats.totalBookings.toLocaleString(),
      change: stats.bookingsChange || 0,
      icon: CalendarDays,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
    },
    { 
      title: 'Active Properties',
      value: stats.totalProperties.toLocaleString(),
      change: stats.propertiesChange || 0,
      icon: Home,
      color: 'bg-gradient-to-br from-amber-500 to-amber-600',
    },
    { 
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      change: stats.usersChange || 0,
      icon: Users,
      color: 'bg-gradient-to-br from-cyan-500 to-cyan-600',
    },
  ];

  const maxRevenue = Math.max(...revenueData.map((d) => d.revenue));

  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="admin-main dashboard-main">
        <header className="admin-header dashboard-header">
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome back! Here's an overview of your platform</p>
          </div>
        </header>

        <div className="admin-content dashboard-content space-y-6">
          {/* Alert for pending properties */}
          {stats.pendingProperties > 0 && (
            <div className="admin-alert">
              <AlertCircle size={20} />
              <span>{stats.pendingProperties} properties pending approval</span>
              <Link to="/admin/properties?status=PENDING" className="alert-link">Review now</Link>
            </div>
          )}

          {/* Stat Cards */}
          <div className="stat-cards-grid">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              const isPositive = stat.change > 0;
              return (
                <div key={stat.title} className="stat-card-modern">
                  <div className="stat-card-header">
                    <div className={`stat-icon-wrapper ${stat.color}`}>
                      <Icon size={24} />
                    </div>
                    <div className={`stat-change ${isPositive ? 'positive' : 'negative'}`}>
                      {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      <span>{Math.abs(stat.change)}%</span>
                    </div>
                  </div>
                  <div className="stat-card-content">
                    <p className="stat-label">{stat.title}</p>
                    <p className="stat-value">{loading ? '...' : stat.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Revenue Overview */}
          <div className="dashboard-grid-2">
            <div className="dashboard-card">
              <h3 className="card-title">Revenue Overview</h3>
              <div className="revenue-chart">
                {revenueData.map((data) => {
                  const percentage = (data.revenue / maxRevenue) * 100;
                  return (
                    <div key={data.month} className="revenue-item">
                      <div className="revenue-header">
                        <span className="revenue-month">{data.month}</span>
                        <span className="revenue-amount">${(data.revenue / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="revenue-bar-container">
                        <div
                          className="revenue-bar"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="dashboard-card">
              <h3 className="card-title">Quick Actions</h3>
              <div className="quick-actions-grid">
                <Link to="/admin/users" className="action-button">
                  <Users size={20} />
                  <span>Manage Users</span>
                </Link>
                <Link to="/admin/properties" className="action-button">
                  <Home size={20} />
                  <span>Manage Properties</span>
                </Link>
                <Link to="/admin/bookings" className="action-button">
                  <CalendarDays size={20} />
                  <span>View Bookings</span>
                </Link>
                <Link to="/admin/analytics" className="action-button">
                  <TrendingUp size={20} />
                  <span>Analytics</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Bookings Table */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">Recent Bookings</h3>
              <Link to="/admin/bookings" className="view-all">
                View all <ArrowUpRight size={16} />
              </Link>
            </div>
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Guest</th>
                    <th>Property</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentBookings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="empty-state">No recent bookings</td>
                    </tr>
                  ) : (
                    stats.recentBookings.slice(0, 5).map((booking: any) => (
                      <tr key={booking.id}>
                        <td>{booking.user?.firstName} {booking.user?.lastName}</td>
                        <td>{booking.property?.title}</td>
                        <td>{booking.checkIn || 'N/A'}</td>
                        <td>{booking.checkOut || 'N/A'}</td>
                        <td className="font-semibold">${booking.totalPrice?.toLocaleString()}</td>
                        <td>
                          <span className={`status-badge status-${booking.status?.toLowerCase()}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td>
                          <button className="btn-icon">
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
