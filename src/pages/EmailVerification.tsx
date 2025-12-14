import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import logo from '@assets/IRU_Voyage_1765463194437.png';
import './AuthForm.css';

export default function EmailVerification() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
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
                  backgroundImage: "url('https://i.pinimg.com/736x/8c/b8/bf/8cb8bf2a7a3db0f6945422149dacadaf.jpg')",
                }}></div>
                <div className="login-wrap p-4 p-md-5">
                  <div className="text-center">
                    <h3 className="mb-3">Invalid Access</h3>
                    <p>Please sign up first to verify your email.</p>
                    <Link to="/signup" className="btn btn-primary mt-3">Back to Sign Up</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        setError(data.message || 'Failed to verify email');
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

  const handleResendOTP = async () => {
    setResendLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/auth/resend-verification-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        setError(data.message || 'Failed to resend verification code');
        return;
      }

      setOtp('');
      setError('');
      alert('New verification code sent to your email!');
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setResendLoading(false);
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
                  backgroundImage: "url('https://i.pinimg.com/736x/8c/b8/bf/8cb8bf2a7a3db0f6945422149dacadaf.jpg')",
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
                  <h3 className="mb-3">Email Verified!</h3>
                  <p className="mb-3">Your email has been successfully verified.</p>
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
                    <h3 className="mb-2">Verify Email</h3>
                    <p className="text-muted" style={{fontSize: '14px'}}>
                      We sent a 6-digit code to<br/>
                      <strong>{email}</strong>
                    </p>
                  </div>
                </div>

                <form className="signin-form" onSubmit={handleVerifyOTP}>
                  {error && <div className="alert alert-danger">{error}</div>}

                  <div className="form-group mt-3">
                    <input
                      type="text"
                      className="form-control text-center"
                      name="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="000000"
                      maxLength={6}
                      required
                      style={{fontSize: '24px', letterSpacing: '10px', fontWeight: 'bold'}}
                    />
                    <label className="form-control-placeholder">Verification Code</label>
                  </div>

                  <div className="form-group">
                    <button
                      type="submit"
                      className="form-control btn btn-primary rounded submit px-3"
                      disabled={loading || otp.length !== 6}
                    >
                      {loading ? 'Verifying...' : 'Verify Code'}
                    </button>
                  </div>
                </form>

                <div className="text-center mt-4">
                  <p className="text-muted" style={{fontSize: '14px'}}>
                    Didn't receive a code?
                  </p>
                  <button
                    onClick={handleResendOTP}
                    disabled={resendLoading}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#122DBA',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      padding: 0
                    }}
                  >
                    {resendLoading ? 'Sending...' : 'Resend Code'}
                  </button>
                </div>

                <p className="text-center mt-3">
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
