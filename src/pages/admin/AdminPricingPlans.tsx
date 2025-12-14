import { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Check,
  DollarSign,
  Crown
} from 'lucide-react';
import { useFetch, usePost, usePut, useDelete } from '../../hooks/useDashboard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import { SubscriptionPlan } from '../../types/dashboard';

export default function AdminPricingPlans() {
  const { data: plans, loading, refetch } = useFetch<SubscriptionPlan[]>('/admin/subscription/plans');
  const { post, loading: creating } = usePost();
  const { put, loading: updating } = usePut();
  const { remove, loading: deleting } = useDelete();

  const [planModal, setPlanModal] = useState<{ open: boolean; plan: Partial<SubscriptionPlan> | null; mode: 'create' | 'edit' }>({
    open: false,
    plan: null,
    mode: 'create'
  });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; plan: SubscriptionPlan | null }>({
    open: false,
    plan: null
  });
  const [formData, setFormData] = useState<Partial<SubscriptionPlan>>({
    name: '',
    description: '',
    monthlyPrice: 0,
    yearlyPrice: 0,
    maxListings: 5,
    commissionRate: 10,
    features: [],
    isPopular: false,
  });
  const [newFeature, setNewFeature] = useState('');

  const openCreateModal = () => {
    setFormData({
      name: '',
      description: '',
      monthlyPrice: 0,
      yearlyPrice: 0,
      maxListings: 5,
      commissionRate: 10,
      features: [],
      isPopular: false,
    });
    setPlanModal({ open: true, plan: null, mode: 'create' });
  };

  const openEditModal = (plan: SubscriptionPlan) => {
    setFormData({ ...plan });
    setPlanModal({ open: true, plan, mode: 'edit' });
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...(formData.features || []), newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features?.filter((_, i) => i !== index)
    });
  };

  const handleSave = async () => {
    if (planModal.mode === 'create') {
      await post('/admin/subscription/plans', formData);
    } else {
      await put(`/admin/subscription/plans/${planModal.plan?.id}`, formData);
    }
    setPlanModal({ open: false, plan: null, mode: 'create' });
    refetch();
  };

  const handleDelete = async () => {
    if (deleteModal.plan) {
      await remove(`/admin/subscription/plans/${deleteModal.plan.id}`);
      setDeleteModal({ open: false, plan: null });
      refetch();
    }
  };

  if (loading === 'loading') {
    return <LoadingSpinner fullScreen message="Loading plans..." />;
  }

  return (
    <div className="admin-pricing-plans">
      <div className="page-header">
        <div>
          <h1>Pricing Plans</h1>
          <p>Manage subscription plans for hosts</p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={18} />
          Add Plan
        </button>
      </div>

      <div className="plans-table">
        <table className="data-table">
          <thead>
            <tr>
              <th>Plan Name</th>
              <th>Monthly Price</th>
              <th>Yearly Price</th>
              <th>Max Listings</th>
              <th>Commission</th>
              <th>Popular</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans?.map((plan) => (
              <tr key={plan.id}>
                <td>
                  <div className="plan-name">
                    <Crown size={16} />
                    <span>{plan.name}</span>
                  </div>
                </td>
                <td>${plan.monthlyPrice.toFixed(2)}</td>
                <td>${plan.yearlyPrice.toFixed(2)}</td>
                <td>{plan.maxListings}</td>
                <td>{plan.commissionRate}%</td>
                <td>
                  {plan.isPopular && <Badge variant="success">Popular</Badge>}
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => openEditModal(plan)}
                    >
                      <Edit size={14} />
                    </button>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => setDeleteModal({ open: true, plan })}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={planModal.open}
        onClose={() => setPlanModal({ open: false, plan: null, mode: 'create' })}
        title={planModal.mode === 'create' ? 'Create New Plan' : 'Edit Plan'}
        size="lg"
        footer={
          <>
            <button 
              className="btn btn-secondary"
              onClick={() => setPlanModal({ open: false, plan: null, mode: 'create' })}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleSave}
              disabled={creating === 'loading' || updating === 'loading'}
            >
              {creating === 'loading' || updating === 'loading' ? 'Saving...' : 'Save Plan'}
            </button>
          </>
        }
      >
        <form className="plan-form">
          <div className="form-row">
            <div className="form-group">
              <label>Plan Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Pro, Premium"
                required
              />
            </div>
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.isPopular}
                  onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                />
                Mark as Popular
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              placeholder="Brief description of this plan"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Monthly Price ($)</label>
              <input
                type="number"
                value={formData.monthlyPrice}
                onChange={(e) => setFormData({ ...formData, monthlyPrice: parseFloat(e.target.value) || 0 })}
                min={0}
                step={0.01}
              />
            </div>
            <div className="form-group">
              <label>Yearly Price ($)</label>
              <input
                type="number"
                value={formData.yearlyPrice}
                onChange={(e) => setFormData({ ...formData, yearlyPrice: parseFloat(e.target.value) || 0 })}
                min={0}
                step={0.01}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Max Listings</label>
              <input
                type="number"
                value={formData.maxListings}
                onChange={(e) => setFormData({ ...formData, maxListings: parseInt(e.target.value) || 0 })}
                min={1}
              />
            </div>
            <div className="form-group">
              <label>Commission Rate (%)</label>
              <input
                type="number"
                value={formData.commissionRate}
                onChange={(e) => setFormData({ ...formData, commissionRate: parseFloat(e.target.value) || 0 })}
                min={0}
                max={100}
                step={0.1}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Features</label>
            <div className="features-input">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a feature"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
              />
              <button type="button" className="btn btn-secondary" onClick={handleAddFeature}>
                <Plus size={16} />
              </button>
            </div>
            <div className="features-list">
              {formData.features?.map((feature, idx) => (
                <div key={idx} className="feature-tag">
                  <Check size={14} />
                  <span>{feature}</span>
                  <button type="button" onClick={() => handleRemoveFeature(idx)}>
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, plan: null })}
        title="Delete Plan"
        footer={
          <>
            <button 
              className="btn btn-secondary"
              onClick={() => setDeleteModal({ open: false, plan: null })}
            >
              Cancel
            </button>
            <button 
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={deleting === 'loading'}
            >
              {deleting === 'loading' ? 'Deleting...' : 'Delete Plan'}
            </button>
          </>
        }
      >
        <p>Are you sure you want to delete the "{deleteModal.plan?.name}" plan?</p>
        <p className="text-muted">This will not affect existing subscriptions.</p>
      </Modal>
    </div>
  );
}
