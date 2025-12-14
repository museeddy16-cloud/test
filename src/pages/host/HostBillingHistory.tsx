import { Download, FileText, CreditCard } from 'lucide-react';
import { usePagination } from '../../hooks/useDashboard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';
import { Payment } from '../../types/dashboard';

export default function HostBillingHistory() {
  const { data: payments, loading, page, totalPages, goToPage } = usePagination<Payment>('/host/billing/history', 15);

  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  if (loading === 'loading') {
    return <LoadingSpinner fullScreen message="Loading billing history..." />;
  }

  return (
    <div className="host-billing-history">
      <div className="page-header">
        <h1>Billing History</h1>
        <p>View your subscription payments and invoices</p>
      </div>

      {payments.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No billing history"
          description="Your subscription payment history will appear here"
        />
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Invoice</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{formatDate(payment.createdAt)}</td>
                  <td>
                    <div className="billing-description">
                      <FileText size={16} />
                      <span>
                        {payment.type === 'subscription' 
                          ? 'Subscription Payment' 
                          : 'Payment'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="payment-method">
                      <CreditCard size={16} />
                      <span>{payment.paymentMethod || '**** 4242'}</span>
                    </div>
                  </td>
                  <td>
                    <Badge variant={
                      payment.status === 'completed' ? 'success' : 
                      payment.status === 'pending' ? 'warning' : 
                      payment.status === 'refunded' ? 'info' : 'danger'
                    }>
                      {payment.status}
                    </Badge>
                  </td>
                  <td className="amount">{formatCurrency(payment.amount)}</td>
                  <td>
                    <button className="btn btn-secondary btn-sm">
                      <Download size={14} />
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="pagination">
              <button disabled={page === 1} onClick={() => goToPage(page - 1)}>Previous</button>
              <span>Page {page} of {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => goToPage(page + 1)}>Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
