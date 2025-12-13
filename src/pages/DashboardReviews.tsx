import { Star, MessageSquare, ThumbsUp, Flag, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';

const reviews = [
  { id: 1, guest: 'John Smith', property: 'Modern Beach House', rating: 5, date: '2024-11-20', text: 'Amazing experience! The house is beautiful and well-maintained. Highly recommended!', helpful: 12, verified: true },
  { id: 2, guest: 'Sarah Johnson', property: 'Luxury City Apartment', rating: 4, date: '2024-11-18', text: 'Great location and clean apartment. The host was very responsive and helpful.', helpful: 8, verified: true },
  { id: 3, guest: 'Mike Williams', property: 'Cozy Mountain Cabin', rating: 5, date: '2024-11-15', text: 'Perfect getaway spot! The views are stunning and the cabin has everything you need.', helpful: 15, verified: true },
  { id: 4, guest: 'Emily Brown', property: 'Modern Beach House', rating: 4, date: '2024-11-10', text: 'Good stay overall. Minor issues with WiFi but host resolved it quickly.', helpful: 5, verified: true },
];

const stats = [
  { label: 'Average Rating', value: '4.75', icon: '⭐' },
  { label: 'Total Reviews', value: '48', icon: '💬' },
  { label: 'Positive Reviews', value: '95%', icon: '👍' },
];

export default function Reviews() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterRating, setFilterRating] = useState('all');

  const filtered = filterRating === 'all' 
    ? reviews 
    : reviews.filter(r => r.rating === parseInt(filterRating));

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="dashboard-main">
        <div className="host-dashboard-badge">Host Dashboard</div>
        <header className="dashboard-header">
          <div>
            <h1>Reviews</h1>
            <p>Guest feedback and ratings</p>
          </div>
        </header>

        <div className="dashboard-content">
          <div className="reviews-stats">
            {stats.map((stat, idx) => (
              <div key={idx} className="review-stat">
                <span className="stat-icon">{stat.icon}</span>
                <div>
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="filter-tabs">
            <button 
              className={`filter-tab ${filterRating === 'all' ? 'active' : ''}`}
              onClick={() => setFilterRating('all')}
            >
              All Reviews
            </button>
            <button 
              className={`filter-tab ${filterRating === '5' ? 'active' : ''}`}
              onClick={() => setFilterRating('5')}
            >
              ⭐⭐⭐⭐⭐ 5 Stars
            </button>
            <button 
              className={`filter-tab ${filterRating === '4' ? 'active' : ''}`}
              onClick={() => setFilterRating('4')}
            >
              ⭐⭐⭐⭐ 4 Stars
            </button>
          </div>

          <div className="reviews-list">
            {filtered.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="review-author">
                    <div className="review-avatar">{review.guest.charAt(0)}</div>
                    <div className="review-meta">
                      <h4>{review.guest}</h4>
                      <p>{review.property} • {review.date}</p>
                    </div>
                  </div>
                  <div className="review-rating">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" style={{ color: '#FFB800' }} />
                    ))}
                  </div>
                </div>

                <div className="review-body">
                  <p>{review.text}</p>
                  {review.verified && (
                    <span className="verified-badge">✓ Verified Guest</span>
                  )}
                </div>

                <div className="review-footer">
                  <div className="helpful-count">
                    <ThumbsUp size={16} />
                    {review.helpful} found this helpful
                  </div>
                  <div className="review-actions">
                    <button className="btn-icon">
                      <MessageSquare size={16} />
                      Reply
                    </button>
                    <button className="btn-icon">
                      <Flag size={16} />
                      Report
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
