import { useState, useEffect } from 'react';
import { 
  Settings, 
  Globe, 
  DollarSign, 
  Calendar,
  Shield,
  Save,
  Check,
  AlertTriangle
} from 'lucide-react';
import { useFetch, usePut } from '../../hooks/useDashboard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Tabs from '../../components/ui/Tabs';
import { PlatformSettings } from '../../types/dashboard';

export default function AdminPlatformSettings() {
  const { data: settings, loading, refetch } = useFetch<PlatformSettings>('/admin/settings');
  const { put, loading: saving } = usePut();
  
  const [formData, setFormData] = useState<Partial<PlatformSettings>>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleChange = (field: keyof PlatformSettings, value: string | number | boolean) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async () => {
    const result = await put('/admin/settings', formData);
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

  const tabs = [
    {
      id: 'general',
      label: 'General',
      content: (
        <div className="settings-section">
          <h3>General Settings</h3>
          
          <div className="settings-form">
            <div className="form-group">
              <label>
                <Globe size={18} />
                Site Name
              </label>
              <input
                type="text"
                value={formData.siteName || ''}
                onChange={(e) => handleChange('siteName', e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Default Currency</label>
                <select
                  value={formData.currency || 'USD'}
                  onChange={(e) => handleChange('currency', e.target.value)}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (E)</option>
                  <option value="GBP">GBP (P)</option>
                  <option value="RWF">RWF (FRw)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Default Language</label>
                <select
                  value={formData.defaultLanguage || 'en'}
                  onChange={(e) => handleChange('defaultLanguage', e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="es">Spanish</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'fees',
      label: 'Fees & Commission',
      content: (
        <div className="settings-section">
          <h3>Platform Fees</h3>
          <p className="section-description">Configure commission and service fees</p>
          
          <div className="settings-form">
            <div className="form-group">
              <label>
                <DollarSign size={18} />
                Guest Service Fee (%)
              </label>
              <div className="input-with-suffix">
                <input
                  type="number"
                  value={formData.serviceFeePercentage || 0}
                  onChange={(e) => handleChange('serviceFeePercentage', parseFloat(e.target.value) || 0)}
                  min={0}
                  max={100}
                  step={0.1}
                />
                <span>%</span>
              </div>
              <span className="helper-text">Fee charged to guests on each booking</span>
            </div>

            <div className="form-group">
              <label>Host Commission Rate (%)</label>
              <div className="input-with-suffix">
                <input
                  type="number"
                  value={formData.hostFeePercentage || 0}
                  onChange={(e) => handleChange('hostFeePercentage', parseFloat(e.target.value) || 0)}
                  min={0}
                  max={100}
                  step={0.1}
                />
                <span>%</span>
              </div>
              <span className="helper-text">Default commission taken from host earnings</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'booking',
      label: 'Booking Rules',
      content: (
        <div className="settings-section">
          <h3>Booking Settings</h3>
          <p className="section-description">Configure booking limits and rules</p>
          
          <div className="settings-form">
            <div className="form-row">
              <div className="form-group">
                <label>
                  <Calendar size={18} />
                  Minimum Booking Days
                </label>
                <input
                  type="number"
                  value={formData.minBookingDays || 1}
                  onChange={(e) => handleChange('minBookingDays', parseInt(e.target.value) || 1)}
                  min={1}
                />
              </div>

              <div className="form-group">
                <label>Maximum Booking Days</label>
                <input
                  type="number"
                  value={formData.maxBookingDays || 365}
                  onChange={(e) => handleChange('maxBookingDays', parseInt(e.target.value) || 365)}
                  min={1}
                />
              </div>
            </div>

            <div className="form-group toggle-group">
              <label>
                <Shield size={18} />
                Allow Instant Booking
              </label>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={formData.allowInstantBooking || false}
                  onChange={(e) => handleChange('allowInstantBooking', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="helper-text">Allow guests to book instantly without host approval</span>
            </div>

            <div className="form-group toggle-group">
              <label>Require ID Verification</label>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={formData.requireIdVerification || false}
                  onChange={(e) => handleChange('requireIdVerification', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="helper-text">Require guests to verify their identity before booking</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'maintenance',
      label: 'Maintenance',
      content: (
        <div className="settings-section">
          <h3>Maintenance Mode</h3>
          
          <div className="maintenance-toggle">
            <div className="maintenance-info">
              <AlertTriangle size={24} className={formData.maintenanceMode ? 'active' : ''} />
              <div>
                <h4>Maintenance Mode</h4>
                <p>When enabled, the platform will display a maintenance message to all users</p>
              </div>
            </div>
            <label className="toggle large">
              <input
                type="checkbox"
                checked={formData.maintenanceMode || false}
                onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          {formData.maintenanceMode && (
            <div className="maintenance-warning">
              <AlertTriangle size={18} />
              <span>Warning: Maintenance mode is currently enabled. Users cannot access the platform.</span>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="admin-platform-settings">
      <div className="page-header">
        <div>
          <h1>Platform Settings</h1>
          <p>Configure global platform settings</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving === 'loading'}
        >
          <Save size={18} />
          {saving === 'loading' ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.type === 'success' ? <Check size={18} /> : <AlertTriangle size={18} />}
          {message.text}
        </div>
      )}

      <Tabs tabs={tabs} />
    </div>
  );
}
