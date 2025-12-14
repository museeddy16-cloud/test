import { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  CreditCard
} from 'lucide-react';
import { useFetch } from '../../hooks/useDashboard';
import StatCard from '../../components/ui/StatCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Badge from '../../components/ui/Badge';
import { Payment, Payout } from '../../types/dashboard';

interface EarningsData {
  totalEarnings: number;
  pendingPayouts: number;
  completedPayouts: number;
  thisMonth: number;
  lastMonth: number;
  transactions: Payment[];
  payouts: Payout[];
}

export default function HostEarnings() {
  const { data: earnings, loading } = useFetch<EarningsData>('/host/earnings');
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'payouts'>('overview');
  const [dateRange, setDateRange] = useState('30');

  if (loading === 'loading') {
    return <LoadingSpinner fullScreen message="Loading earnings..." />;
  }

  const monthlyChange = earnings?.lastMonth 
    ? ((earnings.thisMonth - earnings.lastMonth) / earnings.lastMonth * 100).toFixed(1)
    : '0';

  const formatCurrency = (amount: number) => `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="host-earnings">
      <div className="page-header">
        <div>
          <h1>Earnings & Payouts</h1>
          <p>Track your revenue and manage payouts</p>
        </div>
        <div className="header-actions">
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="date-select"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button className="btn btn-secondary">
            <Download size={18} />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard 
          title="Total Earnings" 
          value={formatCurrency(earnings?.totalEarnings ?? 0)} 
          icon={DollarSign}
          color="success"
        />
        <StatCard 
          title="This Month" 
          value={formatCurrency(earnings?.thisMonth ?? 0)} 
          icon={TrendingUp}
          color="primary"
          change={{ 
            value: parseFloat(monthlyChange), 
            type: parseFloat(monthlyChange) >= 0 ? 'increase' : 'decrease' 
          }}
        />
        <StatCard 
          title="Pending Payouts" 
          value={formatCurrency(earnings?.pendingPayouts ?? 0)} 
          icon={Wallet}
          color="warning"
        />
        <StatCard 
          title="Completed Payouts" 
          value={formatCurrency(earnings?.completedPayouts ?? 0)} 
          icon={CreditCard}
          color="info"
        />
      </div>

      <div className="earnings-content">
        <div className="tabs-header">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            Transactions
          </button>
          <button 
            className={`tab-btn ${activeTab === 'payouts' ? 'active' : ''}`}
            onClick={() => setActiveTab('payouts')}
          >
            Payouts
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="chart-placeholder">
              <div className="chart-header">
                <h3>Earnings Over Time</h3>
              </div>
              <div className="chart-body">
                <div className="chart-bars">
                  {[65, 45, 80, 55, 90, 70, 85].map((height, i) => (
                    <div key={i} className="bar-wrapper">
                      <div className="bar" style={{ height: `${height}%` }}></div>
                      <span className="bar-label">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="recent-activity">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                {earnings?.transactions?.slice(0, 5).map((tx) => (
                  <div key={tx.id} className="activity-item">
                    <div className={`activity-icon ${tx.type === 'booking' ? 'income' : 'payout'}`}>
                      {tx.type === 'booking' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                    </div>
                    <div className="activity-info">
                      <span className="activity-title">
                        {tx.type === 'booking' ? 'Booking Payment' : 'Payout'}
                      </span>
                      <span className="activity-date">{formatDate(tx.createdAt)}</span>
                    </div>
                    <span className={`activity-amount ${tx.type === 'booking' ? 'positive' : 'negative'}`}>
                      {tx.type === 'booking' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="transactions-section">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {earnings?.transactions?.map((tx) => (
                  <tr key={tx.id}>
                    <td>{formatDate(tx.createdAt)}</td>
                    <td>
                      <Badge variant={tx.type === 'booking' ? 'success' : 'info'}>
                        {tx.type}
                      </Badge>
                    </td>
                    <td>Booking #{tx.bookingId?.slice(0, 8) || tx.id.slice(0, 8)}</td>
                    <td>
                      <Badge variant={tx.status === 'completed' ? 'success' : 'warning'}>
                        {tx.status}
                      </Badge>
                    </td>
                    <td className={tx.type === 'booking' ? 'positive' : ''}>
                      {tx.type === 'booking' ? '+' : ''}{formatCurrency(tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'payouts' && (
          <div className="payouts-section">
            <div className="payout-info-card">
              <div className="payout-balance">
                <h4>Available Balance</h4>
                <span className="balance-amount">{formatCurrency(earnings?.pendingPayouts ?? 0)}</span>
              </div>
              <button className="btn btn-primary">
                Request Payout
              </button>
            </div>

            <h3>Payout History</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {earnings?.payouts?.map((payout) => (
                  <tr key={payout.id}>
                    <td>{formatDate(payout.createdAt)}</td>
                    <td>{payout.payoutMethod || 'Bank Transfer'}</td>
                    <td>
                      <Badge variant={
                        payout.status === 'completed' ? 'success' : 
                        payout.status === 'processing' ? 'warning' : 'secondary'
                      }>
                        {payout.status}
                      </Badge>
                    </td>
                    <td>{formatCurrency(payout.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
