import { Search, ChevronRight, MessageCircle, Users, Shield, CreditCard } from 'lucide-react';
import '../styles/shared-pages.css';

export default function Help() {
  const categories = [
    {
      icon: MessageCircle,
      title: 'Getting Started',
      description: 'Learn how to use IRU Voyage',
      topics: ['Creating an account', 'How to book', 'Finding listings', 'Account settings']
    },
    {
      icon: Users,
      title: 'Guests',
      description: 'Help for travelers',
      topics: ['How to search and filter', 'Understanding prices', 'Messaging hosts', 'Reviews and ratings']
    },
    {
      icon: Shield,
      title: 'Safety & Trust',
      description: 'Your safety is important',
      topics: ['Safety tips', 'Verified hosts', 'Identity verification', 'Cancellation policies']
    },
    {
      icon: CreditCard,
      title: 'Payments & Refunds',
      description: 'Questions about payments',
      topics: ['Payment methods', 'Refund process', 'Billing issues', 'Currency conversion']
    }
  ];

  return (
    <div className="shared-page-container">
      <div className="shared-page-hero">
        <h1>How can we help?</h1>
        <p>Find answers to your questions</p>
        
        <div className="search-box">
          <Search size={20} />
          <input type="text" placeholder="Search for help..." />
        </div>
      </div>

      <div className="shared-page-content">
        <div className="categories-grid">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div key={category.title} className="category-card">
                <div className="category-header">
                  <Icon size={32} />
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                </div>
                <ul className="category-topics">
                  {category.topics.map((topic) => (
                    <li key={topic}>
                      <a href="#" className="topic-link">
                        {topic}
                        <ChevronRight size={16} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="help-contact">
          <h2>Still need help?</h2>
          <p>Our support team is available 24/7</p>
          <div className="contact-buttons">
            <button className="btn-primary">Contact Support</button>
            <button className="btn-secondary">Live Chat</button>
          </div>
        </div>
      </div>
    </div>
  );
}
