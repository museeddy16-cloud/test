import { useState, useEffect } from 'react';
import { Camera, Save, Menu } from 'lucide-react';
import { getApiUrl } from '../config/api';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export default function DashboardProfile() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    avatar: ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(getApiUrl('/users/profile'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const updated = await res.json();
        updateUser(updated);
        setMessage('Profile updated successfully!');
      } else {
        setMessage('Failed to update profile');
      }
    } catch {
      setMessage('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="dashboard-main">
        <header className="dashboard-header">
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <div>
            <h1>My Profile</h1>
            <p>Manage your personal information</p>
          </div>
        </header>

        <div className="dashboard-content">
          <div className="profile-container">
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                {formData.avatar ? (
                  <img src={formData.avatar} alt="Avatar" />
                ) : (
                  <span>{formData.firstName?.charAt(0) || 'U'}</span>
                )}
                <button className="avatar-upload-btn">
                  <Camera size={20} />
                </button>
              </div>
              <div className="profile-avatar-info">
                <h2>{formData.firstName} {formData.lastName}</h2>
                <p>{user?.email}</p>
                <span className="role-badge">{user?.role}</span>
              </div>
            </div>

            <form className="profile-form" onSubmit={handleSubmit}>
              {message && (
                <div className={`form-message ${message.includes('success') ? 'success' : 'error'}`}>
                  {message}
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+250 xxx xxx xxx"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="disabled-input"
                />
                <span className="input-hint">Email cannot be changed</span>
              </div>

              <button type="submit" className="save-btn" disabled={saving}>
                <Save size={18} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </main>

      <style>{`
        .profile-container {
          max-width: 700px;
          margin: 0 auto;
        }
        
        .profile-avatar-section {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 32px;
          background: var(--bg-white);
          border-radius: 12px;
          margin-bottom: 24px;
          box-shadow: var(--shadow-sm);
        }
        
        .profile-avatar {
          position: relative;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        
        .profile-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .profile-avatar span {
          font-size: 36px;
          font-weight: 700;
          color: white;
        }
        
        .avatar-upload-btn {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--accent);
          color: var(--text-dark);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid white;
        }
        
        .profile-avatar-info h2 {
          font-size: 24px;
          margin-bottom: 4px;
        }
        
        .profile-avatar-info p {
          color: var(--text-light);
          margin-bottom: 8px;
        }
        
        .role-badge {
          display: inline-block;
          padding: 4px 12px;
          background: rgba(26, 59, 143, 0.1);
          color: var(--primary);
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .profile-form {
          background: var(--bg-white);
          border-radius: 12px;
          padding: 32px;
          box-shadow: var(--shadow-sm);
        }
        
        .form-message {
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        
        .form-message.success {
          background: #d4edda;
          color: #155724;
        }
        
        .form-message.error {
          background: #f8d7da;
          color: #721c24;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-group label {
          display: block;
          font-weight: 500;
          margin-bottom: 8px;
          color: var(--text-dark);
        }
        
        .form-group input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          font-size: 14px;
        }
        
        .form-group input:focus {
          border-color: var(--primary);
        }
        
        .disabled-input {
          background: var(--bg-light);
          color: var(--text-light);
        }
        
        .input-hint {
          display: block;
          font-size: 12px;
          color: var(--text-light);
          margin-top: 4px;
        }
        
        .save-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          background: var(--primary);
          color: white;
          border-radius: 8px;
          font-weight: 600;
          margin-top: 8px;
        }
        
        .save-btn:hover {
          background: var(--primary-dark);
        }
        
        .save-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        @media (max-width: 640px) {
          .profile-avatar-section {
            flex-direction: column;
            text-align: center;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
