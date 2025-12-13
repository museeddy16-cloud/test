import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Globe,
  DollarSign,
  MapPin,
  Phone
} from 'lucide-react';
import logo from '@assets/IRU_Voyage_1765463194437.png';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <img src={logo} alt="IRU Voyage" />
              <span>IRU Voyage</span>
            </Link>
            <p>Discover unique stays and experiences around the world. Your next adventure awaits.</p>
            
            {/* Contact Info */}
            <div className="footer-contact">
              <div className="contact-item">
                <MapPin size={18} />
                <span>Gahanga, Kicukiro, Kigali, Rwanda</span>
              </div>
              <div className="contact-item">
                <Phone size={18} />
                <span>
                  <a href="tel:+250795381733">0795 381 733</a> / 
                  <a href="tel:+250736318111">0736 318 111</a>
                </span>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="footer-social">
              <a 
                href="https://www.instagram.com/irubusinessgroup?igsh=Y2s1N25qY2xzM2Zu" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-link"
                title="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://x.com/IRUBUSINESSES?t=QHreTJ4D1GtZfix4tQIpyw&s=09" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-link"
                title="X (Twitter)"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="https://www.linkedin.com/in/iru-business-group-571ba3334?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-link"
                title="LinkedIn"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/>
                </svg>
              </a>
              <a 
                href="https://www.youtube.com/@IRUTV-2060" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-link"
                title="YouTube"
              >
                <Youtube size={20} />
              </a>
            </div>

            {/* Advertise CTA Button */}
            <Link to="/pricing" className="footer-advertise-btn">
              <DollarSign size={16} />
              Advertise Your Destination
            </Link>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4>Support</h4>
              <ul>
                <li><Link to="/help">Help Center</Link></li>
                <li><Link to="/safety">Safety Information</Link></li>
                <li><Link to="/help">Cancellation Options</Link></li>
                <li><Link to="/help">COVID-19 Response</Link></li>
                <li><Link to="/help">Report a Concern</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Hosting</h4>
              <ul>
                <li><Link to="/hosting">Try Hosting</Link></li>
                <li><Link to="/pricing">Advertise with us</Link></li>
                <li><Link to="/hosting">Protection for Hosts</Link></li>
                <li><Link to="/hosting">Hosting Resources</Link></li>
                <li><Link to="/help">Community Forum</Link></li>
                <li><Link to="/hosting">Host Responsibly</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Company</h4>
              <ul>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/about">Newsroom</Link></li>
                <li><Link to="/about">Investors</Link></li>
                <li><Link to="/careers">Careers</Link></li>
                <li><Link to="/about">Gift Cards</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-legal">
            <span>&copy; 2024 IRU Voyage, Inc.</span>
            <span className="footer-dot">·</span>
            <Link to="/privacy">Privacy</Link>
            <span className="footer-dot">·</span>
            <Link to="/terms">Terms</Link>
            <span className="footer-dot">·</span>
            <Link to="#">Sitemap</Link>
          </div>

          <div className="footer-settings">
            <button className="footer-setting-btn">
              <Globe size={16} />
              <span>English (US)</span>
            </button>
            <button className="footer-setting-btn">
              <DollarSign size={16} />
              <span>USD</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
