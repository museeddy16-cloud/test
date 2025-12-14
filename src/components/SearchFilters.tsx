import { useState } from 'react';
import { Search, SlidersHorizontal, X, MapPin, Calendar, Users, DollarSign, Home } from 'lucide-react';

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
      <style>{`
        .search-filters {
          background: white;
          border-radius: 40px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
          border: 1px solid #ddd;
          padding: 8px;
        }
        .search-bar {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .search-section {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          flex: 1;
          border-right: 1px solid #eee;
        }
        .search-section:last-child {
          border-right: none;
        }
        .search-section input {
          border: none;
          outline: none;
          font-size: 14px;
          width: 100%;
          background: transparent;
        }
        .search-section input::placeholder {
          color: #717171;
        }
        .search-section label {
          font-size: 12px;
          font-weight: 600;
          color: #222;
          display: block;
          margin-bottom: 4px;
        }
        .search-section .input-wrapper {
          flex: 1;
        }
        .search-icon {
          color: #717171;
        }
        .btn-search {
          background: #FF5A5F;
          color: white;
          border: none;
          padding: 14px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .btn-search:hover {
          background: #e04a4f;
        }
        .btn-filters {
          background: white;
          border: 1px solid #ddd;
          padding: 12px 16px;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          position: relative;
        }
        .btn-filters:hover {
          border-color: #222;
        }
        .filter-badge {
          background: #FF5A5F;
          color: white;
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 10px;
          position: absolute;
          top: -4px;
          right: -4px;
        }
        .advanced-filters {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .filters-panel {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
        }
        .filters-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #eee;
        }
        .filters-header h2 {
          margin: 0;
          font-size: 18px;
        }
        .btn-close {
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
          border-radius: 50%;
        }
        .btn-close:hover {
          background: #f7f7f7;
        }
        .filters-body {
          padding: 24px;
        }
        .filter-group {
          margin-bottom: 24px;
        }
        .filter-group h3 {
          font-size: 16px;
          margin: 0 0 16px 0;
        }
        .filter-group label {
          display: block;
          font-size: 14px;
          color: #717171;
          margin-bottom: 8px;
        }
        .price-range {
          display: flex;
          gap: 16px;
        }
        .price-input {
          flex: 1;
          position: relative;
        }
        .price-input span {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #717171;
        }
        .price-input input {
          width: 100%;
          padding: 12px 12px 12px 28px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
        }
        .counter {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 0;
          border-bottom: 1px solid #eee;
        }
        .counter-label span:first-child {
          display: block;
          font-weight: 500;
        }
        .counter-label span:last-child {
          font-size: 14px;
          color: #717171;
        }
        .counter-controls {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .counter-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid #ddd;
          background: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }
        .counter-btn:hover:not(:disabled) {
          border-color: #222;
        }
        .counter-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .amenities-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        .amenity-checkbox {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }
        .amenity-checkbox input {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }
        .filters-footer {
          display: flex;
          justify-content: space-between;
          padding: 20px 24px;
          border-top: 1px solid #eee;
        }
        .btn-clear {
          background: none;
          border: none;
          font-size: 14px;
          text-decoration: underline;
          cursor: pointer;
        }
        .btn-apply {
          background: #222;
          color: white;
          border: none;
          padding: 14px 28px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }
        .btn-apply:hover {
          background: #000;
        }
        @media (max-width: 768px) {
          .search-bar {
            flex-direction: column;
          }
          .search-section {
            border-right: none;
            border-bottom: 1px solid #eee;
            width: 100%;
          }
        }
      `}</style>

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
