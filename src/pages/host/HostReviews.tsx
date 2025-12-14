import { useState } from 'react';
import { Star, MessageSquare, ThumbsUp, Flag } from 'lucide-react';
import { usePagination, usePost } from '../../hooks/useDashboard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import { Review } from '../../types/dashboard';

export default function HostReviews() {
  const { data: reviews, loading, page, totalPages, goToPage, refresh } = usePagination<Review>('/host/reviews', 10);
  const { post, loading: submitting } = usePost();
  
  const [responseModal, setResponseModal] = useState<{ open: boolean; review: Review | null }>({
    open: false,
    review: null
  });
  const [responseText, setResponseText] = useState('');

  const handleSubmitResponse = async () => {
    if (responseModal.review && responseText.trim()) {
      await post(`/host/reviews/${responseModal.review.id}/respond`, { response: responseText });
      setResponseModal({ open: false, review: null });
      setResponseText('');
      refresh();
    }
  };

  const renderStars = (rating: number) => (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star 
          key={star}
          size={16} 
          className={star <= rating ? 'filled' : 'empty'}
        />
      ))}
    </div>
  );

  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  if (loading === 'loading') {
    return <LoadingSpinner fullScreen message="Loading reviews..." />;
  }

  return (
    <div className="host-reviews">
      <div className="page-header">
        <div>
          <h1>Reviews</h1>
          <p>See what guests are saying about your properties</p>
        </div>
      </div>

      <div className="reviews-summary">
        <div className="rating-overview">
          <div className="rating-big">
            <span className="rating-number">{averageRating}</span>
            <Star size={32} className="filled" />
          </div>
          <p>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="rating-breakdown">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = reviews.filter(r => Math.round(r.rating) === stars).length;
            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={stars} className="rating-bar">
                <span>{stars} stars</span>
                <div className="bar">
                  <div className="bar-fill" style={{ width: `${percentage}%` }} />
                </div>
                <span>{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {reviews.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No reviews yet"
          description="Once guests leave reviews for your listings, they'll appear here"
        />
      ) : (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="reviewer-avatar">
                    {review.reviewer?.firstName?.charAt(0) || 'G'}
                  </div>
                  <div>
                    <h4>{review.reviewer?.firstName} {review.reviewer?.lastName}</h4>
                    <span className="review-date">{formatDate(review.createdAt)}</span>
                  </div>
                </div>
                {renderStars(review.rating)}
              </div>
              
              <div className="review-listing">
                <span>Review for: {review.listing?.title || 'Listing'}</span>
              </div>

              <p className="review-comment">{review.comment}</p>

              {review.response ? (
                <div className="host-response">
                  <h5>Your Response</h5>
                  <p>{review.response}</p>
                </div>
              ) : (
                <div className="review-actions">
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => setResponseModal({ open: true, review })}
                  >
                    <MessageSquare size={14} />
                    <span>Respond</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => goToPage(page - 1)}>Previous</button>
          <span>Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => goToPage(page + 1)}>Next</button>
        </div>
      )}

      <Modal
        isOpen={responseModal.open}
        onClose={() => {
          setResponseModal({ open: false, review: null });
          setResponseText('');
        }}
        title="Respond to Review"
        footer={
          <>
            <button 
              className="btn btn-secondary"
              onClick={() => {
                setResponseModal({ open: false, review: null });
                setResponseText('');
              }}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleSubmitResponse}
              disabled={!responseText.trim() || submitting === 'loading'}
            >
              {submitting === 'loading' ? 'Submitting...' : 'Submit Response'}
            </button>
          </>
        }
      >
        <div className="response-form">
          <div className="original-review">
            <div className="reviewer-mini">
              <span>{responseModal.review?.reviewer?.firstName}</span>
              {renderStars(responseModal.review?.rating || 0)}
            </div>
            <p>"{responseModal.review?.comment}"</p>
          </div>
          <textarea
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            placeholder="Write a professional response to this review..."
            rows={4}
          />
          <p className="helper-text">Your response will be visible to all guests viewing your listing</p>
        </div>
      </Modal>
    </div>
  );
}
