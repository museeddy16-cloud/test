import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X, MapPin, Upload, CheckCircle } from 'lucide-react';
import { getApiUrl } from '../config/api';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';
import './CreateListing.css';
import Sidebar from '../components/Sidebar';

interface ListingForm {
  // Basic Info
  title: string;
  propertyType: string;
  listingCategory: string;
  headline: string;
  
  // Location
  country: string;
  city: string;
  area: string;
  location: string;
  latitude?: number;
  longitude?: number;
  
  // Pricing
  price: number;
  weeklyDiscount: number;
  monthlyDiscount: number;
  cleaningFee: number;
  serviceFee: number;
  taxes: number;
  currency: string;
  
  // Capacity
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  
  // Availability
  checkInTime: string;
  checkOutTime: string;
  minNights: number;
  maxNights: number;
  
  // Amenities
  amenities: string[];
  
  // Descriptions
  description: string;
  space: string;
  guestAccess: string;
  otherNotes: string;
  
  // House Rules
  smokingAllowed: boolean;
  petsAllowed: boolean;
  partiesAllowed: boolean;
  quietHours: string;
  checkInRules: string;
  
  // Safety
  smokeDetector: boolean;
  fireExtinguisher: boolean;
  firstAidKit: boolean;
  securityCamera: boolean;
}

const AMENITIES = [
  'Wi-Fi', 'TV', 'Air Conditioning', 'Kitchen', 'Washing Machine',
  'Free Parking', 'Hot Water', 'Workspace', 'Pool', 'Gym',
  'Heating', 'Dryer', 'Dishwasher', 'Microwave', 'Oven',
  'Refrigerator', 'Freezer', 'Stove', 'Coffee Maker', 'Toaster'
];

