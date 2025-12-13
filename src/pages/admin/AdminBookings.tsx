import { useState, useEffect } from 'react';
import { Search, Menu, Eye, Calendar } from 'lucide-react';
import { getApiUrl } from '../../config/api';
import AdminSidebar from '../../components/AdminSidebar';
import './AdminDashboard.css';

interface Booking {
  id: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: string;
  user: { firstName: string; lastName: string; email: string };
  property: { title: string; location: string };
  createdAt: string;
}

export default function AdminBookings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, page]);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      params.append('page', page.toString());

      const res = await fetch(getApiUrl(`/admin/bookings?${params}`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings);
        setTotalPages(data.pages);
      }
    } catch (error) {
      console.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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
            <h1>Bookings Management</h1>
            <p>View and manage all platform bookings</p>
          </div>
        </header>

        <div className="admin-content">
          <div className="admin-filters">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <section className="admin-section">
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Guest</th>
                    <th>Property</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Guests</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Booked On</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={8} className="empty-state">Loading...</td></tr>
                  ) : bookings.length === 0 ? (
                    <tr><td colSpan={8} className="empty-state">No bookings found</td></tr>
                  ) : (
                    bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>
                          <div className="user-cell">
                            <div className="user-avatar-small">{booking.user.firstName.charAt(0)}</div>
                            <div>
                              <strong>{booking.user.firstName} {booking.user.lastName}</strong>
                              <span className="email-small">{booking.user.email}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="property-cell">
                            <strong>{booking.property.title}</strong>
                            <span>{booking.property.location}</span>
                          </div>
                        </td>
                        <td>{formatDate(booking.checkIn)}</td>
                        <td>{formatDate(booking.checkOut)}</td>
                        <td>{booking.guests}</td>
                        <td className="amount">${booking.totalPrice.toLocaleString()}</td>
                        <td>
                          <span className={`status-badge ${booking.status.toLowerCase()}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td>{formatDate(booking.createdAt)}</td>
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
