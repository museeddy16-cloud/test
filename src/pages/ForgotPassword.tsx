import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '@assets/IRU_Voyage_1765463194437.png';
import './AuthForm.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/auth/request-password-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (res.ok) {
        setSubmitted(true);
        // Navigate to reset password page after 2 seconds
        setTimeout(() => {
          navigate('/reset-password', { state: { email } });
        }, 2000);
      } else {
        setError('Failed to send reset link. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section className="ftco-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 text-center mb-5">
              <h2 className="heading-section">Check Your Email</h2>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-7 col-lg-5">
              <div className="wrap">
                <div className="img" style={{
                  backgroundImage: "url('https://i.pinimg.com/736x/8c/b8/bf/8cb8bf2a7a3db0f6945422149dacadaf.jpg')",
                }}></div>
                <div className="login-wrap p-4 p-md-5">
                  <div style={{textAlign: 'center', paddingTop: '1rem'}}>
                    <div style={{fontSize: '48px', marginBottom: '1rem'}}>✓</div>
                    <h3 className="mb-4" style={{marginBottom: '1rem'}}>Password Reset Sent</h3>
                    <p style={{color: '#666', marginBottom: '1.5rem', fontSize: '14px'}}>
                      We've sent a password reset link to <strong>{email}</strong>. 
                      Please check your email and click the link to reset your password.
                    </p>
                    <Link to="/login" className="form-control btn btn-primary rounded submit px-3" style={{width: '100%', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      Back to Sign In
                    </Link>
                  </div>
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
          <div className="col-md-6 text-center mb-5">
            <h2 className="heading-section">Forgot Password</h2>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-5">
            <div className="wrap">
              <div className="img" style={{
                backgroundImage: "url('https://i.pinimg.com/736x/5c/7d/19/5c7d1937cbf42639001556099aec7d5f.jpg')",
              }}></div>
              <div className="login-wrap p-4 p-md-5">
                <div>
                    <Link to="/" style={{display: 'block', marginBottom: '1rem'}}>
                      <img src={logo} alt="IRU Voyage" style={{height: '70px', objectFit: 'contain', cursor: 'pointer'}} />
                    </Link>
                  <h3 className="mb-4">Reset Password</h3>
                </div>

                <form className="signin-form" onSubmit={handleSubmit}>
                  {error && <div className="alert alert-danger">{error}</div>}

                  <p style={{color: '#666', fontSize: '14px', marginBottom: '1.5rem'}}>
                    Enter your email address and we'll send you a link to reset your password.
                  </p>

                  <div className="form-group mt-3">
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <label className="form-control-placeholder">Email Address</label>
                  </div>

                  <div className="form-group">
                    <button
                      type="submit"
                      className="form-control btn btn-primary rounded submit px-3"
                      disabled={loading}
                    >
                      {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                  </div>
                </form>

                <p className="text-center">
                  Remember your password? <Link to="/login">Sign</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
