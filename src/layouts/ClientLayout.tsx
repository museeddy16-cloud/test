import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Menu, Bell, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ClientSidebar from '../components/ClientSidebar';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function ClientLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading..." />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="dashboard-layout client-layout">
      <ClientSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
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
            <input type="text" placeholder="Search bookings..." />
          </div>

          <div className="header-actions">
            <button className="header-icon-btn">
              <Bell size={20} />
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
