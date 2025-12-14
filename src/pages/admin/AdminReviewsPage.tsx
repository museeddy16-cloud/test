import { useState } from 'react';
import { Search, Star, Trash2, CheckCircle, XCircle, Eye } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import { adminReviews } from '../../data/adminMockData';
import '../Dashboard.css';

export default function AdminReviews() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterApproval, setFilterApproval] = useState('all');

  const filtered = adminReviews.filter((review) => {
    const matchesSearch = review.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.guest.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesApproval = filterApproval === 'all' || 
                           (filterApproval === 'approved' ? review.status === 'approved' : review.status !== 'approved');
    return matchesSearch && matchesApproval;
  });

  const stats = {
    total: adminReviews.length,
    approved: adminReviews.filter(r => r.status === 'approved').length,
    pending: adminReviews.filter(r => r.status !== 'approved').length,
    avgRating: (adminReviews.reduce((sum, r) => sum + r.rating, 0) / adminReviews.length).toFixed(1)
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="admin-main dashboard-main">
        <header className="admin-header dashboard-header">
          <div>
            <h1>Reviews Management</h1>
            <p>Review and approve guest feedback</p>
          </div>
        </header>

        <div className="admin-content dashboard-content">
          {/* Stats */}
          <div className="stat-cards-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <Star size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Total Reviews</p>
                <p className="stat-value">{stats.total}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
                <CheckCircle size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Approved</p>
                <p className="stat-value">{stats.approved}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
                <XCircle size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Pending</p>
                <p className="stat-value">{stats.pending}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ffa751 0%, #ffe259 100%)' }}>
                <Star size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Avg Rating</p>
                <p className="stat-value">{stats.avgRating}</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="filters-bar">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search by property or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={filterApproval}
              onChange={(e) => setFilterApproval(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Reviews</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Reviews Grid */}
          <div className="reviews-grid">
            {filtered.map((review) => (
              <div key={review.id} className="review-card dashboard-card">
                <div className="review-header">
                  <div className="review-info">
                    <h4 className="review-property">{review.property}</h4>
                    <p className="review-author">by {review.guest}</p>
                  </div>
                  <div className="review-rating">
                    {renderStars(review.rating)}
                  </div>
                </div>
                
                <p className="review-text">{review.comment}</p>
                
                <div className="review-footer">
                  <span className="review-date">{review.date}</span>
                  <div className="review-status">
                    {review.status === 'approved' ? (
                      <span className="status-badge status-confirmed">✓ Approved</span>
                    ) : (
                      <span className="status-badge status-pending">Pending Review</span>
                    )}
                  </div>
                </div>

                <div className="review-actions">
                  {review.status !== 'approved' && (
                    <>
                      <button className="btn-approve">
                        <CheckCircle size={16} />
                        Approve
                      </button>
                      <button className="btn-reject">
                        <XCircle size={16} />
                        Reject
                      </button>
                    </>
                  )}
                  <button className="btn-delete">
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
