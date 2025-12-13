import { Globe, Users, Award, Target, MapPin, Phone, MessageCircle } from 'lucide-react';
import '../styles/shared-pages.css';

export default function About() {
  const values = [
    {
      icon: Globe,
      title: 'Global Community',
      description: 'Connecting travelers and hosts around the world'
    },
    {
      icon: Users,
      title: 'People First',
      description: 'Building trust and belonging in communities'
    },
    {
      icon: Award,
      title: 'Quality',
      description: 'Maintaining highest standards in every experience'
    },
    {
      icon: Target,
      title: 'Innovation',
      description: 'Constantly improving travel and hospitality'
    }
  ];

  return (
    <div className="shared-page-container">
      <div className="shared-page-hero">
        <h1>About IRU Voyage</h1>
        <p>Discover unique stays and experiences around the world</p>
      </div>

      <div className="shared-page-content">
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            We believe travel should be accessible to everyone. IRU Voyage empowers people to discover 
            and share extraordinary places, making travel more authentic and meaningful. Our mission is to 
            connect travelers with unique experiences and properties that inspire, delight, and enrich their lives.
          </p>
        </section>

        <section className="about-section">
          <h2>Our Values</h2>
          <div className="values-grid">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="value-card">
                  <Icon size={40} />
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="about-section">
          <h2>Our Story</h2>
          <p>
            Founded in 2024, IRU Voyage started with a simple idea: make unique travel experiences 
            accessible to everyone. We've grown to serve travelers and hosts in over 190 countries, 
            creating a global community united by a love of travel and authentic connections.
          </p>
          <p>
            Today, millions of people use IRU Voyage to book stays that let them experience local 
            culture, meet fascinating people, and discover hidden gems around the world.
          </p>
        </section>

        <section className="about-section">
          <h2>By The Numbers</h2>
          <div className="stats-grid">
            <div className="stat">
              <h3>190+</h3>
              <p>Countries</p>
            </div>
            <div className="stat">
              <h3>2M+</h3>
              <p>Properties</p>
            </div>
            <div className="stat">
              <h3>100M+</h3>
              <p>Reviews</p>
            </div>
            <div className="stat">
              <h3>$50B</h3>
              <p>Traveler Spending</p>
            </div>
          </div>
        </section>

        <section className="about-section contact-section">
          <h2>Get In Touch</h2>
          <p>Have questions? We'd love to hear from you. Reach out to us through any of these channels.</p>
          <div className="contact-info-grid">
            <div className="contact-info-card">
              <MapPin size={32} />
              <h3>Location</h3>
              <p>Gahanga, Kicukiro<br />Kigali, Rwanda</p>
            </div>

            <div className="contact-info-card">
              <Phone size={32} />
              <h3>Phone</h3>
              <div className="phone-numbers">
                <a href="tel:+250795381733">0795 381 733</a>
                <a href="tel:+250736318111">0736 318 111</a>
              </div>
            </div>

            <div className="contact-info-card">
              <MessageCircle size={32} />
              <h3>WhatsApp</h3>
              <a href="https://wa.me/250795381733" target="_blank" rel="noopener noreferrer">
                0795 381 733
              </a>
            </div>
          </div>

          <h3 style={{ marginTop: '40px', marginBottom: '20px' }}>Follow Us On Social Media</h3>
          <div className="social-links-grid">
            <a href="https://www.instagram.com/irubusinessgroup?igsh=Y2s1N25qY2xzM2Zu" target="_blank" rel="noopener noreferrer" className="social-card">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2z" fill="none" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2"/>
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/>
              </svg>
              <span>Instagram</span>
            </a>

            <a href="https://x.com/IRUBUSINESSES?t=QHreTJ4D1GtZfix4tQIpyw&s=09" target="_blank" rel="noopener noreferrer" className="social-card">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 9 0 11-4s1-6.6 0-9c.75-.75 1.6-2 2-4z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>X (Twitter)</span>
            </a>

            <a href="https://www.linkedin.com/in/iru-business-group-571ba3334?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="social-card">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/>
              </svg>
              <span>LinkedIn</span>
            </a>

            <a href="https://www.youtube.com/@IRUTV-2060" target="_blank" rel="noopener noreferrer" className="social-card">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23 4.2c-.26-1.46-1.84-2.7-3.34-2.7H4.34C2.84 1.5 1.26 2.74 1 4.2v15.6c.26 1.46 1.84 2.7 3.34 2.7h15.32c1.5 0 3.08-1.24 3.34-2.7V4.2zM9.5 17.5V6.5l7.5 5.5-7.5 5.5z"/>
              </svg>
              <span>YouTube</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
