import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, MapPin, Map } from 'lucide-react';
import { getApiUrl } from '../config/api';
import PropertyCard from '../components/PropertyCard';
import './Listings.css';

const properties = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
    title: 'Modern Beach House',
    location: 'Malibu, California',
    distance: '2,500 kilometers away',
    dates: 'Nov 15-20',
    price: 450,
    rating: 4.92,
    isSuperhost: true,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    title: 'Luxury City Apartment',
    location: 'New York, USA',
    distance: '1,200 kilometers away',
    dates: 'Dec 1-6',
    price: 320,
    rating: 4.88,
    isSuperhost: false,
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800',
    title: 'Cozy Mountain Cabin',
    location: 'Aspen, Colorado',
    distance: '3,100 kilometers away',
    dates: 'Dec 10-15',
    price: 280,
    rating: 4.95,
    isSuperhost: true,
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    title: 'Countryside Villa',
    location: 'Tuscany, Italy',
    distance: '8,500 kilometers away',
    dates: 'Jan 5-12',
    price: 520,
    rating: 4.91,
    isSuperhost: true,
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    title: 'Beachfront Paradise',
    location: 'Bali, Indonesia',
    distance: '12,000 kilometers away',
    dates: 'Nov 25-Dec 2',
    price: 180,
    rating: 4.87,
    isSuperhost: false,
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800',
    title: 'Historic Castle Stay',
    location: 'Edinburgh, Scotland',
    distance: '6,800 kilometers away',
    dates: 'Dec 20-27',
    price: 890,
    rating: 4.96,
    isSuperhost: true,
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
    title: 'Modern Lake House',
    location: 'Lake Como, Italy',
    distance: '8,200 kilometers away',
    dates: 'Jan 15-22',
    price: 650,
    rating: 4.93,
    isSuperhost: true,
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
    title: 'Tropical Resort Villa',
    location: 'Phuket, Thailand',
    distance: '9,500 kilometers away',
    dates: 'Feb 1-8',
    price: 220,
    rating: 4.89,
    isSuperhost: false,
  },
  {
    id: 9,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
    title: 'Luxury Pool Villa',
    location: 'Miami, Florida',
    distance: '1,800 kilometers away',
    dates: 'Feb 10-17',
    price: 580,
    rating: 4.94,
    isSuperhost: true,
  },
  {
    id: 10,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
    title: 'Oceanfront Mansion',
    location: 'Santorini, Greece',
    distance: '9,100 kilometers away',
    dates: 'Mar 1-8',
    price: 1200,
    rating: 4.98,
    isSuperhost: true,
  },
  {
    id: 11,
    image: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800',
    title: 'Minimalist Studio',
    location: 'Tokyo, Japan',
    distance: '10,500 kilometers away',
    dates: 'Feb 20-27',
    price: 150,
    rating: 4.85,
    isSuperhost: false,
  },
  {
    id: 12,
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800',
    title: 'Forest Retreat',
    location: 'Vancouver, Canada',
    distance: '4,200 kilometers away',
    dates: 'Mar 5-12',
    price: 340,
    rating: 4.90,
    isSuperhost: true,
  },
];

const filterOptions = [
  'Type of place',
  'Price',
  'Instant Book',
  'More filters'
];

