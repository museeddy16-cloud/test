import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Globe,
  DollarSign
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
            <div className="footer-social">
              <a href="#" className="social-link"><Facebook size={20} /></a>
              <a href="#" className="social-link"><Twitter size={20} /></a>
              <a href="#" className="social-link"><Instagram size={20} /></a>
              <a href="#" className="social-link"><Youtube size={20} /></a>
            </div>
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
