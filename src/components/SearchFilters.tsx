import { useState } from 'react';
import { Search, SlidersHorizontal, X, MapPin, Calendar, Users, DollarSign, Home } from 'lucide-react';
import '../styles/search-filters.css';

interface SearchFiltersProps {
  onSearch: (filters: SearchFilters) => void;
  initialFilters?: SearchFilters;
}

interface SearchFilters {
  search?: string;
  city?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
  amenities?: string[];
}

const propertyTypes = [
  'House', 'Apartment', 'Villa', 'Cabin', 'Cottage', 'Condo', 'Loft', 'Townhouse'
];

const amenitiesList = [
  'WiFi', 'Kitchen', 'Washer', 'Dryer', 'Air conditioning', 'Heating',
  'Pool', 'Hot tub', 'Free parking', 'EV charger', 'Gym', 'BBQ grill',
  'Fire pit', 'Indoor fireplace', 'Breakfast', 'Smoke alarm', 'First aid kit'
];

export default function SearchFilters({ onSearch, initialFilters = {} }: SearchFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);

  const handleChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleAmenityToggle = (amenity: string) => {
    const current = filters.amenities || [];
    const updated = current.includes(amenity)
      ? current.filter(a => a !== amenity)
      : [...current, amenity];
    handleChange('amenities', updated);
  };

  const handleSearch = () => {
    onSearch(filters);
    setShowAdvanced(false);
  };

  const handleClear = () => {
    setFilters({});
    onSearch({});
  };

  const activeFilterCount = Object.values(filters).filter(v => 
    v !== undefined && v !== '' && (Array.isArray(v) ? v.length > 0 : true)
  ).length;

  return (
    <div className="search-filters">
      <div className="search-bar">
        <div className="search-section">
          <MapPin size={20} className="search-icon" />
          <div className="input-wrapper">
            <label>Location</label>
            <input
              type="text"
              placeholder="Search destinations"
              value={filters.search || ''}
              onChange={(e) => handleChange('search', e.target.value)}
            />
          </div>
        </div>

        <div className="search-section">
          <Calendar size={20} className="search-icon" />
          <div className="input-wrapper">
            <label>Check in</label>
            <input
              type="date"
              value={filters.checkIn || ''}
              onChange={(e) => handleChange('checkIn', e.target.value)}
            />
          </div>
        </div>

        <div className="search-section">
          <Calendar size={20} className="search-icon" />
          <div className="input-wrapper">
            <label>Check out</label>
            <input
              type="date"
              value={filters.checkOut || ''}
              onChange={(e) => handleChange('checkOut', e.target.value)}
            />
          </div>
        </div>

        <div className="search-section">
          <Users size={20} className="search-icon" />
          <div className="input-wrapper">
            <label>Guests</label>
            <input
              type="number"
              placeholder="Add guests"
              min="1"
              value={filters.guests || ''}
              onChange={(e) => handleChange('guests', parseInt(e.target.value) || undefined)}
            />
          </div>
        </div>

        <button className="btn-search" onClick={handleSearch}>
          <Search size={20} />
        </button>

        <button className="btn-filters" onClick={() => setShowAdvanced(true)}>
          <SlidersHorizontal size={16} />
          Filters
          {activeFilterCount > 0 && (
            <span className="filter-badge">{activeFilterCount}</span>
          )}
        </button>
      </div>

      {showAdvanced && (
        <div className="advanced-filters" onClick={() => setShowAdvanced(false)}>
          <div className="filters-panel" onClick={(e) => e.stopPropagation()}>
            <div className="filters-header">
              <h2>Filters</h2>
              <button className="btn-close" onClick={() => setShowAdvanced(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="filters-body">
              <div className="filter-group">
                <h3>Price range</h3>
                <div className="price-range">
                  <div className="price-input">
                    <span>$</span>
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice || ''}
                      onChange={(e) => handleChange('minPrice', parseInt(e.target.value) || undefined)}
                    />
                  </div>
                  <div className="price-input">
                    <span>$</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice || ''}
                      onChange={(e) => handleChange('maxPrice', parseInt(e.target.value) || undefined)}
                    />
                  </div>
                </div>
              </div>

              <div className="filter-group">
                <h3>Rooms and beds</h3>
                <div className="counter">
                  <div className="counter-label">
                    <span>Bedrooms</span>
                  </div>
                  <div className="counter-controls">
                    <button
                      className="counter-btn"
                      onClick={() => handleChange('bedrooms', Math.max(0, (filters.bedrooms || 1) - 1))}
                      disabled={(filters.bedrooms || 1) <= 0}
                    >
                      -
                    </button>
                    <span>{filters.bedrooms || 'Any'}</span>
                    <button
                      className="counter-btn"
                      onClick={() => handleChange('bedrooms', (filters.bedrooms || 0) + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="counter">
                  <div className="counter-label">
                    <span>Bathrooms</span>
                  </div>
                  <div className="counter-controls">
                    <button
                      className="counter-btn"
                      onClick={() => handleChange('bathrooms', Math.max(0, (filters.bathrooms || 1) - 1))}
                      disabled={(filters.bathrooms || 1) <= 0}
                    >
                      -
                    </button>
                    <span>{filters.bathrooms || 'Any'}</span>
                    <button
                      className="counter-btn"
                      onClick={() => handleChange('bathrooms', (filters.bathrooms || 0) + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="filter-group">
                <h3>Amenities</h3>
                <div className="amenities-grid">
                  {amenitiesList.map(amenity => (
                    <label key={amenity} className="amenity-checkbox">
                      <input
                        type="checkbox"
                        checked={(filters.amenities || []).includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                      />
                      {amenity}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="filters-footer">
              <button className="btn-clear" onClick={handleClear}>
                Clear all
              </button>
              <button className="btn-apply" onClick={handleSearch}>
                Show results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
