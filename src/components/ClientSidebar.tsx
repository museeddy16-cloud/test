import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User,
  Shield,
  CalendarDays, 
  CreditCard,
  Star,
  MessageSquare,
  LogOut,
  X,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '@assets/IRU_Voyage_1765463194437.png';

interface ClientSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ClientSidebar({ isOpen, onClose }: ClientSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/account' },
    { icon: User, label: 'Profile', path: '/account/profile' },
    { icon: Shield, label: 'Security', path: '/account/security' },
    { icon: CalendarDays, label: 'My Bookings', path: '/account/bookings' },
    { icon: CreditCard, label: 'Payments & Invoices', path: '/account/payments' },
    { icon: Star, label: 'Reviews', path: '/account/reviews' },
    { icon: MessageSquare, label: 'Messages', path: '/account/messages' },
  ];

  const bottomItems = [
    { icon: HelpCircle, label: 'Help Center', path: '/help' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <div className={`client-sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>
      <aside className={`client-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="client-sidebar-header">
          <Link to="/" className="client-sidebar-logo">
            <img src={logo} alt="IRU Voyage" />
            <span>IRU Voyage</span>
          </Link>
          <button className="client-sidebar-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="client-sidebar-user">
          <div className="client-sidebar-avatar">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.firstName} />
            ) : (
              user?.firstName?.charAt(0) || 'G'
            )}
          </div>
          <div className="client-sidebar-user-info">
            <span className="user-name">{user?.firstName} {user?.lastName}</span>
            <span className="user-email">{user?.email}</span>
          </div>
        </div>

        <nav className="client-sidebar-nav">
          <ul className="client-sidebar-menu">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={`client-sidebar-link ${isActive(item.path) ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="client-sidebar-divider"></div>

          <ul className="client-sidebar-menu">
            {bottomItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={`client-sidebar-link ${isActive(item.path) ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
            <li>
              <button className="client-sidebar-link logout-btn" onClick={handleLogout}>
                <LogOut size={20} />
                <span>Log out</span>
              </button>
            </li>
          </ul>
        </nav>

        <div className="client-sidebar-cta">
          <p>Want to become a host?</p>
          <Link to="/host-onboarding" className="btn btn-primary btn-sm" onClick={onClose}>
            Start Hosting
          </Link>
        </div>
      </aside>
    </>
  );
}
