import { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Menu, UserCheck, UserX, Trash2 } from 'lucide-react';
import { getApiUrl } from '../../config/api';
import AdminSidebar from '../../components/AdminSidebar';
import './AdminDashboard.css';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  _count: { properties: number; bookings: number };
}

export default function AdminUsers() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter, page]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (roleFilter) params.append('role', roleFilter);
      params.append('page', page.toString());

      const res = await fetch(getApiUrl(`/admin/users?${params}`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
        setTotalPages(data.pages);
      }
    } catch (error) {
      console.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (userId: string, role: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(getApiUrl(`/admin/users/${userId}/role`), {
        method: 'PUT',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role })
      });
      fetchUsers();
    } catch (error) {
      console.error('Failed to update role');
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await fetch(getApiUrl(`/admin/users/${userId}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user');
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
            <h1>Users Management</h1>
            <p>Manage all platform users</p>
          </div>
        </header>

        <div className="admin-content">
          <div className="admin-filters">
            <div className="search-input">
              <Search size={20} />
              <input 
                type="text" 
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select 
              value={roleFilter} 
              onChange={(e) => setRoleFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Roles</option>
              <option value="USER">Users</option>
              <option value="HOST">Hosts</option>
              <option value="ADMIN">Admins</option>
            </select>
          </div>

          <section className="admin-section">
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Properties</th>
                    <th>Bookings</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={7} className="empty-state">Loading...</td></tr>
                  ) : users.length === 0 ? (
                    <tr><td colSpan={7} className="empty-state">No users found</td></tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="user-cell">
                            <div className="user-avatar-small">{user.firstName.charAt(0)}</div>
                            <span>{user.firstName} {user.lastName}</span>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <select 
                            value={user.role}
                            onChange={(e) => updateRole(user.id, e.target.value)}
                            className="role-select"
                          >
                            <option value="USER">User</option>
                            <option value="HOST">Host</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        </td>
                        <td>{user._count.properties}</td>
                        <td>{user._count.bookings}</td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="action-icons">
                            <button 
                              className="icon-action delete"
                              onClick={() => deleteUser(user.id)}
                              title="Delete user"
                            >
                              <Trash2 size={16} />
                            </button>
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
