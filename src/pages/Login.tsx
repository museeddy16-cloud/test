import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '@assets/IRU_Voyage_1765463194437.png';
import './AuthForm.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await login(email, password);
      // Navigate based on user role
      if (user?.role === 'ADMIN') {
        navigate('/admin');
      } else if (user?.role === 'HOST') {
        navigate('/host');
      } else {
        navigate('/account');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="ftco-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center mb-5">
            <h2 className="heading-section">Sign In</h2>
          </div>
        </div>
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
                    <h3 className="mb-4">Sign In</h3>
                  </div>
                  <div className="w-100">
                    <p className="social-media d-flex justify-content-end">
                      <a href="#" className="social-icon d-flex align-items-center justify-content-center">
                        <span className="fa fa-facebook"></span>
                      </a>
                      <a href="#" className="social-icon d-flex align-items-center justify-content-center">
                        <span className="fa fa-twitter"></span>
                      </a>
                    </p>
                  </div>
                </div>

                <form className="signin-form" onSubmit={handleSubmit}>
                  {error && <div className="alert alert-danger">{error}</div>}

                  <div className="form-group mt-3">
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <label className="form-control-placeholder">Email</label>
                  </div>

                  <div className="form-group">
                    <input
                      id="password-field"
                      type={showPassword ? 'text' : 'password'}
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <label className="form-control-placeholder">Password</label>
                    <span
                      className={`fa fa-fw ${showPassword ? 'fa-eye-slash' : 'fa-eye'} field-icon toggle-password`}
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ cursor: 'pointer' }}
                    ></span>
                  </div>

                  <div className="form-group">
                    <button
                      type="submit"
                      className="form-control btn btn-primary rounded submit px-3"
                      disabled={loading}
                    >
                      {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                  </div>

                  <div className="form-group d-md-flex">
                    <div className="w-50 text-left">
                      <label className="checkbox-wrap checkbox-primary mb-0">
                        Remember
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <span className="checkmark"></span>
                      </label>
                    </div>
                    <div className="w-50 text-md-right">
                      <Link to="/forgot-password">Forgot Password</Link>
                    </div>
                  </div>
                </form>

                <p className="text-center">
                  Not a member? <Link to="/signup">Sign Up</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
