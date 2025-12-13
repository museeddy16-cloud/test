import { Briefcase, Users, Code, Heart } from 'lucide-react';
import '../styles/shared-pages.css';

export default function Careers() {
  const departments = [
    {
      icon: Code,
      title: 'Engineering',
      openings: 24,
      description: 'Build scalable platforms and innovative features'
    },
    {
      icon: Users,
      title: 'Product & Design',
      openings: 12,
      description: 'Create amazing user experiences'
    },
    {
      icon: Briefcase,
      title: 'Business',
      openings: 18,
      description: 'Drive growth and partnerships'
    },
    {
      icon: Heart,
      title: 'Community & Trust',
      openings: 8,
      description: 'Build trust and support our community'
    }
  ];

  return (
    <div className="shared-page-container">
      <div className="shared-page-hero">
        <h1>Join Our Team</h1>
        <p>Help us make travel more accessible and authentic</p>
      </div>

      <div className="shared-page-content">
        <section className="careers-section">
          <h2>Why Work at IRU Voyage</h2>
          <div className="benefits-grid">
            <div className="benefit">
              <h4>Competitive Salary</h4>
              <p>Market-leading compensation and equity</p>
            </div>
            <div className="benefit">
              <h4>Benefits Package</h4>
              <p>Health, wellness, and lifestyle benefits</p>
            </div>
            <div className="benefit">
              <h4>Remote Work</h4>
              <p>Flexible work from anywhere</p>
            </div>
            <div className="benefit">
              <h4>Growth Opportunities</h4>
              <p>Continuous learning and development</p>
            </div>
            <div className="benefit">
              <h4>Inclusive Culture</h4>
              <p>Diverse and welcoming team</p>
            </div>
            <div className="benefit">
              <h4>Impact</h4>
              <p>Make a difference in travel</p>
            </div>
          </div>
        </section>

        <section className="careers-section">
          <h2>Open Positions</h2>
          <div className="departments-grid">
            {departments.map((dept) => {
              const Icon = dept.icon;
              return (
                <div key={dept.title} className="department-card">
                  <Icon size={32} />
                  <h3>{dept.title}</h3>
                  <p>{dept.description}</p>
                  <span className="openings">{dept.openings} Open Positions</span>
                  <button className="btn-secondary">View Positions</button>
                </div>
              );
            })}
          </div>
        </section>

        <section className="careers-section">
          <h2>Our Culture</h2>
          <p>
            At IRU Voyage, we celebrate diversity and foster an inclusive environment. Our teams are 
            distributed across the globe, bringing unique perspectives and experiences. We believe in 
            empowering our employees to do their best work while maintaining work-life balance.
          </p>
        </section>
      </div>
    </div>
  );
}
