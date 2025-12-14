import { DollarSign, TrendingUp, Download, Eye, Calendar, Home, BarChart3, PieChart, Target, Award } from 'lucide-react';
import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';

const earningsData = [
  { id: 1, property: 'Modern Beach House', month: 'November 2024', earnings: 4500, nights: 18, bookings: 3, occupancy: 60 },
  { id: 2, property: 'Luxury City Apartment', month: 'November 2024', earnings: 3200, nights: 10, bookings: 2, occupancy: 33 },
  { id: 3, property: 'Cozy Mountain Cabin', month: 'November 2024', earnings: 2800, nights: 14, bookings: 2, occupancy: 47 },
  { id: 4, property: 'Modern Beach House', month: 'October 2024', earnings: 3900, nights: 15, bookings: 2, occupancy: 50 },
  { id: 5, property: 'Luxury City Apartment', month: 'October 2024', earnings: 2800, nights: 9, bookings: 2, occupancy: 30 },
];

const monthlyEarnings = [
  { month: 'Aug', total: 8500, growth: 12.5 },
  { month: 'Sep', total: 9200, growth: 8.2 },
  { month: 'Oct', total: 11400, growth: 23.9 },
  { month: 'Nov', total: 10500, growth: -7.9 },
  { month: 'Dec', total: 12450, growth: 18.6 },
];

const performanceMetrics = [
  { label: 'Average Daily Rate', value: '$185', change: '+5.2%', trend: 'up', icon: Target },
  { label: 'Occupancy Rate', value: '42%', change: '+8.1%', trend: 'up', icon: PieChart },
  { label: 'Revenue per Booking', value: '$1,240', change: '+12.3%', trend: 'up', icon: Award },
];

export default function Earnings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('current');

  const totalEarnings = 12450;
  const monthlyGrowth = 18.6;
  const totalBookings = 34;
  const avgOccupancy = 42;

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="dashboard-main">
        <div className="host-dashboard-badge">Host Dashboard</div>
        <header className="dashboard-header">
          <div>
            <h1>Earnings</h1>
            <p>Track your income and performance</p>
          </div>
          <button className="btn-primary">
            <Download size={20} />
            Download Report
          </button>
        </header>

        <div className="dashboard-content">
          {/* Performance Metrics */}
          <div className="performance-metrics">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="metric-card">
                <div className="metric-icon">
                  <metric.icon size={24} />
                </div>
                <div className="metric-info">
                  <span className="metric-label">{metric.label}</span>
                  <span className="metric-value">{metric.value}</span>
                  <span className={`metric-change ${metric.trend}`}>
                    <TrendingUp size={14} />
                    {metric.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="earnings-summary">
            <div className="earnings-card">
              <div className="earnings-icon">
                <DollarSign size={32} />
              </div>
              <div className="earnings-info">
                <span className="earnings-label">Total Earnings</span>
                <span className="earnings-value">${totalEarnings.toLocaleString()}</span>
                <span className="earnings-period">December 2024</span>
              </div>
            </div>

            <div className="earnings-card">
              <div className="earnings-icon">
                <TrendingUp size={32} />
              </div>
              <div className="earnings-info">
                <span className="earnings-label">Monthly Growth</span>
                <span className="earnings-value">{monthlyGrowth}%</span>
                <span className="earnings-period">vs. Last Month</span>
              </div>
            </div>

            <div className="earnings-card">
              <div className="earnings-icon">
                <Calendar size={32} />
              </div>
              <div className="earnings-info">
                <span className="earnings-label">Total Bookings</span>
                <span className="earnings-value">{totalBookings}</span>
                <span className="earnings-period">This Year</span>
              </div>
            </div>

            <div className="earnings-card">
              <div className="earnings-icon">
                <PieChart size={32} />
              </div>
              <div className="earnings-info">
                <span className="earnings-label">Avg. Occupancy</span>
                <span className="earnings-value">{avgOccupancy}%</span>
                <span className="earnings-period">This Month</span>
              </div>
            </div>
          </div>

          <div className="earnings-chart-container">
            <div className="chart-header">
              <h2>Monthly Earnings Trend</h2>
              <div className="chart-controls">
                <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
                  <option value="current">Current Year</option>
                  <option value="last">Last Year</option>
                  <option value="all">All Time</option>
                </select>
              </div>
            </div>
            <div className="earnings-chart">
              {monthlyEarnings.map((data, idx) => (
                <div key={idx} className="chart-bar-container">
                  <div className="chart-bar">
                    <div 
                      className="chart-fill"
                      style={{ height: `${(data.total / 15000) * 100}%` }}
                    ></div>
                  </div>
                  <span className="chart-label">{data.month}</span>
                  <span className="chart-value">${(data.total / 1000).toFixed(1)}k</span>
                  <span className={`chart-growth ${data.growth >= 0 ? 'positive' : 'negative'}`}>
                    {data.growth >= 0 ? '+' : ''}{data.growth}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="earnings-breakdown">
            <div className="section-header">
              <h2>Earnings by Property</h2>
              <div className="section-actions">
                <button className="btn-secondary">
                  <Download size={16} />
                  Export
                </button>
              </div>
            </div>
            <div className="earnings-table-container">
              <table className="earnings-table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Period</th>
                    <th>Earnings</th>
                    <th>Nights</th>
                    <th>Bookings</th>
                    <th>Occupancy</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {earningsData.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="property-cell">
                          <Home size={16} />
                          {item.property}
                        </div>
                      </td>
                      <td>{item.month}</td>
                      <td className="earnings-amount">${item.earnings.toLocaleString()}</td>
                      <td>{item.nights}</td>
                      <td>{item.bookings}</td>
                      <td>
                        <div className="occupancy-cell">
                          <div className="occupancy-bar">
                            <div 
                              className="occupancy-fill"
                              style={{ width: `${item.occupancy}%` }}
                            ></div>
                          </div>
                          <span className="occupancy-text">{item.occupancy}%</span>
                        </div>
                      </td>
                      <td>
                        <button className="btn-icon">
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="earnings-payout">
            <h2>Payout Information</h2>
            <div className="payout-cards">
              <div className="payout-card">
                <span className="payout-label">Next Payout</span>
                <span className="payout-value">December 15, 2024</span>
                <span className="payout-amount">$12,450</span>
              </div>
              <div className="payout-card">
                <span className="payout-label">Bank Account</span>
                <span className="payout-value">••••5678</span>
                <button className="btn-secondary btn-small">Update</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
