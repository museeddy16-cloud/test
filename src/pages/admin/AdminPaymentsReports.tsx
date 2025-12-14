import { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard,
  Download,
  Calendar,
  Users,
  Home
} from 'lucide-react';
import { useFetch } from '../../hooks/useDashboard';
import StatCard from '../../components/ui/StatCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Badge from '../../components/ui/Badge';
import Tabs from '../../components/ui/Tabs';
import { Payment } from '../../types/dashboard';

interface RevenueStats {
  totalRevenue: number;
  monthlyRevenue: number;
  platformFees: number;
  payouts: number;
  subscriptionRevenue: number;
  bookingRevenue: number;
  pendingPayouts: number;
}

export default function AdminPaymentsReports() {
  const { data: stats, loading: statsLoading } = useFetch<RevenueStats>('/admin/payments/stats');
  const { data: recentPayments, loading: paymentsLoading } = useFetch<Payment[]>('/admin/payments/recent');
  const [dateRange, setDateRange] = useState('30');

  if (statsLoading === 'loading') {
    return <LoadingSpinner fullScreen message="Loading reports..." />;
  }

  const formatCurrency = (amount: number) => `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <div className="reports-overview">
          <div className="chart-section">
            <div className="chart-header">
              <h3>Revenue Over Time</h3>
              <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
            </div>
            <div className="chart-placeholder">
              <div className="chart-bars">
                {[45, 65, 55, 80, 70, 90, 75, 85, 60, 95, 80, 70].map((h, i) => (
                  <div key={i} className="bar-wrapper">
                    <div className="bar" style={{ height: `${h}%` }}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="revenue-breakdown">
            <h3>Revenue Breakdown</h3>
            <div className="breakdown-chart">
              <div className="pie-placeholder">
                <div className="pie-segment booking" style={{ '--percentage': '65%' } as React.CSSProperties}></div>
                <div className="pie-segment subscription" style={{ '--percentage': '25%' } as React.CSSProperties}></div>
                <div className="pie-segment fees" style={{ '--percentage': '10%' } as React.CSSProperties}></div>
              </div>
              <div className="breakdown-legend">
                <div className="legend-item">
                  <span className="color-dot booking"></span>
                  <span>Booking Revenue</span>
                  <span className="value">{formatCurrency(stats?.bookingRevenue || 0)}</span>
                </div>
                <div className="legend-item">
                  <span className="color-dot subscription"></span>
                  <span>Subscription Revenue</span>
                  <span className="value">{formatCurrency(stats?.subscriptionRevenue || 0)}</span>
                </div>
                <div className="legend-item">
                  <span className="color-dot fees"></span>
                  <span>Platform Fees</span>
                  <span className="value">{formatCurrency(stats?.platformFees || 0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'transactions',
      label: 'Transactions',
      content: (
        <div className="transactions-report">
          <div className="section-header">
            <h3>Recent Transactions</h3>
            <button className="btn btn-secondary">
              <Download size={16} />
              Export CSV
            </button>
          </div>
          
          {paymentsLoading === 'loading' ? (
            <LoadingSpinner message="Loading transactions..." />
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>User</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments?.map((payment) => (
                  <tr key={payment.id}>
                    <td>{formatDate(payment.createdAt)}</td>
                    <td>
                      <Badge variant={payment.type === 'booking' ? 'info' : 'secondary'}>
                        {payment.type}
                      </Badge>
                    </td>
                    <td>User #{payment.userId.slice(0, 8)}</td>
                    <td>
                      {payment.type === 'booking' 
                        ? `Booking #${payment.bookingId?.slice(0, 8)}` 
                        : 'Subscription Payment'}
                    </td>
                    <td>
                      <Badge variant={
                        payment.status === 'completed' ? 'success' : 
                        payment.status === 'pending' ? 'warning' : 'danger'
                      }>
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="amount">{formatCurrency(payment.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ),
    },
    {
      id: 'payouts',
      label: 'Payouts',
      content: (
        <div className="payouts-report">
          <div className="payout-summary">
            <div className="summary-card">
              <h4>Pending Payouts</h4>
              <span className="amount">{formatCurrency(stats?.pendingPayouts || 0)}</span>
              <button className="btn btn-primary btn-sm">Process All</button>
            </div>
            <div className="summary-card">
              <h4>Completed This Month</h4>
              <span className="amount">{formatCurrency(stats?.payouts || 0)}</span>
            </div>
          </div>

          <div className="section-header">
            <h3>Payout Queue</h3>
          </div>
          
          <table className="data-table">
            <thead>
              <tr>
                <th>Host</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="user-info">
                    <Users size={16} />
                    <span>John Smith</span>
                  </div>
                </td>
                <td>$1,250.00</td>
                <td>Bank Transfer</td>
                <td><Badge variant="warning">Pending</Badge></td>
                <td>
                  <button className="btn btn-success btn-sm">Approve</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
    },
  ];

  return (
    <div className="admin-payments-reports">
      <div className="page-header">
        <div>
          <h1>Payments & Reports</h1>
          <p>Platform revenue and financial reports</p>
        </div>
        <button className="btn btn-secondary">
          <Download size={18} />
          Export Report
        </button>
      </div>

      <div className="stats-grid">
        <StatCard 
          title="Total Revenue" 
          value={formatCurrency(stats?.totalRevenue || 0)} 
          icon={DollarSign}
          color="success"
        />
        <StatCard 
          title="This Month" 
          value={formatCurrency(stats?.monthlyRevenue || 0)} 
          icon={TrendingUp}
          color="primary"
          change={{ value: 12.5, type: 'increase' }}
        />
        <StatCard 
          title="Platform Fees" 
          value={formatCurrency(stats?.platformFees || 0)} 
          icon={CreditCard}
          color="info"
        />
        <StatCard 
          title="Pending Payouts" 
          value={formatCurrency(stats?.pendingPayouts || 0)} 
          icon={Calendar}
          color="warning"
        />
      </div>

      <Tabs tabs={tabs} />
    </div>
  );
}
