import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X, MapPin } from 'lucide-react';
import { getApiUrl } from '../config/api';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';
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

      navigate('/dashboard/listings');
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
              <label>Property Title *</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} required placeholder="e.g., Cozy Apartment in City Center" />
              <small style={{ color: '#666', fontSize: '12px' }}>{form.title.length}/150</small>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>Property Type *</label>
                <select name="propertyType" value={form.propertyType} onChange={handleChange}>
                  <option value="APARTMENT">Apartment</option>
                  <option value="HOUSE">House</option>
                  <option value="VILLA">Villa</option>
                  <option value="HOTEL">Hotel</option>
                  <option value="ROOM">Room</option>
                </select>
              </div>
              <div className="form-group">
                <label>Listing Category *</label>
                <select name="listingCategory" value={form.listingCategory} onChange={handleChange}>
                  <option value="ENTIRE_PLACE">Entire Place</option>
                  <option value="PRIVATE_ROOM">Private Room</option>
                  <option value="SHARED_ROOM">Shared Room</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Short Headline</label>
              <input type="text" name="headline" value={form.headline} onChange={handleChange} placeholder="Brief description for listing preview" />
            </div>
          </div>
        );
      case 'location':
        return (
          <div className="form-section">
            <h2>Location Details</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>Country *</label>
                <input type="text" name="country" value={form.country} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>City *</label>
                <input type="text" name="city" value={form.city} onChange={handleChange} required />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>Area / Neighborhood</label>
                <input type="text" name="area" value={form.area} onChange={handleChange} placeholder="e.g., Downtown" />
              </div>
              <div className="form-group">
                <label>Street Address</label>
                <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="Optional" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>Latitude</label>
                <input type="number" name="latitude" value={form.latitude || ''} onChange={handleChange} step="0.0001" placeholder="e.g., -1.9466" />
              </div>
              <div className="form-group">
                <label>Longitude</label>
                <input type="number" name="longitude" value={form.longitude || ''} onChange={handleChange} step="0.0001" placeholder="e.g., 29.8739" />
              </div>
            </div>
          </div>
        );
      case 'images':
        return (
          <div className="form-section">
            <h2>Images & Media</h2>
            <div className="form-group" style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>Property Images * (Required)</label>
              <div style={{ border: '2px dashed #ddd', borderRadius: '8px', padding: '30px', textAlign: 'center', cursor: 'pointer', backgroundColor: '#f9f9f9' }}>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} id="image-input" disabled={loading} />
                <label htmlFor="image-input" style={{ cursor: 'pointer', display: 'block' }}>
                  <p style={{ margin: '10px 0', color: '#666' }}>Click to upload images or drag and drop</p>
                  <p style={{ margin: '0', color: '#999', fontSize: '12px' }}>PNG, JPG, GIF up to 10MB (Max 10 images)</p>
                </label>
              </div>
              {imagePreview.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px', marginTop: '15px' }}>
                  {imagePreview.map((preview, index) => (
                    <div key={index} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden' }}>
                      <img src={preview} alt={`Preview ${index}`} style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
                      <button type="button" onClick={() => removeImage(index)} style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(255,0,0,0.7)', border: 'none', color: 'white', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' }}>
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>{imageFiles.length}/10 images</p>
            </div>
          </div>
        );
      case 'pricing':
        return (
          <div className="form-section">
            <h2>Pricing</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>Price per Night ($) *</label>
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>Weekly Discount (%)</label>
                <input type="number" name="weeklyDiscount" value={form.weeklyDiscount} onChange={handleChange} min="0" step="1" />
              </div>
              <div className="form-group">
                <label>Monthly Discount (%)</label>
                <input type="number" name="monthlyDiscount" value={form.monthlyDiscount} onChange={handleChange} min="0" step="1" />
              </div>
              <div className="form-group">
                <label>Cleaning Fee ($)</label>
                <input type="number" name="cleaningFee" value={form.cleaningFee} onChange={handleChange} min="0" step="0.01" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>Max Guests *</label>
                <input type="number" name="maxGuests" value={form.maxGuests} onChange={handleChange} required min="1" />
              </div>
              <div className="form-group">
                <label>Bedrooms *</label>
                <input type="number" name="bedrooms" value={form.bedrooms} onChange={handleChange} required min="0" />
              </div>
              <div className="form-group">
                <label>Beds *</label>
                <input type="number" name="beds" value={form.beds} onChange={handleChange} required min="1" />
              </div>
              <div className="form-group">
                <label>Bathrooms *</label>
                <input type="number" name="bathrooms" value={form.bathrooms} onChange={handleChange} required min="0" />
              </div>
            </div>
          </div>
        );
      case 'availability':
        return (
          <div className="form-section">
            <h2>Availability</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>Check-in Time</label>
                <input type="time" name="checkInTime" value={form.checkInTime} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Check-out Time</label>
                <input type="time" name="checkOutTime" value={form.checkOutTime} onChange={handleChange} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
              {AMENITIES.map(amenity => (
                <label key={amenity} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.amenities.includes(amenity)} onChange={() => handleAmenityToggle(amenity)} />
                  {amenity}
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
              <label>About This Place * (Max 2000 characters)</label>
              <textarea name="description" value={form.description} onChange={handleChange} required rows={5} placeholder="Describe your property..." />
              <small style={{ color: '#666', fontSize: '12px' }}>{form.description.length}/2000</small>
            </div>
            <div className="form-group">
              <label>The Space (Max 1000 characters)</label>
              <textarea name="space" value={form.space} onChange={handleChange} rows={4} placeholder="What guests can use..." />
              <small style={{ color: '#666', fontSize: '12px' }}>{form.space.length}/1000</small>
            </div>
            <div className="form-group">
              <label>Guest Access (Max 1000 characters)</label>
              <textarea name="guestAccess" value={form.guestAccess} onChange={handleChange} rows={4} placeholder="What areas are accessible..." />
              <small style={{ color: '#666', fontSize: '12px' }}>{form.guestAccess.length}/1000</small>
            </div>
            <div className="form-group">
              <label>Other Things to Note (Max 1000 characters)</label>
              <textarea name="otherNotes" value={form.otherNotes} onChange={handleChange} rows={4} placeholder="Additional information..." />
              <small style={{ color: '#666', fontSize: '12px' }}>{form.otherNotes.length}/1000</small>
            </div>
          </div>
        );
      case 'rules':
        return (
          <div className="form-section">
            <h2>House Rules</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.smokingAllowed} onChange={() => handleCheckbox('smokingAllowed')} />
                Smoking Allowed
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.petsAllowed} onChange={() => handleCheckbox('petsAllowed')} />
                Pets Allowed
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.partiesAllowed} onChange={() => handleCheckbox('partiesAllowed')} />
                Parties Allowed
              </label>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>Quiet Hours</label>
                <input type="text" name="quietHours" value={form.quietHours} onChange={handleChange} placeholder="e.g., 22:00-08:00" />
              </div>
              <div className="form-group">
                <label>Check-in Rules</label>
                <input type="text" name="checkInRules" value={form.checkInRules} onChange={handleChange} placeholder="Any specific rules..." />
              </div>
            </div>
          </div>
        );
      case 'safety':
        return (
          <div className="form-section">
            <h2>Safety & Property</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.smokeDetector} onChange={() => handleCheckbox('smokeDetector')} />
                Smoke Detector
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.fireExtinguisher} onChange={() => handleCheckbox('fireExtinguisher')} />
                Fire Extinguisher
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.firstAidKit} onChange={() => handleCheckbox('firstAidKit')} />
                First Aid Kit
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.securityCamera} onChange={() => handleCheckbox('securityCamera')} />
                Security Camera
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <button onClick={() => navigate('/dashboard/listings')} className="back-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: '10px' }}>
              <ArrowLeft size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Back to Listings
            </button>
            <h1>Create New Listing</h1>
            <p>Step {currentSection + 1} of {sections.length}</p>
          </div>
        </header>

        <div className="dashboard-content">
          {error && <div style={{ color: 'red', marginBottom: '15px', padding: '10px', backgroundColor: '#ffe0e0', borderRadius: '4px' }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ maxWidth: '900px', margin: '0 auto' }}>
            {/* Section Navigation */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '30px', overflowX: 'auto', paddingBottom: '10px' }}>
              {sections.map((section, idx) => (
                <button key={section.id} type="button" onClick={() => setCurrentSection(idx)} style={{
                  padding: '10px 16px',
                  borderRadius: '6px',
                  border: idx === currentSection ? '2px solid #6366f1' : '1px solid #ddd',
                  background: idx === currentSection ? '#e0e7ff' : 'white',
                  color: idx === currentSection ? '#6366f1' : '#666',
                  fontWeight: idx === currentSection ? '600' : '500',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s'
                }}>
                  {section.title}
                </button>
              ))}
            </div>

            {/* Current Section */}
            <FormSection id={sections[currentSection].id} />

            {/* Navigation Buttons */}
            <div style={{ marginTop: '40px', display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
              <button type="button" onClick={() => setCurrentSection(Math.max(0, currentSection - 1))} disabled={currentSection === 0} style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid #ddd', background: currentSection === 0 ? '#f0f0f0' : 'white', cursor: currentSection === 0 ? 'not-allowed' : 'pointer' }}>
                Previous
              </button>
              {currentSection === sections.length - 1 ? (
                <button type="submit" disabled={loading || imageFiles.length === 0} style={{ padding: '10px 30px', borderRadius: '6px', background: imageFiles.length === 0 ? '#ccc' : '#6366f1', color: 'white', border: 'none', cursor: imageFiles.length === 0 ? 'not-allowed' : 'pointer', fontWeight: '600' }}>
                  {loading ? 'Creating...' : 'Create Listing'}
                </button>
              ) : (
                <button type="button" onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))} style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}>
                  Next
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
