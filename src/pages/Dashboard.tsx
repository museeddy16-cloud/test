import { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  Home,
  Star,
  MessageSquare,
  ArrowUpRight,
  Menu
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';

const stats = [
  { icon: Home, label: 'Total Listings', value: '12', change: '+2', trend: 'up' },
  { icon: Users, label: 'Total Guests', value: '248', change: '+18', trend: 'up' },
  { icon: Calendar, label: 'Reservations', value: '34', change: '+5', trend: 'up' },
  { icon: DollarSign, label: 'Total Earnings', value: '$12,450', change: '+12%', trend: 'up' },
];

const recentBookings = [
  { id: 1, guest: 'John Smith', property: 'Modern Beach House', dates: 'Nov 15-20', status: 'confirmed', amount: 2250 },
  { id: 2, guest: 'Sarah Johnson', property: 'Luxury City Apartment', dates: 'Dec 1-6', status: 'pending', amount: 1920 },
  { id: 3, guest: 'Mike Williams', property: 'Cozy Mountain Cabin', dates: 'Dec 10-15', status: 'confirmed', amount: 1400 },
  { id: 4, guest: 'Emily Brown', property: 'Countryside Villa', dates: 'Jan 5-12', status: 'confirmed', amount: 3640 },
];

const recentMessages = [
  { id: 1, sender: 'John Smith', message: 'Is early check-in possible?', time: '2 hours ago', unread: true },
  { id: 2, sender: 'Sarah Johnson', message: 'Thanks for the quick response!', time: '5 hours ago', unread: false },
  { id: 3, sender: 'Mike Williams', message: 'Looking forward to my stay!', time: '1 day ago', unread: false },
];

const topProperties = [
  { id: 1, name: 'Modern Beach House', rating: 4.92, reviews: 48, earnings: 4500, image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200' },
  { id: 2, name: 'Luxury City Apartment', rating: 4.88, reviews: 32, earnings: 3200, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200' },
  { id: 3, name: 'Cozy Mountain Cabin', rating: 4.95, reviews: 56, earnings: 2800, image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=200' },
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="dashboard-main">
        <div className="host-dashboard-badge">Host Dashboard</div>
        <header className="dashboard-header">
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <div>
            <h1>Host Dashboard</h1>
            <p>Here's what's happening with your properties</p>
          </div>
        </header>

        <div className="dashboard-content">
          <section className="stats-section">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon">
                  <stat.icon size={24} />
                </div>
                <div className="stat-info">
                  <span className="stat-label">{stat.label}</span>
                  <span className="stat-value">{stat.value}</span>
                </div>
                <span className={`stat-change ${stat.trend}`}>
                  <TrendingUp size={14} />
                  {stat.change}
                </span>
              </div>
            ))}
          </section>

          <div className="dashboard-grid">
            <section className="bookings-section">
              <div className="section-header">
                <h2>Recent Bookings</h2>
                <a href="/dashboard/reservations" className="view-all">
                  View all <ArrowUpRight size={16} />
                </a>
              </div>
              <div className="bookings-table">
                <table>
                  <thead>
                    <tr>
                      <th>Guest</th>
                      <th>Property</th>
                      <th>Dates</th>
                      <th>Status</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>{booking.guest}</td>
                        <td>{booking.property}</td>
                        <td>{booking.dates}</td>
                        <td>
                          <span className={`status-badge ${booking.status}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="amount">${booking.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="messages-section">
              <div className="section-header">
                <h2>Recent Messages</h2>
                <a href="/dashboard/messages" className="view-all">
                  View all <ArrowUpRight size={16} />
                </a>
              </div>
              <div className="messages-list">
                {recentMessages.map((msg) => (
                  <div key={msg.id} className={`message-item ${msg.unread ? 'unread' : ''}`}>
                    <div className="message-avatar">
                      {msg.sender.charAt(0)}
                    </div>
                    <div className="message-content">
                      <div className="message-header">
                        <span className="message-sender">{msg.sender}</span>
                        <span className="message-time">{msg.time}</span>
                      </div>
                      <p className="message-text">{msg.message}</p>
                    </div>
                    {msg.unread && <span className="unread-dot"></span>}
                  </div>
                ))}
              </div>
            </section>

            <section className="properties-section">
              <div className="section-header">
                <h2>Top Performing Properties</h2>
                <a href="/dashboard/listings" className="view-all">
                  View all <ArrowUpRight size={16} />
                </a>
              </div>
              <div className="properties-list">
                {topProperties.map((property) => (
                  <div key={property.id} className="property-item">
                    <img src={property.image} alt={property.name} />
                    <div className="property-details">
                      <h3>{property.name}</h3>
                      <div className="property-stats">
                        <span className="rating">
                          <Star size={14} fill="currentColor" />
                          {property.rating}
                        </span>
                        <span className="reviews">{property.reviews} reviews</span>
                      </div>
                    </div>
                    <span className="property-earnings">${property.earnings}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
