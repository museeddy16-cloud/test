import { useState } from 'react';
import { Star, Edit, Trash2 } from 'lucide-react';
import { usePagination, useDelete } from '../../hooks/useDashboard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import { Review } from '../../types/dashboard';

export default function ClientReviews() {
  const { data: reviews, loading, page, totalPages, goToPage, refresh } = usePagination<Review>('/client/reviews', 10);
  const { remove, loading: deleting } = useDelete();
  
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; review: Review | null }>({
    open: false,
    review: null
  });

  const handleDelete = async () => {
    if (deleteModal.review) {
      await remove(`/client/reviews/${deleteModal.review.id}`);
      setDeleteModal({ open: false, review: null });
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

  if (loading === 'loading') {
    return <LoadingSpinner fullScreen message="Loading reviews..." />;
  }

  return (
    <div className="client-reviews">
      <div className="page-header">
        <h1>My Reviews</h1>
        <p>Reviews you've written for properties you've stayed at</p>
      </div>

      {reviews.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No reviews yet"
          description="After completing a stay, you can leave a review for the property"
        />
      ) : (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="listing-info">
                  <div 
                    className="listing-thumb"
                    style={{ backgroundImage: `url(${review.listing?.images?.[0] || '/placeholder.jpg'})` }}
                  />
                  <div>
                    <h4>{review.listing?.title || 'Property'}</h4>
                    <span className="review-date">{formatDate(review.createdAt)}</span>
                  </div>
                </div>
                {renderStars(review.rating)}
              </div>

              <p className="review-comment">{review.comment}</p>

              {review.response && (
                <div className="host-response">
                  <h5>Host Response</h5>
                  <p>{review.response}</p>
                </div>
              )}

              <div className="review-actions">
                <button className="btn btn-secondary btn-sm">
                  <Edit size={14} />
                  Edit
                </button>
                <button 
                  className="btn btn-danger btn-sm"
                  onClick={() => setDeleteModal({ open: true, review })}
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
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
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, review: null })}
        title="Delete Review"
        footer={
          <>
            <button 
              className="btn btn-secondary"
              onClick={() => setDeleteModal({ open: false, review: null })}
            >
              Cancel
            </button>
            <button 
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={deleting === 'loading'}
            >
              {deleting === 'loading' ? 'Deleting...' : 'Delete Review'}
            </button>
          </>
        }
      >
        <p>Are you sure you want to delete this review?</p>
        <p className="text-muted">This action cannot be undone.</p>
      </Modal>
    </div>
  );
}
