import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, User, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '@assets/IRU_Voyage_1765463194437.png';
import './Header.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <img src={logo} alt="IRU Voyage" />
          <span>IRU Voyage</span>
        </Link>

        <div className="search-bar">
          <div className="search-item">
            <span>Anywhere</span>
          </div>
          <div className="search-divider"></div>
          <div className="search-item">
            <span>Any week</span>
          </div>
          <div className="search-divider"></div>
          <div className="search-item">
            <span>Add guests</span>
          </div>
          <button className="search-btn">
            <Search size={16} />
          </button>
        </div>

        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/listings" className="nav-link" onClick={() => setIsMenuOpen(false)}>Explore</Link>
          <Link to="/visit-rwanda" className="nav-link" onClick={() => setIsMenuOpen(false)}>Visit Rwanda</Link>
        </nav>

        <div className="header-actions">
          <button className="host-btn" onClick={() => navigate('/host-onboarding')}>Become a Host</button>
          <button className="icon-btn">
            <Globe size={18} />
          </button>
          
          <div className="user-menu-wrapper">
            <button 
              className="user-menu-btn"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <Menu size={18} />
              <div className="user-avatar">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={`${user.firstName} ${user.lastName}`}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <User size={18} />
                )}
              </div>
            </button>

            {isUserMenuOpen && (
              <div className="user-dropdown">
                {!user && (
                  <>
                    <button onClick={() => { navigate('/login'); setIsUserMenuOpen(false); }}>
                      Log in
                    </button>
                    <button onClick={() => { navigate('/signup'); setIsUserMenuOpen(false); }}>
                      Sign up
                    </button>
                    <div className="dropdown-divider"></div>
                  </>
                )}
                {user && (
                  <>
                    <div className="user-info-header">
                      <div className="user-avatar-large">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.firstName} />
                        ) : (
                          <User size={24} />
                        )}
                      </div>
                      <div className="user-details">
                        <div className="user-name-row">
                          <span className="user-name">{user.firstName} {user.lastName}</span>
                          <span className={`user-role-badge role-${user.role.toLowerCase()}`}>
                            {user.role}
                          </span>
                        </div>
                        <span className="user-email">{user.email}</span>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <button onClick={() => { 
                      const dashboardPath = user?.role === 'ADMIN' ? '/admin' : user?.role === 'HOST' ? '/host' : '/account';
                      navigate(dashboardPath); 
                      setIsUserMenuOpen(false); 
                    }}>
                      Dashboard
                    </button>
                    <button onClick={() => { 
                      const reservationsPath = user?.role === 'HOST' ? '/host/bookings' : '/account/bookings';
                      navigate(reservationsPath); 
                      setIsUserMenuOpen(false); 
                    }}>
                      {user?.role === 'HOST' ? 'My Reservations' : 'My Bookings'}
                    </button>
                    <button onClick={() => { 
                      const wishlistPath = user?.role === 'HOST' ? '/host' : '/account';
                      navigate(wishlistPath); 
                      setIsUserMenuOpen(false); 
                    }}>
                      Wishlist
                    </button>
                    <button onClick={() => { 
                      const messagesPath = user?.role === 'HOST' ? '/host/messages' : '/account/messages';
                      navigate(messagesPath); 
                      setIsUserMenuOpen(false); 
                    }}>
                      Messages
                    </button>
                    {(user.role === 'HOST' || user.roles?.includes('HOST')) && (
                      <>
                        <div className="dropdown-divider"></div>
                        <button onClick={() => { navigate('/host/listings'); setIsUserMenuOpen(false); }}>
                          My Listings
                        </button>
                        <button onClick={() => { navigate('/host/earnings'); setIsUserMenuOpen(false); }}>
                          Earnings
                        </button>
                        <button onClick={() => { navigate('/host/reviews'); setIsUserMenuOpen(false); }}>
                          Reviews
                        </button>
                      </>
                    )}
                    {(user.role === 'ADMIN' || user.roles?.includes('ADMIN')) && (
                      <>
                        <div className="dropdown-divider"></div>
                        <button onClick={() => { navigate('/admin'); setIsUserMenuOpen(false); }}>
                          Admin Dashboard
                        </button>
                      </>
                    )}
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout}>
                      Log out
                    </button>
                  </>
                )}
                {!user && (
                  <>
                    <button onClick={() => { navigate('/host-onboarding'); setIsUserMenuOpen(false); }}>
                      Host your home
                    </button>
                    <button onClick={() => { navigate('/pricing'); setIsUserMenuOpen(false); }}>
                      Advertise with us
                    </button>
                    <button onClick={() => { navigate('/help'); setIsUserMenuOpen(false); }}>
                      Help Center
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}
