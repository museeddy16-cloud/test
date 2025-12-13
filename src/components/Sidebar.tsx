import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Home, 
  CalendarDays, 
  MessageSquare, 
  Heart, 
  Settings, 
  HelpCircle,
  LogOut,
  User,
  Star,
  Wallet,
  X
} from 'lucide-react';
import logo from '@assets/IRU_Voyage_1765463194437.png';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Home, label: 'My Listings', path: '/dashboard/listings' },
    { icon: CalendarDays, label: 'Reservations', path: '/dashboard/reservations' },
    { icon: MessageSquare, label: 'Messages', path: '/dashboard/messages' },
    { icon: Heart, label: 'Wishlist', path: '/dashboard/wishlist' },
    { icon: Star, label: 'Reviews', path: '/dashboard/reviews' },
    { icon: Wallet, label: 'Earnings', path: '/dashboard/earnings' },
  ];

  const bottomItems = [
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
    { icon: HelpCircle, label: 'Help Center', path: '/help' },
    { icon: LogOut, label: 'Log out', path: '/logout' },
  ];

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo">
            <img src={logo} alt="IRU Voyage" />
            <span>IRU Voyage</span>
          </Link>
          <button className="sidebar-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="sidebar-user">
          <div className="sidebar-avatar">
            <User size={24} />
          </div>
          <div className="sidebar-user-info">
            <span className="user-name">Guest User</span>
            <span className="user-email">guest@example.com</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="sidebar-divider"></div>

          <ul className="sidebar-menu">
            {bottomItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
