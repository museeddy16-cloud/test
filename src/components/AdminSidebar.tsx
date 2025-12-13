import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Home, 
  CalendarDays, 
  BarChart3, 
  Settings, 
  LogOut,
  Shield,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '@assets/IRU_Voyage_1765463194437.png';
import './AdminSidebar.css';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: Home, label: 'Properties', path: '/admin/properties' },
    { icon: CalendarDays, label: 'Bookings', path: '/admin/bookings' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <div className={`admin-sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>
      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <Link to="/" className="admin-sidebar-logo">
            <img src={logo} alt="IRU Voyage" />
            <span>IRU Voyage</span>
          </Link>
          <button className="admin-sidebar-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="admin-sidebar-badge">
          <Shield size={16} />
          <span>Admin Panel</span>
        </div>

        <div className="admin-sidebar-user">
          <div className="admin-sidebar-avatar">
            {user?.firstName?.charAt(0) || 'A'}
          </div>
          <div className="admin-sidebar-user-info">
            <span className="user-name">{user?.firstName} {user?.lastName}</span>
            <span className="user-role">Administrator</span>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          <ul className="admin-sidebar-menu">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={`admin-sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="admin-sidebar-divider"></div>

          <ul className="admin-sidebar-menu">
            <li>
              <Link to="/dashboard" className="admin-sidebar-link" onClick={onClose}>
                <Home size={20} />
                <span>Host Dashboard</span>
              </Link>
            </li>
            <li>
              <button className="admin-sidebar-link logout-btn" onClick={handleLogout}>
                <LogOut size={20} />
                <span>Log out</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}
