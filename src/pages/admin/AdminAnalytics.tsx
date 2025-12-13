import { useState, useEffect } from 'react';
import { 
  Menu, 
  Users, 
  Home, 
  CalendarDays, 
  DollarSign,
  TrendingUp,
  PieChart
} from 'lucide-react';
import { getApiUrl } from '../../config/api';
import AdminSidebar from '../../components/AdminSidebar';
import './AdminDashboard.css';
import './AdminAnalytics.css';

interface Analytics {
  newUsersMonth: number;
  newUsersWeek: number;
  bookingsMonth: number;
  bookingsWeek: number;
  revenueMonth: number;
  usersByRole: { [key: string]: number };
  propertiesByStatus: { [key: string]: number };
  bookingsByStatus: { [key: string]: number };
}

export default function AdminAnalytics() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(getApiUrl('/admin/analytics'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  const renderProgressBar = (value: number, max: number, color: string) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    return (
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${percentage}%`, backgroundColor: color }}></div>
      </div>
    );
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
            <h1>Analytics Dashboard</h1>
            <p>Platform performance insights</p>
          </div>
        </header>

        <div className="admin-content">
          {loading ? (
            <div className="loading-state">Loading analytics...</div>
          ) : analytics ? (
            <>
              <div className="analytics-summary">
                <div className="summary-card">
                  <div className="summary-icon blue">
                    <Users size={24} />
                  </div>
                  <div className="summary-content">
                    <span className="summary-label">New Users (30 days)</span>
                    <span className="summary-value">{analytics.newUsersMonth}</span>
                    <span className="summary-sub">+{analytics.newUsersWeek} this week</span>
                  </div>
                </div>
                <div className="summary-card">
                  <div className="summary-icon green">
                    <CalendarDays size={24} />
                  </div>
                  <div className="summary-content">
                    <span className="summary-label">Bookings (30 days)</span>
                    <span className="summary-value">{analytics.bookingsMonth}</span>
                    <span className="summary-sub">+{analytics.bookingsWeek} this week</span>
                  </div>
                </div>
                <div className="summary-card">
                  <div className="summary-icon gold">
                    <DollarSign size={24} />
                  </div>
                  <div className="summary-content">
                    <span className="summary-label">Revenue (30 days)</span>
                    <span className="summary-value">${analytics.revenueMonth.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="analytics-grid">
                <section className="analytics-section">
                  <h2><Users size={20} /> Users by Role</h2>
                  <div className="stat-breakdown">
                    {Object.entries(analytics.usersByRole).map(([role, count]) => (
                      <div key={role} className="breakdown-item">
                        <div className="breakdown-header">
                          <span className="breakdown-label">{role}</span>
                          <span className="breakdown-value">{count}</span>
                        </div>
                        {renderProgressBar(
                          count, 
                          Object.values(analytics.usersByRole).reduce((a, b) => a + b, 0),
                          role === 'ADMIN' ? '#1a3b8f' : role === 'HOST' ? '#28a745' : '#6c757d'
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                <section className="analytics-section">
                  <h2><Home size={20} /> Properties by Status</h2>
                  <div className="stat-breakdown">
                    {Object.entries(analytics.propertiesByStatus).map(([status, count]) => (
                      <div key={status} className="breakdown-item">
                        <div className="breakdown-header">
                          <span className="breakdown-label">{status}</span>
                          <span className="breakdown-value">{count}</span>
                        </div>
                        {renderProgressBar(
                          count, 
                          Object.values(analytics.propertiesByStatus).reduce((a, b) => a + b, 0),
                          status === 'ACTIVE' ? '#28a745' : status === 'PENDING' ? '#ffc107' : '#6c757d'
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                <section className="analytics-section">
                  <h2><CalendarDays size={20} /> Bookings by Status</h2>
                  <div className="stat-breakdown">
                    {Object.entries(analytics.bookingsByStatus).map(([status, count]) => (
                      <div key={status} className="breakdown-item">
                        <div className="breakdown-header">
                          <span className="breakdown-label">{status}</span>
                          <span className="breakdown-value">{count}</span>
                        </div>
                        {renderProgressBar(
                          count, 
                          Object.values(analytics.bookingsByStatus).reduce((a, b) => a + b, 0),
                          status === 'COMPLETED' ? '#17a2b8' : 
                          status === 'CONFIRMED' ? '#28a745' : 
                          status === 'PENDING' ? '#ffc107' : '#dc3545'
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </>
          ) : (
            <div className="empty-state">Unable to load analytics</div>
          )}
        </div>
      </main>
    </div>
  );
}
