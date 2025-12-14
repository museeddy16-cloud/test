import { Settings, Bell, Lock, User, CreditCard, Eye, EyeOff, Save } from 'lucide-react';
import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';

export default function DashboardSettings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'Guest',
    lastName: 'User',
    email: 'guest@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'I love traveling and meeting new people.',
    language: 'English',
    currency: 'USD',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="dashboard-main">
        <div className="host-dashboard-badge">Host Dashboard</div>
        <header className="dashboard-header">
          <div>
            <h1>Settings</h1>
            <p>Manage your account preferences</p>
          </div>
        </header>

        <div className="dashboard-content">
          <div className="settings-container">
            <div className="settings-tabs">
              <button 
                className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <User size={20} />
                Profile
              </button>
              <button 
                className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                <Lock size={20} />
                Security
              </button>
              <button 
                className={`settings-tab ${activeTab === 'payments' ? 'active' : ''}`}
                onClick={() => setActiveTab('payments')}
              >
                <CreditCard size={20} />
                Payments
              </button>
              <button 
                className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('notifications')}
              >
                <Bell size={20} />
                Notifications
              </button>
            </div>

            <div className="settings-content">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="settings-section">
                  <h2>Profile Information</h2>
                  <div className="form-group">
                    <label>First Name</label>
                    <input 
                      type="text" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input 
                      type="text" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter your last name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="form-group">
                    <label>Bio</label>
                    <textarea 
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell guests about yourself"
                      rows={4}
                    ></textarea>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Language</label>
                      <select name="language" value={formData.language} onChange={handleChange}>
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Currency</label>
                      <select name="currency" value={formData.currency} onChange={handleChange}>
                        <option>USD</option>
                        <option>EUR</option>
                        <option>GBP</option>
                        <option>JPY</option>
                      </select>
                    </div>
                  </div>
                  <button className="btn-primary">
                    <Save size={20} />
                    Save Changes
                  </button>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="settings-section">
                  <h2>Security Settings</h2>
                  
                  <div className="security-item">
                    <div className="security-info">
                      <h3>Password</h3>
                      <p>Change your password regularly to keep your account secure</p>
                    </div>
                    <button className="btn-secondary">Change Password</button>
                  </div>

                  <div className="security-item">
                    <div className="security-info">
                      <h3>Two-Factor Authentication</h3>
                      <p>Add an extra layer of security to your account</p>
                      <span className="status-badge inactive">Not Enabled</span>
                    </div>
                    <button className="btn-primary">Enable 2FA</button>
                  </div>

                  <div className="security-item">
                    <div className="security-info">
                      <h3>Login Activity</h3>
                      <p>View all devices and sessions accessing your account</p>
                    </div>
                    <button className="btn-secondary">View Activity</button>
                  </div>

                  <div className="security-item">
                    <div className="security-info">
                      <h3>Delete Account</h3>
                      <p>Permanently delete your account and all associated data</p>
                    </div>
                    <button className="btn-danger-outline">Delete Account</button>
                  </div>
                </div>
              )}

              {/* Payments Tab */}
              {activeTab === 'payments' && (
                <div className="settings-section">
                  <h2>Payment Methods</h2>
                  
                  <div className="payment-methods">
                    <div className="payment-card active">
                      <span className="card-type">Visa</span>
                      <span className="card-number">•••• •••• •••• 5678</span>
                      <span className="card-expires">Expires 12/25</span>
                      <span className="card-default">Default</span>
                    </div>
                  </div>

                  <button className="btn-secondary">Add Payment Method</button>

                  <h3 style={{ marginTop: '40px' }}>Payout Account</h3>
                  <div className="payout-info">
                    <p>Bank: Chase Bank</p>
                    <p>Account: ••••5678</p>
                    <p>Type: Checking</p>
                    <button className="btn-secondary" style={{ marginTop: '15px' }}>Update Payout</button>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="settings-section">
                  <h2>Notification Preferences</h2>
                  
                  <div className="notification-item">
                    <div className="notification-info">
                      <h3>Email Notifications</h3>
                      <p>New bookings, messages, and reviews</p>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-switch"></span>
                    </label>
                  </div>

                  <div className="notification-item">
                    <div className="notification-info">
                      <h3>SMS Notifications</h3>
                      <p>Urgent alerts and confirmations</p>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-switch"></span>
                    </label>
                  </div>

                  <div className="notification-item">
                    <div className="notification-info">
                      <h3>Marketing Emails</h3>
                      <p>Tips, promotions, and special offers</p>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" />
                      <span className="toggle-switch"></span>
                    </label>
                  </div>

                  <div className="notification-item">
                    <div className="notification-info">
                      <h3>Account Updates</h3>
                      <p>Important information about your account</p>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-switch"></span>
                    </label>
                  </div>

                  <button className="btn-primary" style={{ marginTop: '30px' }}>
                    <Save size={20} />
                    Save Preferences
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
