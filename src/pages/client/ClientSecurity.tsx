import { useState } from 'react';
import { 
  Lock, 
  Shield, 
  Smartphone, 
  Globe, 
  AlertTriangle,
  Check,
  Eye,
  EyeOff
} from 'lucide-react';
import { usePost } from '../../hooks/useDashboard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function ClientSecurity() {
  const { post, loading } = usePost();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters.' });
      return;
    }

    const result = await post('/client/change-password', {
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });

    if (result) {
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      setMessage({ type: 'error', text: 'Failed to change password. Check your current password.' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="client-security">
      <div className="page-header">
        <h1>Security</h1>
        <p>Manage your account security settings</p>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.type === 'success' ? <Check size={18} /> : <AlertTriangle size={18} />}
          {message.text}
        </div>
      )}

      <div className="security-sections">
        <div className="security-card">
          <div className="card-header">
            <Lock size={24} />
            <div>
              <h3>Change Password</h3>
              <p>Update your password regularly for better security</p>
            </div>
          </div>
          <form onSubmit={handleSubmitPassword} className="password-form">
            <div className="form-group">
              <label>Current Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
                <button 
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                required
                minLength={8}
              />
              <span className="helper-text">Minimum 8 characters</span>
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading === 'loading'}
            >
              {loading === 'loading' ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        <div className="security-card">
          <div className="card-header">
            <Shield size={24} />
            <div>
              <h3>Two-Factor Authentication</h3>
              <p>Add an extra layer of security to your account</p>
            </div>
          </div>
          <div className="card-content">
            <div className="two-factor-status">
              <span className="status-badge disabled">Not Enabled</span>
            </div>
            <p>Two-factor authentication adds an additional layer of security by requiring a code from your phone in addition to your password.</p>
            <button className="btn btn-secondary">
              <Smartphone size={18} />
              Enable 2FA
            </button>
          </div>
        </div>

        <div className="security-card">
          <div className="card-header">
            <Globe size={24} />
            <div>
              <h3>Active Sessions</h3>
              <p>Manage devices where you're currently logged in</p>
            </div>
          </div>
          <div className="card-content">
            <div className="sessions-list">
              <div className="session-item current">
                <div className="session-info">
                  <Globe size={20} />
                  <div>
                    <h4>Current Session</h4>
                    <p>Browser - {navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Browser'}</p>
                  </div>
                </div>
                <span className="session-badge active">Active Now</span>
              </div>
            </div>
            <button className="btn btn-danger btn-sm">
              Sign Out All Other Devices
            </button>
          </div>
        </div>

        <div className="security-card danger-zone">
          <div className="card-header">
            <AlertTriangle size={24} />
            <div>
              <h3>Danger Zone</h3>
              <p>Irreversible account actions</p>
            </div>
          </div>
          <div className="card-content">
            <div className="danger-action">
              <div>
                <h4>Deactivate Account</h4>
                <p>Temporarily disable your account. You can reactivate it later.</p>
              </div>
              <button className="btn btn-secondary btn-sm">Deactivate</button>
            </div>
            <div className="danger-action">
              <div>
                <h4>Delete Account</h4>
                <p>Permanently delete your account and all associated data.</p>
              </div>
              <button className="btn btn-danger btn-sm">Delete Account</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
