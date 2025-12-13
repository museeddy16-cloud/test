import { DollarSign, TrendingUp, Download, Eye, Calendar, Home } from 'lucide-react';
import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';

const earningsData = [
  { id: 1, property: 'Modern Beach House', month: 'November 2024', earnings: 4500, nights: 18, bookings: 3 },
  { id: 2, property: 'Luxury City Apartment', month: 'November 2024', earnings: 3200, nights: 10, bookings: 2 },
  { id: 3, property: 'Cozy Mountain Cabin', month: 'November 2024', earnings: 2800, nights: 14, bookings: 2 },
  { id: 4, property: 'Modern Beach House', month: 'October 2024', earnings: 3900, nights: 15, bookings: 2 },
  { id: 5, property: 'Luxury City Apartment', month: 'October 2024', earnings: 2800, nights: 9, bookings: 2 },
];

const monthlyEarnings = [
  { month: 'Aug', total: 8500 },
  { month: 'Sep', total: 9200 },
  { month: 'Oct', total: 11400 },
  { month: 'Nov', total: 10500 },
  { month: 'Dec', total: 12450 },
];

export default function Earnings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('current');

  const totalEarnings = 12450;
  const monthlyGrowth = 8.7;
  const totalBookings = 34;

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
          <div className="earnings-summary">
            <div className="earnings-card">
              <div className="earnings-icon">
                <DollarSign size={32} />
              </div>
              <div className="earnings-info">
                <span className="earnings-label">Total Earnings</span>
                <span className="earnings-value">${totalEarnings}</span>
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
          </div>

          <div className="earnings-chart-container">
            <h2>Monthly Earnings Trend</h2>
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
                  <span className="chart-value">${data.total}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="earnings-breakdown">
            <h2>Earnings by Property</h2>
            <div className="earnings-table-container">
              <table className="earnings-table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Period</th>
                    <th>Earnings</th>
                    <th>Nights</th>
                    <th>Bookings</th>
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
                      <td className="earnings-amount">${item.earnings}</td>
                      <td>{item.nights}</td>
                      <td>{item.bookings}</td>
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
