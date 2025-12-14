import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Menu, Bell, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import HostSidebar from '../components/HostSidebar';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function HostLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Double-check after a short delay to ensure context is updated
    const timer = setTimeout(() => {
      if (user && user.role !== 'HOST' && user.role !== 'ADMIN') {
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

  if ((user.role !== 'HOST' && user.role !== 'ADMIN') || shouldRedirect) {
    return <Navigate to="/account" />;
  }

  return (
    <div className="dashboard-layout host-layout">
      <HostSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
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
            <input type="text" placeholder="Search..." />
          </div>

          <div className="header-actions">
            <button className="header-icon-btn">
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </button>
            <div className="header-user">
              <span>{user.firstName}</span>
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