export default function Listings() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('location') || '');
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, [searchParams, minPrice, maxPrice, typeFilter]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      let url = getApiUrl('/properties?status=ACTIVE');
      
      // Add search parameters
      const location = searchParams.get('location');
      const checkIn = searchParams.get('checkIn');
      const checkOut = searchParams.get('checkOut');
      const guests = searchParams.get('guests');
      
      if (location) url += `&location=${encodeURIComponent(location)}`;
      if (checkIn) url += `&checkIn=${encodeURIComponent(checkIn)}`;
      if (checkOut) url += `&checkOut=${encodeURIComponent(checkOut)}`;
      if (guests) url += `&guests=${encodeURIComponent(guests)}`;
      if (minPrice) url += `&minPrice=${encodeURIComponent(minPrice)}`;
      if (maxPrice) url += `&maxPrice=${encodeURIComponent(maxPrice)}`;
      if (typeFilter) url += `&type=${encodeURIComponent(typeFilter)}`;
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const propertyList = data.properties || data || [];
        if (Array.isArray(propertyList) && propertyList.length > 0) {
          const mapped = propertyList.map((p: any) => ({
            id: p.id,
            image: (p.images && p.images[0]) || p.imageCover || p.coverImage || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
            title: p.title || 'Untitled Property',
            location: p.location || (p.city && p.country ? `${p.city}, ${p.country}` : 'Location not specified'),
            distance: 'Available now',
            dates: 'Flexible dates',
            price: p.price || 0,
            rating: p.avgRating || 4.8 + Math.random() * 0.2,
            isSuperhost: p.featured || false,
          }));
          setProperties(mapped);
        }
      }
    } catch (error) {
      console.error('Failed to fetch properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = searchQuery 
    ? properties.filter(property =>
        property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : properties;

  return (
    <div className="listings-page">
      <div className="listings-header">
        <div className="container">
          <div className="listings-search">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search by location or property name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="listings-filters">
            <button 
              className="filter-btn"
              onClick={() => setTypeFilter(typeFilter ? '' : 'apartment')}
              style={{ backgroundColor: typeFilter ? '#222' : 'transparent', color: typeFilter ? '#fff' : '#000' }}
            >
              Type of place
            </button>
            
            <div style={{ position: 'relative' }}>
              <button 
                className="filter-btn"
                onClick={() => setShowPriceDropdown(!showPriceDropdown)}
                style={{ backgroundColor: minPrice || maxPrice ? '#222' : 'transparent', color: minPrice || maxPrice ? '#fff' : '#000' }}
              >
                💰 Price {minPrice || maxPrice ? `$${minPrice || '0'}-$${maxPrice || '∞'}` : 'Any'}
              </button>
              
              {showPriceDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  backgroundColor: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '16px',
                  minWidth: '300px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  zIndex: 10,
                  marginTop: '8px'
                }}>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '6px' }}>
                      Min Price
                    </label>
                    <input 
                      type="number" 
                      min="0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      placeholder="$0"
                      style={{ 
                        width: '100%', 
                        padding: '8px 12px', 
                        border: '1px solid #ddd', 
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '6px' }}>
                      Max Price
                    </label>
                    <input 
                      type="number" 
                      min="0"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="$10000"
                      style={{ 
                        width: '100%', 
                        padding: '8px 12px', 
                        border: '1px solid #ddd', 
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '8px',
                    borderTop: '1px solid #eee',
                    paddingTop: '12px'
                  }}>
                    <button 
                      onClick={() => { setMinPrice(''); setMaxPrice(''); setShowPriceDropdown(false); }}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#f7f7f7',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    >
                      Clear
                    </button>
                    <button 
                      onClick={() => setShowPriceDropdown(false)}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#222',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <button className="filter-btn">
              ⚡ Instant Book
            </button>
            <button 
              className="filter-btn filter-btn-icon"
              onClick={() => setShowMoreFilters(!showMoreFilters)}
            >
              <SlidersHorizontal size={16} />
              More filters
            </button>
          </div>

          {showMoreFilters && (
            <div className="more-filters-panel" style={{
              padding: '20px',
              backgroundColor: '#f7f7f7',
              borderRadius: '8px',
              marginTop: '10px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px'
            }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Bedrooms</label>
                <input type="number" min="1" placeholder="Min bedrooms" style={{ width: '100%', padding: '8px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Bathrooms</label>
                <input type="number" min="1" placeholder="Min bathrooms" style={{ width: '100%', padding: '8px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Property Type</label>
                <select style={{ width: '100%', padding: '8px' }}>
                  <option>All types</option>
                  <option>House</option>
                  <option>Apartment</option>
                  <option>Villa</option>
                  <option>Cabin</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Amenities</label>
                <select style={{ width: '100%', padding: '8px' }}>
                  <option>Any</option>
                  <option>WiFi</option>
                  <option>Pool</option>
                  <option>Kitchen</option>
                  <option>AC</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="listings-content">
        <div className="container">
          <div className="listings-info">
            <div>
              <h1>Places to stay</h1>
              <p>{filteredProperties.length} stays found</p>
            </div>
            <button 
              className="map-toggle"
              onClick={() => setShowMap(!showMap)}
            >
              <Map size={18} />
              {showMap ? 'Show list' : 'Show map'}
            </button>
          </div>

          {showMap ? (
            <div className="map-view">
              <div className="map-placeholder">
                <MapPin size={48} />
                <p>Map view would be displayed here</p>
                <span>Interactive map with property locations</span>
              </div>
            </div>
          ) : (
            <div className="listings-grid">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
          )}

          {filteredProperties.length === 0 && (
            <div className="no-results">
              <Search size={48} />
              <h2>No places found</h2>
              <p>Try adjusting your search or filters to find more places.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