export default function CreateListing() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<ListingForm>({
    title: '',
    propertyType: 'APARTMENT',
    listingCategory: 'ENTIRE_PLACE',
    headline: '',
    country: 'Rwanda',
    city: 'Kigali',
    area: '',
    location: '',
    latitude: undefined,
    longitude: undefined,
    price: 0,
    weeklyDiscount: 0,
    monthlyDiscount: 0,
    cleaningFee: 0,
    serviceFee: 0,
    taxes: 0,
    currency: 'USD',
    maxGuests: 1,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    checkInTime: '15:00',
    checkOutTime: '11:00',
    minNights: 1,
    maxNights: 365,
    amenities: [],
    description: '',
    space: '',
    guestAccess: '',
    otherNotes: '',
    smokingAllowed: false,
    petsAllowed: false,
    partiesAllowed: false,
    quietHours: '22:00-08:00',
    checkInRules: '',
    smokeDetector: true,
    fireExtinguisher: true,
    firstAidKit: true,
    securityCamera: false,
  });

  const sections = [
    { title: 'Basic Info', id: 'basic' },
    { title: 'Location', id: 'location' },
    { title: 'Images', id: 'images' },
    { title: 'Pricing', id: 'pricing' },
    { title: 'Capacity', id: 'capacity' },
    { title: 'Availability', id: 'availability' },
    { title: 'Amenities', id: 'amenities' },
    { title: 'Description', id: 'description' },
    { title: 'House Rules', id: 'rules' },
    { title: 'Safety', id: 'safety' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Number fields that should be parsed as floats
    const numberFields = ['price', 'weeklyDiscount', 'monthlyDiscount', 'cleaningFee', 'serviceFee', 'taxes', 'maxGuests', 'bedrooms', 'beds', 'bathrooms', 'minNights', 'maxNights', 'latitude', 'longitude'];
    
    setForm(prev => ({
      ...prev,
      [name]: numberFields.includes(name) ? parseFloat(value) || 0 : value
    }));
  };

  const handleCheckbox = (name: string) => {
    setForm(prev => ({
      ...prev,
      [name]: !prev[name as keyof ListingForm]
    }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (imageFiles.length + files.length > 10) {
      setError('Maximum 10 images allowed');
      return;
    }

    const newFiles = [...imageFiles, ...files];
    setImageFiles(newFiles);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreview([...imagePreview, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(imagePreview[index]);
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (imageFiles.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    setLoading(true);

    try {
      const uploadedImages: string[] = [];
      
      if (imageFiles.length > 0) {
        const formData = new FormData();
        imageFiles.forEach((file) => {
          formData.append('photos', file);
        });

        const uploadRes = await fetch(getApiUrl('/upload/multiple'), {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        });

        if (!uploadRes.ok) {
          throw new Error('Failed to upload images');
        }

        const uploadData = await uploadRes.json();
        if (Array.isArray(uploadData.data)) {
          uploadedImages.push(...uploadData.data.map((item: any) => item.url));
        } else if (uploadData.urls) {
          uploadedImages.push(...uploadData.urls);
        }
      }

      const listingData = {
        ...form,
        images: uploadedImages
      };

      const res = await fetch(getApiUrl('/listings'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(listingData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create listing');
      }

      navigate('/host/listings');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const FormSection = ({ id }: { id: string }) => {
    switch (id) {
      case 'basic':
        return (
          <div className="form-section">
            <h2>Property Basic Info</h2>
            <div className="form-group">
              <label>Property Title <span className="required">*</span></label>
              <input 
                type="text" 
                name="title" 
                value={form.title} 
                onChange={handleChange} 
                required 
                placeholder="e.g., Cozy Apartment in City Center" 
                maxLength={150}
              />
              <small>{form.title.length}/150 characters</small>
            </div>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Property Type <span className="required">*</span></label>
                <select name="propertyType" value={form.propertyType} onChange={handleChange}>
                  <option value="APARTMENT">Apartment</option>
                  <option value="HOUSE">House</option>
                  <option value="VILLA">Villa</option>
                  <option value="HOTEL">Hotel</option>
                  <option value="ROOM">Room</option>
                </select>
              </div>
              <div className="form-group">
                <label>Listing Category <span className="required">*</span></label>
                <select name="listingCategory" value={form.listingCategory} onChange={handleChange}>
                  <option value="ENTIRE_PLACE">Entire Place</option>
                  <option value="PRIVATE_ROOM">Private Room</option>
                  <option value="SHARED_ROOM">Shared Room</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Short Headline</label>
              <input 
                type="text" 
                name="headline" 
                value={form.headline} 
                onChange={handleChange} 
                placeholder="Brief description for listing preview" 
              />
            </div>
          </div>
        );
      case 'location':
        return (
          <div className="form-section">
            <h2>Location Details</h2>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Country <span className="required">*</span></label>
                <input type="text" name="country" value={form.country} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>City <span className="required">*</span></label>
                <input type="text" name="city" value={form.city} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Area / Neighborhood</label>
                <input type="text" name="area" value={form.area} onChange={handleChange} placeholder="e.g., Downtown" />
              </div>
              <div className="form-group">
                <label>Street Address</label>
                <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="Optional" />
              </div>
            </div>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Latitude</label>
                <input 
                  type="number" 
                  name="latitude" 
                  value={form.latitude || ''} 
                  onChange={handleChange} 
                  step="0.0001" 
                  placeholder="e.g., -1.9466" 
                />
              </div>
              <div className="form-group">
                <label>Longitude</label>
                <input 
                  type="number" 
                  name="longitude" 
                  value={form.longitude || ''} 
                  onChange={handleChange} 
                  step="0.0001" 
                  placeholder="e.g., 29.8739" 
                />
              </div>
            </div>
          </div>
        );
      case 'images':
        return (
          <div className="form-section">
            <h2>Images & Media</h2>
            <div className="form-group">
              <label>
                Property Images <span className="required">*</span>
              </label>
              <div 
                className="image-upload-wrapper"
                onDragOver={(e) => e.preventDefault()}
              >
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  id="image-input"
                  disabled={loading}
                />
                <label htmlFor="image-input">
                  <div className="image-upload-icon">📸</div>
                  <div className="image-upload-text">Click to upload or drag and drop</div>
                  <div className="image-upload-hint">PNG, JPG, GIF up to 10MB • Maximum 10 images</div>
                </label>
              </div>

              {imagePreview.length > 0 && (
                <div className="image-preview-grid">
                  {imagePreview.map((preview, index) => (
                    <div key={index} className="image-preview-item">
                      <img src={preview} alt={`Preview ${index + 1}`} />
                      <button 
                        type="button" 
                        className="remove-btn"
                        onClick={() => removeImage(index)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <small>
                {imageFiles.length}/10 images uploaded
              </small>
            </div>
          </div>
        );
      case 'pricing':
        return (
          <div className="form-section">
            <h2>Pricing</h2>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Price per Night ($) <span className="required">*</span></label>
                <input type="number" name="price" value={form.price} onChange={handleChange} required min="0" step="0.01" />
              </div>
              <div className="form-group">
                <label>Currency</label>
                <select name="currency" value={form.currency} onChange={handleChange}>
                  <option value="USD">USD</option>
                  <option value="RWF">RWF</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>
            <div className="form-grid-3">
              <div className="form-group">
                <label>Weekly Discount (%)</label>
                <input type="number" name="weeklyDiscount" value={form.weeklyDiscount} onChange={handleChange} min="0" max="100" step="1" />
              </div>
              <div className="form-group">
                <label>Monthly Discount (%)</label>
                <input type="number" name="monthlyDiscount" value={form.monthlyDiscount} onChange={handleChange} min="0" max="100" step="1" />
              </div>
              <div className="form-group">
                <label>Cleaning Fee ($)</label>
                <input type="number" name="cleaningFee" value={form.cleaningFee} onChange={handleChange} min="0" step="0.01" />
              </div>
            </div>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Service Fee ($)</label>
                <input type="number" name="serviceFee" value={form.serviceFee} onChange={handleChange} min="0" step="0.01" />
              </div>
              <div className="form-group">
                <label>Taxes ($)</label>
                <input type="number" name="taxes" value={form.taxes} onChange={handleChange} min="0" step="0.01" />
              </div>
            </div>
          </div>
        );
      case 'capacity':
        return (
          <div className="form-section">
            <h2>Guests & Capacity</h2>
            <div className="form-grid-4">
              <div className="form-group">
                <label>Max Guests <span className="required">*</span></label>
                <input type="number" name="maxGuests" value={form.maxGuests} onChange={handleChange} required min="1" />
              </div>
              <div className="form-group">
                <label>Bedrooms <span className="required">*</span></label>
                <input type="number" name="bedrooms" value={form.bedrooms} onChange={handleChange} required min="0" />
              </div>
              <div className="form-group">
                <label>Beds <span className="required">*</span></label>
                <input type="number" name="beds" value={form.beds} onChange={handleChange} required min="1" />
              </div>
              <div className="form-group">
                <label>Bathrooms <span className="required">*</span></label>
                <input type="number" name="bathrooms" value={form.bathrooms} onChange={handleChange} required min="0" />
              </div>
            </div>
          </div>
        );
      case 'availability':
        return (
          <div className="form-section">
            <h2>Availability</h2>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Check-in Time</label>
                <input type="time" name="checkInTime" value={form.checkInTime} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Check-out Time</label>
                <input type="time" name="checkOutTime" value={form.checkOutTime} onChange={handleChange} />
              </div>
            </div>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Minimum Nights</label>
                <input type="number" name="minNights" value={form.minNights} onChange={handleChange} min="1" />
              </div>
              <div className="form-group">
                <label>Maximum Nights</label>
                <input type="number" name="maxNights" value={form.maxNights} onChange={handleChange} min="1" />
              </div>
            </div>
          </div>
        );
      case 'amenities':
        return (
          <div className="form-section">
            <h2>Amenities</h2>
            <div className="amenity-grid">
              {AMENITIES.map(amenity => (
                <label key={amenity} className="amenity-item">
                  <input 
                    type="checkbox" 
                    checked={form.amenities.includes(amenity)} 
                    onChange={() => handleAmenityToggle(amenity)} 
                  />
                  <span>{amenity}</span>
                </label>
              ))}
            </div>
          </div>
        );
      case 'description':
        return (
          <div className="form-section">
            <h2>Description</h2>
            <div className="form-group">
              <label>About This Place <span className="required">*</span> (Max 2000 characters)</label>
              <textarea 
                name="description" 
                value={form.description} 
                onChange={handleChange} 
                required 
                placeholder="Describe your property, its features, and what makes it special..." 
                maxLength={2000}
              />
              <small>{form.description.length}/2000 characters</small>
            </div>
            <div className="form-group">
              <label>The Space (Max 1000 characters)</label>
              <textarea 
                name="space" 
                value={form.space} 
                onChange={handleChange} 
                placeholder="What areas and amenities can guests access?" 
                maxLength={1000}
              />
              <small>{form.space.length}/1000 characters</small>
            </div>
            <div className="form-group">
              <label>Guest Access (Max 1000 characters)</label>
              <textarea 
                name="guestAccess" 
                value={form.guestAccess} 
                onChange={handleChange} 
                placeholder="What specific areas are available for guests?" 
                maxLength={1000}
              />
              <small>{form.guestAccess.length}/1000 characters</small>
            </div>
            <div className="form-group">
              <label>Other Things to Note (Max 1000 characters)</label>
              <textarea 
                name="otherNotes" 
                value={form.otherNotes} 
                onChange={handleChange} 
                placeholder="Any additional important information for guests..." 
                maxLength={1000}
              />
              <small>{form.otherNotes.length}/1000 characters</small>
            </div>
          </div>
        );
      case 'rules':
        return (
          <div className="form-section">
            <h2>House Rules</h2>
            <div className="checkbox-group">
              <label>
                <input 
                  type="checkbox" 
                  checked={form.smokingAllowed} 
                  onChange={() => handleCheckbox('smokingAllowed')} 
                />
                <span>Smoking Allowed</span>
              </label>
              <label>
                <input 
                  type="checkbox" 
                  checked={form.petsAllowed} 
                  onChange={() => handleCheckbox('petsAllowed')} 
                />
                <span>Pets Allowed</span>
              </label>
              <label>
                <input 
                  type="checkbox" 
                  checked={form.partiesAllowed} 
                  onChange={() => handleCheckbox('partiesAllowed')} 
                />
                <span>Parties Allowed</span>
              </label>
            </div>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Quiet Hours</label>
                <input 
                  type="text" 
                  name="quietHours" 
                  value={form.quietHours} 
                  onChange={handleChange} 
                  placeholder="e.g., 22:00-08:00" 
                />
              </div>
              <div className="form-group">
                <label>Check-in Rules</label>
                <input 
                  type="text" 
                  name="checkInRules" 
                  value={form.checkInRules} 
                  onChange={handleChange} 
                  placeholder="e.g., Front desk available" 
                />
              </div>
            </div>
          </div>
        );
      case 'safety':
        return (
          <div className="form-section">
            <h2>Safety & Property</h2>
            <div className="checkbox-group">
              <label>
                <input 
                  type="checkbox" 
                  checked={form.smokeDetector} 
                  onChange={() => handleCheckbox('smokeDetector')} 
                />
                <span>Smoke Detector</span>
              </label>
              <label>
                <input 
                  type="checkbox" 
                  checked={form.fireExtinguisher} 
                  onChange={() => handleCheckbox('fireExtinguisher')} 
                />
                <span>Fire Extinguisher</span>
              </label>
              <label>
                <input 
                  type="checkbox" 
                  checked={form.firstAidKit} 
                  onChange={() => handleCheckbox('firstAidKit')} 
                />
                <span>First Aid Kit</span>
              </label>
              <label>
                <input 
                  type="checkbox" 
                  checked={form.securityCamera} 
                  onChange={() => handleCheckbox('securityCamera')} 
                />
                <span>Security Camera</span>
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="create-listing-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="create-listing-main">
        {/* Header */}
        <header className="create-listing-header">
          <button 
            onClick={() => navigate('/host/listings')} 
            className="back-btn"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <div className="header-content">
            <h1>Create New Listing</h1>
            <p>Complete all steps to list your property</p>
          </div>
        </header>

        {/* Progress Bar */}
        <section className="progress-section">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
            ></div>
          </div>
          <div className="progress-text">
            Step {currentSection + 1} of {sections.length} - {sections[currentSection].title}
          </div>
        </section>

        {/* Error Alert */}
        {error && (
          <div className="alert-error">
            {error}
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit}>
          {/* Section Navigation Tabs */}
          <div className="section-nav">
            {sections.map((section, idx) => (
              <button 
                key={section.id} 
                type="button" 
                onClick={() => setCurrentSection(idx)}
                className={`${idx === currentSection ? 'active' : ''} ${idx < currentSection ? 'completed' : ''}`}
              >
                {section.title}
              </button>
            ))}
          </div>

          {/* Form Wrapper */}
          <div className="form-wrapper">
            {/* Current Section Content */}
            <FormSection id={sections[currentSection].id} />

            {/* Navigation Buttons */}
            <div className="form-navigation">
              <button 
                type="button" 
                onClick={() => setCurrentSection(Math.max(0, currentSection - 1))} 
                disabled={currentSection === 0}
                className="form-nav-btn"
              >
                <ArrowLeft size={16} />
                Previous
              </button>

              {currentSection === sections.length - 1 ? (
                <button 
                  type="submit" 
                  disabled={loading || imageFiles.length === 0}
                  className="form-nav-btn submit"
                >
                  {loading ? (
                    <>
                      <span className="loading-spinner"></span>
                      Creating...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      Create Listing
                    </>
                  )}
                </button>
              ) : (
                <button 
                  type="button" 
                  onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
                  className="form-nav-btn"
                >
                  Next
                  <ArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />
                </button>
              )}
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
