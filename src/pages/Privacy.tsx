import { ShieldAlert, Eye, Settings } from 'lucide-react';
import '../styles/shared-pages.css';

export default function Privacy() {
  return (
    <div className="shared-page-container">
      <div className="shared-page-hero">
        <h1>Privacy Policy</h1>
        <p>Last updated: December 2024</p>
      </div>

      <div className="shared-page-content legal-content">
        <section className="legal-section">
          <h2><Eye size={24} /> Introduction</h2>
          <p>
            IRU Voyage ("we", "us", "our") operates the platform. This page informs you of our policies 
            regarding the collection, use, and disclosure of personal data when you use our service and 
            the choices you have associated with that data.
          </p>
        </section>

        <section className="legal-section">
          <h2><ShieldAlert size={24} /> Information Collection and Use</h2>
          <p>We collect several different types of information for various purposes:</p>
          <ul>
            <li><strong>Personal Data:</strong> Name, email address, phone number, payment information</li>
            <li><strong>Usage Data:</strong> Browser type, IP address, pages visited, time and date stamps</li>
            <li><strong>Location Data:</strong> With your permission, we may collect location information</li>
            <li><strong>Cookies:</strong> We use cookies and similar tracking technologies</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>Use of Data</h2>
          <p>IRU Voyage uses the collected data for various purposes:</p>
          <ul>
            <li>Providing and maintaining our service</li>
            <li>Notifying you about changes to our service</li>
            <li>Allowing you to participate in interactive features</li>
            <li>Providing customer support</li>
            <li>Gathering analytics to improve our service</li>
            <li>Detecting, preventing and addressing fraud</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>Security of Data</h2>
          <p>
            The security of your data is important to us, but remember that no method of transmission over 
            the Internet or method of electronic storage is 100% secure. While we strive to use commercially 
            acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
          </p>
        </section>

        <section className="legal-section">
          <h2><Settings size={24} /> Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of marketing communications</li>
            <li>Data portability</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:<br/>
            <strong>Email:</strong> privacy@iruVoyage.com<br/>
            <strong>Address:</strong> IRU Voyage Inc., Data Protection Office
          </p>
        </section>
      </div>
    </div>
  );
}
