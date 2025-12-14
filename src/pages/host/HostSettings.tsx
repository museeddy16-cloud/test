import { useState, useEffect } from 'react';
import { 
  Bell, 
  Lock, 
  Globe, 
  CreditCard, 
  Shield,
  Check,
  Moon,
  Sun
} from 'lucide-react';
import { useFetch, usePut } from '../../hooks/useDashboard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Tabs from '../../components/ui/Tabs';

interface HostSettings {
  notifications: {
    emailBookings: boolean;
    emailMessages: boolean;
    emailMarketing: boolean;
    pushBookings: boolean;
    pushMessages: boolean;
    smsBookings: boolean;
  };
  preferences: {
    language: string;
    currency: string;
    timezone: string;
    theme: 'light' | 'dark' | 'system';
  };
  payoutMethod: {
    type: string;
    details: Record<string, string>;
  };
}

export default function HostSettings() {
  const { data: settings, loading, refetch } = useFetch<HostSettings>('/host/settings');
  const { put, loading: saving } = usePut();
  const [formData, setFormData] = useState<Partial<HostSettings>>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleNotificationChange = (key: keyof HostSettings['notifications']) => {
    setFormData({
      ...formData,
      notifications: {
        ...formData.notifications!,
        [key]: !formData.notifications?.[key],
      },
    });
  };

  const handlePreferenceChange = (key: keyof HostSettings['preferences'], value: string) => {
    setFormData({
      ...formData,
      preferences: {
        ...formData.preferences!,
        [key]: value,
      },
    });
  };

  const handleSave = async () => {
    const result = await put('/host/settings', formData);
    if (result) {
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      refetch();
    } else {
      setMessage({ type: 'error', text: 'Failed to save settings.' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  if (loading === 'loading') {
    return <LoadingSpinner fullScreen message="Loading settings..." />;
  }

  const notificationItems = [
    { key: 'emailBookings' as const, label: 'Booking notifications via email', icon: Bell },
    { key: 'emailMessages' as const, label: 'Message notifications via email', icon: Bell },
    { key: 'emailMarketing' as const, label: 'Marketing emails and updates', icon: Bell },
    { key: 'pushBookings' as const, label: 'Push notifications for bookings', icon: Bell },
    { key: 'pushMessages' as const, label: 'Push notifications for messages', icon: Bell },
    { key: 'smsBookings' as const, label: 'SMS alerts for urgent bookings', icon: Bell },
  ];

  const tabs = [
    {
      id: 'notifications',
      label: 'Notifications',
      content: (
        <div className="settings-section">
          <h3>Notification Preferences</h3>
          <p className="section-description">Choose how you want to be notified about your hosting activity</p>
          
          <div className="notification-list">
            {notificationItems.map((item) => (
              <div key={item.key} className="notification-item">
                <div className="notification-info">
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={formData.notifications?.[item.key] || false}
                    onChange={() => handleNotificationChange(item.key)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'preferences',
      label: 'Preferences',
      content: (
        <div className="settings-section">
          <h3>General Preferences</h3>
          <p className="section-description">Customize your hosting experience</p>
          
          <div className="preferences-form">
            <div className="form-group">
              <label>
                <Globe size={18} />
                Language
              </label>
              <select
                value={formData.preferences?.language || 'en'}
                onChange={(e) => handlePreferenceChange('language', e.target.value)}
              >
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
                <option value="de">German</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                <CreditCard size={18} />
                Currency
              </label>
              <select
                value={formData.preferences?.currency || 'USD'}
                onChange={(e) => handlePreferenceChange('currency', e.target.value)}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (E)</option>
                <option value="GBP">GBP (P)</option>
                <option value="RWF">RWF (FRw)</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                <Globe size={18} />
                Timezone
              </label>
              <select
                value={formData.preferences?.timezone || 'UTC'}
                onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
              >
                <option value="UTC">UTC</option>
                <option value="Africa/Kigali">Africa/Kigali</option>
                <option value="America/New_York">America/New York</option>
                <option value="Europe/London">Europe/London</option>
                <option value="Asia/Tokyo">Asia/Tokyo</option>
              </select>
            </div>

            <div className="form-group">
              <label>Theme</label>
              <div className="theme-options">
                {['light', 'dark', 'system'].map((theme) => (
                  <button
                    key={theme}
                    className={`theme-btn ${formData.preferences?.theme === theme ? 'active' : ''}`}
                    onClick={() => handlePreferenceChange('theme', theme)}
                  >
                    {theme === 'light' && <Sun size={18} />}
                    {theme === 'dark' && <Moon size={18} />}
                    {theme === 'system' && <Globe size={18} />}
                    <span>{theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'security',
      label: 'Security',
      content: (
        <div className="settings-section">
          <h3>Security Settings</h3>
          <p className="section-description">Keep your account secure</p>
          
          <div className="security-options">
            <div className="security-item">
              <div className="security-info">
                <Lock size={20} />
                <div>
                  <h4>Change Password</h4>
                  <p>Update your password regularly for better security</p>
                </div>
              </div>
              <button className="btn btn-secondary btn-sm">Change</button>
            </div>

            <div className="security-item">
              <div className="security-info">
                <Shield size={20} />
                <div>
                  <h4>Two-Factor Authentication</h4>
                  <p>Add an extra layer of security to your account</p>
                </div>
              </div>
              <button className="btn btn-secondary btn-sm">Enable</button>
            </div>

            <div className="security-item">
              <div className="security-info">
                <Globe size={20} />
                <div>
                  <h4>Active Sessions</h4>
                  <p>Manage devices where you're logged in</p>
                </div>
              </div>
              <button className="btn btn-secondary btn-sm">View</button>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'payout',
      label: 'Payout',
      content: (
        <div className="settings-section">
          <h3>Payout Settings</h3>
          <p className="section-description">Manage how you receive your earnings</p>
          
          <div className="payout-methods">
            <div className="payout-method active">
              <CreditCard size={24} />
              <div className="method-info">
                <h4>Bank Account</h4>
                <p>****1234</p>
              </div>
              <Check size={20} className="check-icon" />
            </div>

            <button className="btn btn-secondary add-method">
              + Add Payout Method
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="host-settings">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your account preferences</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving === 'loading'}
        >
          {saving === 'loading' ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`}>
          <Check size={18} />
          {message.text}
        </div>
      )}

      <Tabs tabs={tabs} />
    </div>
  );
}
