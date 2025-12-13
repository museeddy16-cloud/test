import { Globe, Users, Award, Target } from 'lucide-react';
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
      </div>
    </div>
  );
}
