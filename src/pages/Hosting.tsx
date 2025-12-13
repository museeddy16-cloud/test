import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Users, TrendingUp, Award, Shield, Zap, DollarSign, Globe, Star, ChevronRight, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/shared-pages.css';

export default function Hosting() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [estimatedEarnings, setEstimatedEarnings] = useState(0);
  const [nights, setNights] = useState(4);
  const [pricePerNight, setPricePerNight] = useState(100);

  const calculateEarnings = () => {
    return nights * pricePerNight * 4;
  };

  const handleGetStarted = () => {
    if (user) {
      navigate('/host-onboarding');
    } else {
      navigate('/signup');
    }
  };

  const steps = [
    {
      number: 1,
      title: 'Tell us about your place',
      description: 'Share some basic info, like where it is and how many guests can stay.'
    },
    {
      number: 2,
      title: 'Make it stand out',
      description: 'Add photos plus a title and description to help guests see what makes your place special.'
    },
    {
      number: 3,
      title: 'Finish up and publish',
      description: 'Choose your starting price, verify a few details, then publish your listing.'
    }
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: 'Earn Extra Income',
      description: 'Turn your unused space into a steady income stream. Hosts in Rwanda earn an average of $2,400/month.',
      stat: '$2,400+',
      statLabel: 'avg monthly earnings'
    },
    {
      icon: Shield,
      title: 'Host Protection',
      description: 'Get comprehensive protection with up to $1M in damage coverage and liability insurance.',
      stat: '$1M',
      statLabel: 'damage protection'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Connect with travelers from 190+ countries looking for authentic experiences.',
      stat: '190+',
      statLabel: 'countries'
    },
    {
      icon: Award,
      title: 'Superhost Status',
      description: 'Get recognized for exceptional hospitality with our exclusive Superhost program.',
      stat: '15%',
      statLabel: 'more bookings'
    }
  ];

  const testimonials = [
    {
      name: 'Marie Claire',
      location: 'Kigali, Rwanda',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      quote: 'Hosting on IRU Voyage has been life-changing. I now earn enough to support my family and send my children to school.',
      earnings: '$3,200/month'
    },
    {
      name: 'Jean Baptiste',
      location: 'Musanze, Rwanda',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      quote: 'I turned my family home into a successful guesthouse. The platform makes everything so easy to manage.',
      earnings: '$1,800/month'
    },
    {
      name: 'Grace Uwimana',
      location: 'Gisenyi, Rwanda',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      quote: 'The support team helped me every step of the way. Now I host guests from all over the world.',
      earnings: '$2,500/month'
    }
  ];

  return (
    <div className="hosting-page">
      <section className="hosting-hero">
        <div className="hosting-hero-content">
          <div className="hosting-hero-text">
            <h1>Turn Your Space Into Income</h1>
            <p>Join thousands of hosts earning money by sharing their homes with travelers from around the world.</p>
            <button className="btn-primary btn-xl" onClick={handleGetStarted}>
              Start Hosting
              <ChevronRight size={20} />
            </button>
            <p className="hosting-hero-subtext">
              {user ? 'Continue to set up your listing' : 'Create an account to get started'}
            </p>
          </div>
          
          <div className="earnings-calculator">
            <h3>Estimate Your Earnings</h3>
            <div className="calculator-inputs">
              <div className="calc-input-group">
                <label>Nights per month</label>
                <input 
                  type="range" 
                  min="1" 
                  max="30" 
                  value={nights} 
                  onChange={(e) => setNights(parseInt(e.target.value))}
                />
                <span className="calc-value">{nights} nights</span>
              </div>
              <div className="calc-input-group">
                <label>Price per night ($)</label>
                <input 
                  type="range" 
                  min="20" 
                  max="500" 
                  step="10"
                  value={pricePerNight} 
                  onChange={(e) => setPricePerNight(parseInt(e.target.value))}
                />
                <span className="calc-value">${pricePerNight}</span>
              </div>
            </div>
            <div className="estimated-earnings">
              <span className="earnings-label">Estimated monthly earnings</span>
              <span className="earnings-amount">${calculateEarnings()}</span>
            </div>
            <p className="earnings-disclaimer">*Estimates based on average occupancy rates in your area</p>
          </div>
        </div>
      </section>

      <section className="hosting-steps">
        <div className="container">
          <h2>It's Easy to Get Started</h2>
          <div className="steps-timeline">
            {steps.map((step, index) => (
              <div key={step.number} className="step-item">
                <div className="step-number">{step.number}</div>
                <div className="step-content">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
                {index < steps.length - 1 && <div className="step-connector"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hosting-benefits">
        <div className="container">
          <h2>Why Host on IRU Voyage?</h2>
          <div className="benefits-grid">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="benefit-card">
                  <div className="benefit-icon">
                    <Icon size={32} />
                  </div>
                  <div className="benefit-stat">
                    <span className="stat-number">{benefit.stat}</span>
                    <span className="stat-label">{benefit.statLabel}</span>
                  </div>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="hosting-testimonials">
        <div className="container">
          <h2>Hear from Our Hosts</h2>
          <div className="testimonials-grid">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="testimonial-card">
                <div className="testimonial-header">
                  <img src={testimonial.image} alt={testimonial.name} />
                  <div>
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.location}</p>
                  </div>
                </div>
                <p className="testimonial-quote">"{testimonial.quote}"</p>
                <div className="testimonial-earnings">
                  <DollarSign size={16} />
                  <span>{testimonial.earnings}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="superhost-section">
        <div className="container">
          <div className="superhost-content">
            <div className="superhost-text">
              <Award size={48} className="superhost-icon" />
              <h2>Become a Superhost</h2>
              <p>
                Superhosts are experienced hosts who provide exceptional hospitality. 
                They receive a special badge, priority support, and exclusive benefits.
              </p>
              <div className="superhost-requirements">
                <div className="requirement">
                  <Check size={20} />
                  <span>4.8+ average rating</span>
                </div>
                <div className="requirement">
                  <Check size={20} />
                  <span>Less than 1% cancellation rate</span>
                </div>
                <div className="requirement">
                  <Check size={20} />
                  <span>At least 10 stays per year</span>
                </div>
                <div className="requirement">
                  <Check size={20} />
                  <span>90%+ response rate</span>
                </div>
              </div>
            </div>
            <div className="superhost-image">
              <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600" alt="Superhost" />
            </div>
          </div>
        </div>
      </section>

      <section className="hosting-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Earning?</h2>
            <p>Join our community of hosts and start your hosting journey today.</p>
            <button className="btn-primary btn-xl" onClick={handleGetStarted}>
              Become a Host
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
