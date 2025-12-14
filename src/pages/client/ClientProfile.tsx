import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Camera, Check, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFetch, usePut } from '../../hooks/useDashboard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface ClientProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  bio?: string;
  address?: string;
  city?: string;
  country?: string;
  avatar?: string;
  dateOfBirth?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export default function ClientProfile() {
  const { user, updateUser } = useAuth();
  const { data: profile, loading, refetch } = useFetch<ClientProfile>('/client/profile');
  const { put, loading: saving } = usePut<Partial<ClientProfile>>();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<ClientProfile>>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await put('/client/profile', formData);
    if (result) {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      updateUser({ firstName: formData.firstName, lastName: formData.lastName });
      setIsEditing(false);
      refetch();
    } else {
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  if (loading === 'loading') {
    return <LoadingSpinner fullScreen message="Loading profile..." />;
  }

  return (
    <div className="client-profile">
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Manage your personal information</p>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.type === 'success' ? <Check size={18} /> : <X size={18} />}
          {message.text}
        </div>
      )}

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-header">
            <div className="avatar-section">
              <div className="avatar-large">
                {profile?.avatar ? (
                  <img src={profile.avatar} alt={profile.firstName} />
                ) : (
                  <span>{profile?.firstName?.charAt(0) || 'G'}</span>
                )}
                <button className="avatar-upload">
                  <Camera size={16} />
                </button>
              </div>
              <div className="avatar-info">
                <h2>{profile?.firstName} {profile?.lastName}</h2>
                <p>Member since {new Date().getFullYear()}</p>
              </div>
            </div>
            <button 
              className="btn btn-secondary"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth || ''}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city || ''}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country || ''}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio || ''}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Tell hosts a bit about yourself..."
                  />
                </div>
              </div>
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={saving === 'loading'}
                >
                  {saving === 'loading' ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-details">
              <div className="detail-item">
                <Mail size={18} />
                <span>{profile?.email}</span>
              </div>
              {profile?.phone && (
                <div className="detail-item">
                  <Phone size={18} />
                  <span>{profile.phone}</span>
                </div>
              )}
              {(profile?.city || profile?.country) && (
                <div className="detail-item">
                  <MapPin size={18} />
                  <span>{[profile.city, profile.country].filter(Boolean).join(', ')}</span>
                </div>
              )}
              {profile?.bio && (
                <div className="bio-section">
                  <h4>About</h4>
                  <p>{profile.bio}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
