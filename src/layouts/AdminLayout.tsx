import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Menu, Bell, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Double-check after a short delay to ensure context is updated
    const timer = setTimeout(() => {
      if (user && user.role !== 'ADMIN') {
        setShouldRedirect(true);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [user]);

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading..." />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== 'ADMIN' || shouldRedirect) {
    return <Navigate to="/account" />;
  }

  return (
    <div className="dashboard-layout admin-layout">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="dashboard-main">
        <header className="dashboard-header">
          <button 
            className="menu-toggle"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="header-search">
            <Search size={18} />
            <input type="text" placeholder="Search users, listings..." />
          </div>

          <div className="header-actions">
            <button className="header-icon-btn">
              <Bell size={20} />
              <span className="notification-badge">5</span>
            </button>
            <div className="header-user admin-user">
              <span>{user.firstName}</span>
              <span className="user-badge">Admin</span>
            </div>
          </div>
        </header>

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
