import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getApiUrl } from '../config/api';
import logo from '@assets/IRU_Voyage_1765463194437.png';
import './AuthForm.css';

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { firstName, lastName, email, password, confirmPassword, agreeTerms } = formData;
    
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (!agreeTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await register({ firstName, lastName, email, password });
      
      // Send verification email
      const verifyResponse = await fetch(getApiUrl('/auth/send-verification-email'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!verifyResponse.ok) {
        throw new Error('Failed to send verification email');
      }

      // Navigate to email verification page
      navigate('/verify-email', { state: { email } });
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="ftco-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center mb-5">
            <h2 className="heading-section">Sign Up</h2>
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
                    <h3 className="mb-4">Sign Up</h3>
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
                      type="text"
                      className="form-control"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                    <label className="form-control-placeholder">First Name</label>
                  </div>

                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                    <label className="form-control-placeholder">Last Name</label>
                  </div>

                  <div className="form-group">
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <label className="form-control-placeholder">Email</label>
                  </div>

                  <div className="form-group">
                    <input
                      id="password-field"
                      type={showPassword ? 'text' : 'password'}
                      className="form-control"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
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
                    <input
                      id="confirm-password-field"
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="form-control"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <label className="form-control-placeholder">Confirm Password</label>
                    <span
                      className={`fa fa-fw ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} field-icon toggle-password`}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{ cursor: 'pointer' }}
                    ></span>
                  </div>

                  <div className="form-group">
                    <label className="checkbox-wrap checkbox-primary mb-0">
                      I Agree to the Terms
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleChange}
                      />
                      <span className="checkmark"></span>
                    </label>
                  </div>

                  <div className="form-group">
                    <button
                      type="submit"
                      className="form-control btn btn-primary rounded submit px-3"
                      disabled={loading}
                    >
                      {loading ? 'Creating account...' : 'Sign Up'}
                    </button>
                  </div>
                </form>

                <p className="text-center">
                  Already a member? <Link to="/login">Sign In</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
