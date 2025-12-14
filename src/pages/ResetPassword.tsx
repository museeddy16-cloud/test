import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getApiUrl } from '../config/api';
import logo from '@assets/IRU_Voyage_1765463194437.png';
import './AuthForm.css';

export default function ResetPassword() {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  if (!email) {
    return (
      <section className="ftco-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-7 col-lg-5">
              <div className="wrap">
                <div className="img" style={{
                  backgroundImage: "url('https://i.pinimg.com/736x/5c/7d/19/5c7d1937cbf42639001556099aec7d5f.jpg')",
                }}></div>
                <div className="login-wrap p-4 p-md-5">
                  <div className="text-center">
                    <h3 className="mb-3">Invalid Access</h3>
                    <p>Please request a password reset first.</p>
                    <Link to="/forgot-password" className="btn btn-primary mt-3">Back to Reset</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp) {
      setError('Please enter the OTP from your email');
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(getApiUrl('/auth/reset-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to reset password');
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section className="ftco-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-7 col-lg-5">
              <div className="wrap">
                <div className="img" style={{
                  backgroundImage: "url('https://i.pinimg.com/736x/5c/7d/19/5c7d1937cbf42639001556099aec7d5f.jpg')",
                }}></div>
                <div className="login-wrap p-4 p-md-5 text-center">
                  <div style={{ marginBottom: '1rem' }}>
                    <Link to="/">
                      <img src={logo} alt="IRU Voyage" style={{height: '70px', objectFit: 'contain', cursor: 'pointer'}} />
                    </Link>
                  </div>
                  <div style={{ fontSize: '48px', color: '#122DBA', marginBottom: '1rem' }}>
                    ✓
                  </div>
                  <h3 className="mb-3">Password Reset!</h3>
                  <p className="mb-3">Your password has been successfully reset.</p>
                  <p className="text-muted mb-4">Redirecting to login...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="ftco-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-5">
            <div className="wrap">
              <div className="img" style={{
                backgroundImage: "url('https://i.pinimg.com/736x/5c/7d/19/5c7d1937cbf42639001556099aec7d5f.jpg')",
              }}></div>
              <div className="login-wrap p-4 p-md-5">
                <div className="d-flex">
                  <div className="w-100">
                    <Link to="/" style={{display: 'block', marginBottom: '1rem'}}>
                      <img src={logo} alt="IRU Voyage" style={{height: '70px', objectFit: 'contain', cursor: 'pointer'}} />
                    </Link>
                    <h3 className="mb-2">Reset Password</h3>
                    <p className="text-muted" style={{fontSize: '14px'}}>
                      We sent a reset code to<br/>
                      <strong>{email}</strong>
                    </p>
                  </div>
                </div>

                <form className="signin-form" onSubmit={handleReset}>
                  {error && <div className="alert alert-danger">{error}</div>}

                  <div className="form-group mt-3">
                    <input
                      type="text"
                      className="form-control"
                      name="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="000000"
                      required
                    />
                    <label className="form-control-placeholder">Reset Code</label>
                  </div>

                  <div className="form-group">
                    <input
                      id="password-field"
                      type={showPassword ? 'text' : 'password'}
                      className="form-control"
                      name="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <label className="form-control-placeholder">New Password</label>
                    <span
                      className={`fa fa-fw ${showPassword ? 'fa-eye-slash' : 'fa-eye'} field-icon toggle-password`}
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ cursor: 'pointer' }}
                    ></span>
                  </div>

                  <div className="form-group">
                    <input
                      id="confirm-password-field"
                      type={showConfirm ? 'text' : 'password'}
                      className="form-control"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <label className="form-control-placeholder">Confirm Password</label>
                    <span
                      className={`fa fa-fw ${showConfirm ? 'fa-eye-slash' : 'fa-eye'} field-icon toggle-password`}
                      onClick={() => setShowConfirm(!showConfirm)}
                      style={{ cursor: 'pointer' }}
                    ></span>
                  </div>

                  <div className="form-group">
                    <button
                      type="submit"
                      className="form-control btn btn-primary rounded submit px-3"
                      disabled={loading}
                    >
                      {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                  </div>
                </form>

                <p className="text-center">
                  <Link to="/login">Back to Sign In</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
