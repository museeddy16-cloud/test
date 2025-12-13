import { useState } from 'react';
import { Menu, Save, Bell, Shield, Globe, Mail } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import './AdminDashboard.css';

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

      <style>{`
        .settings-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }
        
        .settings-section h2 {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 18px;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border-color);
        }
        
        .settings-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .settings-form .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .settings-form label {
          font-weight: 500;
          color: var(--text-dark);
        }
        
        .settings-form input,
        .settings-form select {
          padding: 12px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          font-size: 14px;
        }
        
        .toggle-group {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid var(--border-color);
        }
        
        .toggle-group label span {
          display: block;
          font-weight: 500;
        }
        
        .toggle-group label p {
          font-size: 13px;
          color: var(--text-light);
          margin-top: 4px;
        }
        
        .toggle {
          position: relative;
          width: 48px;
          height: 26px;
        }
        
        .toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        
        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.3s;
          border-radius: 26px;
        }
        
        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.3s;
          border-radius: 50%;
        }
        
        .toggle input:checked + .toggle-slider {
          background-color: var(--primary);
        }
        
        .toggle input:checked + .toggle-slider:before {
          transform: translateX(22px);
        }
        
        .save-settings-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          background: var(--primary);
          color: white;
          border-radius: 8px;
          font-weight: 600;
          margin-top: 24px;
        }
        
        .save-settings-btn:hover {
          background: var(--primary-dark);
        }
        
        @media (max-width: 768px) {
          .settings-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
