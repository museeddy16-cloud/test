import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  MapPin
} from 'lucide-react';
import { usePagination, useDelete } from '../../hooks/useDashboard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { Listing } from '../../types/dashboard';

export default function HostListings() {
  const { data: listings, loading, page, totalPages, goToPage, refresh } = usePagination<Listing>('/host/listings', 10);
  const { remove, loading: deleting } = useDelete();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; listing: Listing | null }>({ 
    open: false, 
    listing: null 
  });
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const filteredListings = listings.filter((listing) => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          listing.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || listing.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async () => {
    if (deleteModal.listing) {
      const success = await remove(`/host/listings/${deleteModal.listing.id}`);
      if (success) {
        refresh();
      }
      setDeleteModal({ open: false, listing: null });
    }
  };

  const getStatusVariant = (status: string): 'success' | 'warning' | 'danger' | 'secondary' | 'info' => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'inactive': return 'secondary';
      case 'rejected': return 'danger';
      default: return 'secondary';
    }
  };

  if (loading === 'loading') {
    return <LoadingSpinner fullScreen message="Loading listings..." />;
  }

  return (
    <div className="host-listings">
      <div className="page-header">
        <div>
          <h1>My Listings</h1>
          <p>Manage your property listings</p>
        </div>
        <Link to="/host/listings/create" className="btn btn-primary">
          <Plus size={18} />
          <span>Add Listing</span>
        </Link>
      </div>

      <div className="listings-toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search listings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <Filter size={18} />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {filteredListings.length === 0 ? (
        <EmptyState
          title="No listings found"
          description={searchQuery || statusFilter !== 'all' 
            ? "Try adjusting your search or filters" 
            : "Create your first listing to start earning"
          }
          action={{
            label: "Create Listing",
            onClick: () => window.location.href = '/host/listings/create'
          }}
        />
      ) : (
        <div className="listings-grid">
          {filteredListings.map((listing) => (
            <div key={listing.id} className="listing-card">
              <div 
                className="listing-image"
                style={{ backgroundImage: `url(${listing.images?.[0] || '/placeholder.jpg'})` }}
              >
                <Badge variant={getStatusVariant(listing.status)}>
                  {listing.status}
                </Badge>
                <button 
                  className="menu-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenu(activeMenu === listing.id ? null : listing.id);
                  }}
                >
                  <MoreVertical size={18} />
                </button>
                {activeMenu === listing.id && (
                  <div className="action-menu">
                    <Link to={`/property/${listing.id}`} className="menu-item">
                      <Eye size={16} />
                      <span>View</span>
                    </Link>
                    <Link to={`/host/listings/${listing.id}/edit`} className="menu-item">
                      <Edit size={16} />
                      <span>Edit</span>
                    </Link>
                    <button 
                      className="menu-item danger"
                      onClick={() => {
                        setDeleteModal({ open: true, listing });
                        setActiveMenu(null);
                      }}
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
              <div className="listing-content">
                <h3>{listing.title}</h3>
                <p className="listing-location">
                  <MapPin size={14} />
                  {listing.city}, {listing.country}
                </p>
                <div className="listing-meta">
                  <span>{listing.bedrooms} bed</span>
                  <span>{listing.bathrooms} bath</span>
                  <span>{listing.maxGuests} guests</span>
                </div>
                <div className="listing-footer">
                  <span className="price">${listing.price}<small>/night</small></span>
                  <Link to={`/host/listings/${listing.id}/edit`} className="btn btn-secondary btn-sm">
                    Manage
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            disabled={page === 1}
            onClick={() => goToPage(page - 1)}
          >
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button 
            disabled={page === totalPages}
            onClick={() => goToPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}

      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, listing: null })}
        title="Delete Listing"
        footer={
          <>
            <button 
              className="btn btn-secondary"
              onClick={() => setDeleteModal({ open: false, listing: null })}
            >
              Cancel
            </button>
            <button 
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={deleting === 'loading'}
            >
              {deleting === 'loading' ? 'Deleting...' : 'Delete'}
            </button>
          </>
        }
      >
        <p>Are you sure you want to delete "{deleteModal.listing?.title}"?</p>
        <p className="text-muted">This action cannot be undone.</p>
      </Modal>
    </div>
  );
}
