import { useState } from 'react';
import { Menu, Save, Bell, Shield, Globe, Mail } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import './AdminDashboard.css';
import '../../styles/admin-settings.css';

export default function AdminSettings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'IRU Voyage',
    supportEmail: 'support@iruvoyage.com',
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: false,
    commissionRate: 10,
    currency: 'USD'
  });

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="admin-main">
        <header className="admin-header">
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <div>
            <h1>Admin Settings</h1>
            <p>Configure platform settings</p>
          </div>
        </header>

        <div className="admin-content">
          <div className="settings-grid">
            <section className="admin-section settings-section">
              <h2><Globe size={20} /> General Settings</h2>
              <div className="settings-form">
                <div className="form-group">
                  <label>Site Name</label>
                  <input 
                    type="text" 
                    value={settings.siteName}
                    onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Support Email</label>
                  <input 
                    type="email" 
                    value={settings.supportEmail}
                    onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Default Currency</label>
                  <select 
                    value={settings.currency}
                    onChange={(e) => setSettings({...settings, currency: e.target.value})}
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="RWF">RWF (FRw)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Platform Commission (%)</label>
                  <input 
                    type="number" 
                    value={settings.commissionRate}
                    onChange={(e) => setSettings({...settings, commissionRate: parseInt(e.target.value)})}
                    min="0"
                    max="50"
                  />
                </div>
              </div>
            </section>

            <section className="admin-section settings-section">
              <h2><Shield size={20} /> Security Settings</h2>
              <div className="settings-form">
                <div className="toggle-group">
                  <label>
                    <span>Maintenance Mode</span>
                    <p>Disable site access for users</p>
                  </label>
                  <label className="toggle">
                    <input 
                      type="checkbox" 
                      checked={settings.maintenanceMode}
                      onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="toggle-group">
                  <label>
                    <span>Allow Registration</span>
                    <p>Allow new users to register</p>
                  </label>
                  <label className="toggle">
                    <input 
                      type="checkbox" 
                      checked={settings.allowRegistration}
                      onChange={(e) => setSettings({...settings, allowRegistration: e.target.checked})}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="toggle-group">
                  <label>
                    <span>Require Email Verification</span>
                    <p>Users must verify email to book</p>
                  </label>
                  <label className="toggle">
                    <input 
                      type="checkbox" 
                      checked={settings.requireEmailVerification}
                      onChange={(e) => setSettings({...settings, requireEmailVerification: e.target.checked})}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </section>
          </div>

          <button className="save-settings-btn" onClick={handleSave}>
            <Save size={20} />
            Save Settings
          </button>
        </div>
      </main>
    </div>
  );
}
