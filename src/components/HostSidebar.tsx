import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User,
  Home, 
  DollarSign,
  CreditCard,
  CalendarDays, 
  Wallet, 
  Star,
  MessageSquare,
  Settings, 
  LogOut,
  Crown,
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import logo from '@assets/IRU_Voyage_1765463194437.png';

interface HostSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  icon: React.ElementType;
  label: string;
  path: string;
  children?: { label: string; path: string }[];
}

export default function HostSidebar({ isOpen, onClose }: HostSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const menuItems: MenuItem[] = [
    { icon: LayoutDashboard, label: 'Overview', path: '/host' },
    { 
      icon: User, 
      label: 'Profile & Verification', 
      path: '/host/profile',
      children: [
        { label: 'Personal Info', path: '/host/profile' },
        { label: 'Verification', path: '/host/profile/verification' },
      ]
    },
    { 
      icon: Home, 
      label: 'Listings', 
      path: '/host/listings',
      children: [
        { label: 'All Listings', path: '/host/listings' },
        { label: 'Create Listing', path: '/host/listings/create' },
      ]
    },
    { 
      icon: DollarSign, 
      label: 'Listing Pricing', 
      path: '/host/pricing',
      children: [
        { label: 'Base Pricing', path: '/host/pricing' },
        { label: 'Seasonal Pricing', path: '/host/pricing/seasonal' },
        { label: 'Discounts', path: '/host/pricing/discounts' },
      ]
    },
    { 
      icon: CreditCard, 
      label: 'Subscription', 
      path: '/host/subscription',
      children: [
        { label: 'Current Plan', path: '/host/subscription' },
        { label: 'Billing History', path: '/host/subscription/billing' },
      ]
    },
    { icon: CalendarDays, label: 'Bookings', path: '/host/bookings' },
    { 
      icon: Wallet, 
      label: 'Earnings & Payouts', 
      path: '/host/earnings',
      children: [
        { label: 'Overview', path: '/host/earnings' },
        { label: 'Payouts', path: '/host/earnings/payouts' },
      ]
    },
    { icon: Star, label: 'Reviews', path: '/host/reviews' },
    { icon: MessageSquare, label: 'Messages', path: '/host/messages' },
    { icon: Settings, label: 'Settings', path: '/host/settings' },
  ];

  const toggleMenu = (path: string) => {
    setExpandedMenus(prev => 
      prev.includes(path) 
        ? prev.filter(p => p !== path)
        : [...prev, path]
    );
  };

  const isActive = (path: string) => location.pathname === path;
  const isParentActive = (item: MenuItem) => 
    location.pathname.startsWith(item.path);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <div className={`host-sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>
      <aside className={`host-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="host-sidebar-header">
          <Link to="/" className="host-sidebar-logo">
            <img src={logo} alt="IRU Voyage" />
            <span>IRU Voyage</span>
          </Link>
          <button className="host-sidebar-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="host-sidebar-badge">
          <Crown size={16} />
          <span>Host Dashboard</span>
        </div>

        <div className="host-sidebar-user">
          <div className="host-sidebar-avatar">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.firstName} />
            ) : (
              user?.firstName?.charAt(0) || 'H'
            )}
          </div>
          <div className="host-sidebar-user-info">
            <span className="user-name">{user?.firstName} {user?.lastName}</span>
            <span className="user-role">Host</span>
          </div>
        </div>

        <nav className="host-sidebar-nav">
          <ul className="host-sidebar-menu">
            {menuItems.map((item) => (
              <li key={item.path} className={item.children ? 'has-children' : ''}>
                {item.children ? (
                  <>
                    <button 
                      className={`host-sidebar-link ${isParentActive(item) ? 'active' : ''}`}
                      onClick={() => toggleMenu(item.path)}
                    >
                      <item.icon size={20} />
                      <span>{item.label}</span>
                      {expandedMenus.includes(item.path) ? (
                        <ChevronDown size={16} className="chevron" />
                      ) : (
                        <ChevronRight size={16} className="chevron" />
                      )}
                    </button>
                    <ul className={`submenu ${expandedMenus.includes(item.path) ? 'open' : ''}`}>
                      {item.children.map((child) => (
                        <li key={child.path}>
                          <Link 
                            to={child.path}
                            className={`submenu-link ${isActive(child.path) ? 'active' : ''}`}
                            onClick={onClose}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link 
                    to={item.path} 
                    className={`host-sidebar-link ${isActive(item.path) ? 'active' : ''}`}
                    onClick={onClose}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <div className="host-sidebar-divider"></div>

          <ul className="host-sidebar-menu">
            <li>
              <Link to="/account" className="host-sidebar-link" onClick={onClose}>
                <User size={20} />
                <span>Guest Dashboard</span>
              </Link>
            </li>
            <li>
              <button className="host-sidebar-link logout-btn" onClick={handleLogout}>
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
