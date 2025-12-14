import { useState } from 'react';
import { 
  Check, 
  Crown, 
  Zap, 
  Shield,
  ArrowRight,
  CreditCard
} from 'lucide-react';
import { useFetch, usePost } from '../../hooks/useDashboard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { SubscriptionPlan, Subscription } from '../../types/dashboard';

export default function HostSubscription() {
  const { data: plans, loading: plansLoading } = useFetch<SubscriptionPlan[]>('/subscription/plans');
  const { data: subscription, loading: subLoading, refetch } = useFetch<Subscription>('/host/subscription');
  const { post, loading: processing } = usePost();
  
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [upgradeModal, setUpgradeModal] = useState<{ open: boolean; plan: SubscriptionPlan | null }>({
    open: false,
    plan: null
  });
  const [cancelModal, setCancelModal] = useState(false);

  const handleSubscribe = async (planId: string) => {
    const result = await post('/host/subscription', {
      planId,
      billingCycle,
    });
    if (result) {
      refetch();
      setUpgradeModal({ open: false, plan: null });
    }
  };

  const handleCancelSubscription = async () => {
    await post('/host/subscription/cancel', {});
    refetch();
    setCancelModal(false);
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const getYearlySavings = (monthly: number, yearly: number) => {
    const monthlyTotal = monthly * 12;
    const savings = ((monthlyTotal - yearly) / monthlyTotal * 100).toFixed(0);
    return savings;
  };

  const getPlanIcon = (name: string) => {
    if (name.toLowerCase().includes('pro')) return Zap;
    if (name.toLowerCase().includes('premium') || name.toLowerCase().includes('enterprise')) return Crown;
    return Shield;
  };

  if (plansLoading === 'loading' || subLoading === 'loading') {
    return <LoadingSpinner fullScreen message="Loading subscription..." />;
  }

  return (
    <div className="host-subscription">
      <div className="page-header">
        <h1>Subscription</h1>
        <p>Manage your hosting plan and billing</p>
      </div>

      {subscription && (
        <div className="current-plan-card">
          <div className="plan-info">
            <div className="plan-badge">
              <Crown size={20} />
              <span>Current Plan</span>
            </div>
            <h2>{subscription.plan?.name || 'Free'}</h2>
            <p>
              {subscription.billingCycle === 'yearly' ? 'Annual' : 'Monthly'} billing - 
              Next billing date: {formatDate(subscription.currentPeriodEnd)}
            </p>
          </div>
          <div className="plan-status">
            <Badge variant={subscription.status === 'active' ? 'success' : 'warning'}>
              {subscription.status}
            </Badge>
            {subscription.cancelAtPeriodEnd && (
              <span className="cancel-notice">Cancels at period end</span>
            )}
          </div>
          <div className="plan-actions">
            {!subscription.cancelAtPeriodEnd && (
              <button 
                className="btn btn-secondary"
                onClick={() => setCancelModal(true)}
              >
                Cancel Subscription
              </button>
            )}
          </div>
        </div>
      )}

      <div className="billing-toggle">
        <span className={billingCycle === 'monthly' ? 'active' : ''}>Monthly</span>
        <button 
          className={`toggle-switch ${billingCycle === 'yearly' ? 'yearly' : ''}`}
          onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
        >
          <span className="toggle-slider"></span>
        </button>
        <span className={billingCycle === 'yearly' ? 'active' : ''}>
          Yearly
          <Badge variant="success" size="sm">Save up to 20%</Badge>
        </span>
      </div>

      <div className="plans-grid">
        {plans?.map((plan) => {
          const Icon = getPlanIcon(plan.name);
          const isCurrentPlan = subscription?.planId === plan.id;
          const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
          
          return (
            <div 
              key={plan.id} 
              className={`plan-card ${plan.isPopular ? 'popular' : ''} ${isCurrentPlan ? 'current' : ''}`}
            >
              {plan.isPopular && <div className="popular-badge">Most Popular</div>}
              
              <div className="plan-header">
                <div className="plan-icon">
                  <Icon size={24} />
                </div>
                <h3>{plan.name}</h3>
                <p className="plan-description">{plan.description}</p>
              </div>

              <div className="plan-price">
                <span className="price-amount">{formatPrice(price)}</span>
                <span className="price-period">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                {billingCycle === 'yearly' && (
                  <span className="savings">
                    Save {getYearlySavings(plan.monthlyPrice, plan.yearlyPrice)}%
                  </span>
                )}
              </div>

              <ul className="plan-features">
                <li>
                  <Check size={16} />
                  <span>Up to {plan.maxListings} listings</span>
                </li>
                <li>
                  <Check size={16} />
                  <span>{plan.commissionRate}% commission rate</span>
                </li>
                {plan.features.map((feature, idx) => (
                  <li key={idx}>
                    <Check size={16} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="plan-footer">
                {isCurrentPlan ? (
                  <button className="btn btn-secondary" disabled>
                    Current Plan
                  </button>
                ) : (
                  <button 
                    className={`btn ${plan.isPopular ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setUpgradeModal({ open: true, plan })}
                  >
                    {subscription?.planId ? 'Switch Plan' : 'Get Started'}
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={upgradeModal.open}
        onClose={() => setUpgradeModal({ open: false, plan: null })}
        title={`Subscribe to ${upgradeModal.plan?.name}`}
        footer={
          <>
            <button 
              className="btn btn-secondary"
              onClick={() => setUpgradeModal({ open: false, plan: null })}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => upgradeModal.plan && handleSubscribe(upgradeModal.plan.id)}
              disabled={processing === 'loading'}
            >
              {processing === 'loading' ? 'Processing...' : 'Confirm Subscription'}
            </button>
          </>
        }
      >
        <div className="subscription-confirm">
          <div className="confirm-plan">
            <h4>{upgradeModal.plan?.name}</h4>
            <p className="confirm-price">
              {formatPrice(billingCycle === 'monthly' 
                ? upgradeModal.plan?.monthlyPrice || 0 
                : upgradeModal.plan?.yearlyPrice || 0
              )} / {billingCycle === 'monthly' ? 'month' : 'year'}
            </p>
          </div>
          <p>You will be charged immediately. Your subscription will renew automatically.</p>
          <div className="payment-method-preview">
            <CreditCard size={20} />
            <span>**** 4242</span>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={cancelModal}
        onClose={() => setCancelModal(false)}
        title="Cancel Subscription"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setCancelModal(false)}>
              Keep Subscription
            </button>
            <button 
              className="btn btn-danger"
              onClick={handleCancelSubscription}
              disabled={processing === 'loading'}
            >
              {processing === 'loading' ? 'Cancelling...' : 'Confirm Cancellation'}
            </button>
          </>
        }
      >
        <p>Are you sure you want to cancel your subscription?</p>
        <p>You'll continue to have access until the end of your current billing period.</p>
      </Modal>
    </div>
  );
}
