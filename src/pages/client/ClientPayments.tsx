import { useState } from 'react';
import { 
  CreditCard, 
  Plus, 
  Download, 
  Trash2,
  Check,
  FileText
} from 'lucide-react';
import { useFetch, usePost, useDelete } from '../../hooks/useDashboard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Tabs from '../../components/ui/Tabs';
import { Payment } from '../../types/dashboard';

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'bank';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export default function ClientPayments() {
  const { data: paymentMethods, loading: methodsLoading, refetch: refetchMethods } = useFetch<PaymentMethod[]>('/client/payment-methods');
  const { data: transactions, loading: txLoading } = useFetch<Payment[]>('/client/transactions');
  const { post, loading: adding } = usePost();
  const { remove, loading: deleting } = useDelete();
  
  const [addCardModal, setAddCardModal] = useState(false);
  const [cardForm, setCardForm] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
  });

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    await post('/client/payment-methods', cardForm);
    setAddCardModal(false);
    setCardForm({ number: '', expiry: '', cvc: '', name: '' });
    refetchMethods();
  };

  const handleDeleteCard = async (id: string) => {
    await remove(`/client/payment-methods/${id}`);
    refetchMethods();
  };

  const handleSetDefault = async (id: string) => {
    await post(`/client/payment-methods/${id}/default`, {});
    refetchMethods();
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const getCardIcon = (brand?: string) => {
    return <CreditCard size={24} />;
  };

  const tabs = [
    {
      id: 'methods',
      label: 'Payment Methods',
      content: (
        <div className="payment-methods-section">
          <div className="section-header">
            <h3>Saved Payment Methods</h3>
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => setAddCardModal(true)}
            >
              <Plus size={16} />
              Add New
            </button>
          </div>

          {methodsLoading === 'loading' ? (
            <LoadingSpinner message="Loading payment methods..." />
          ) : paymentMethods && paymentMethods.length > 0 ? (
            <div className="payment-methods-list">
              {paymentMethods.map((method) => (
                <div key={method.id} className={`payment-method-card ${method.isDefault ? 'default' : ''}`}>
                  <div className="method-icon">
                    {getCardIcon(method.brand)}
                  </div>
                  <div className="method-info">
                    <h4>{method.brand || 'Card'} ****{method.last4}</h4>
                    {method.expiryMonth && method.expiryYear && (
                      <p>Expires {method.expiryMonth}/{method.expiryYear}</p>
                    )}
                  </div>
                  <div className="method-actions">
                    {method.isDefault ? (
                      <Badge variant="success">Default</Badge>
                    ) : (
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleSetDefault(method.id)}
                      >
                        Set Default
                      </button>
                    )}
                    <button 
                      className="btn-icon danger"
                      onClick={() => handleDeleteCard(method.id)}
                      disabled={deleting === 'loading'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state-inline">
              <CreditCard size={48} />
              <p>No payment methods saved</p>
              <button 
                className="btn btn-primary"
                onClick={() => setAddCardModal(true)}
              >
                Add Payment Method
              </button>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'invoices',
      label: 'Invoices & Transactions',
      content: (
        <div className="transactions-section">
          <div className="section-header">
            <h3>Transaction History</h3>
          </div>

          {txLoading === 'loading' ? (
            <LoadingSpinner message="Loading transactions..." />
          ) : transactions && transactions.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>{formatDate(tx.createdAt)}</td>
                    <td>
                      <div className="tx-description">
                        <FileText size={16} />
                        <span>
                          {tx.type === 'booking' 
                            ? `Booking #${tx.bookingId?.slice(0, 8)}` 
                            : tx.type === 'subscription'
                            ? 'Subscription Payment'
                            : 'Payment'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <Badge variant={
                        tx.status === 'completed' ? 'success' : 
                        tx.status === 'pending' ? 'warning' : 
                        tx.status === 'refunded' ? 'info' : 'danger'
                      }>
                        {tx.status}
                      </Badge>
                    </td>
                    <td className="amount">${tx.amount.toFixed(2)}</td>
                    <td>
                      <button className="btn btn-secondary btn-sm">
                        <Download size={14} />
                        Invoice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state-inline">
              <FileText size={48} />
              <p>No transactions yet</p>
            </div>
          )}
        </div>
      ),
    },
  ];

  if (methodsLoading === 'loading' && txLoading === 'loading') {
    return <LoadingSpinner fullScreen message="Loading payments..." />;
  }

  return (
    <div className="client-payments">
      <div className="page-header">
        <h1>Payments & Invoices</h1>
        <p>Manage your payment methods and view transaction history</p>
      </div>

      <Tabs tabs={tabs} />

      <Modal
        isOpen={addCardModal}
        onClose={() => setAddCardModal(false)}
        title="Add Payment Method"
        size="md"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setAddCardModal(false)}>
              Cancel
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleAddCard}
              disabled={adding === 'loading'}
            >
              {adding === 'loading' ? 'Adding...' : 'Add Card'}
            </button>
          </>
        }
      >
        <form className="card-form">
          <div className="form-group">
            <label>Name on Card</label>
            <input
              type="text"
              value={cardForm.name}
              onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })}
              placeholder="John Doe"
              required
            />
          </div>
          <div className="form-group">
            <label>Card Number</label>
            <input
              type="text"
              value={cardForm.number}
              onChange={(e) => setCardForm({ ...cardForm, number: e.target.value })}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Expiry Date</label>
              <input
                type="text"
                value={cardForm.expiry}
                onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
                placeholder="MM/YY"
                maxLength={5}
                required
              />
            </div>
            <div className="form-group">
              <label>CVC</label>
              <input
                type="text"
                value={cardForm.cvc}
                onChange={(e) => setCardForm({ ...cardForm, cvc: e.target.value })}
                placeholder="123"
                maxLength={4}
                required
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
