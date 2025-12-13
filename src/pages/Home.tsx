import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, Compass, Mountain, Building, Waves, TreeDeciduous, Flame, Castle, Tent, Home as HomeIcon } from 'lucide-react';
import { getApiUrl } from '../config/api';
import PropertyCard from '../components/PropertyCard';
import './Home.css';

const categories = [
  { icon: Compass, label: 'Amazing views', type: 'all' },
  { icon: Mountain, label: 'Mountains', type: 'mountains' },
  { icon: Building, label: 'Cities', type: 'cities' },
  { icon: Waves, label: 'Beach', type: 'beach' },
  { icon: TreeDeciduous, label: 'Countryside', type: 'countryside' },
  { icon: Flame, label: 'Trending', type: 'trending' },
  { icon: Castle, label: 'Castles', type: 'castles' },
  { icon: Tent, label: 'Camping', type: 'camping' },
  { icon: HomeIcon, label: 'Cabins', type: 'cabins' },
];

const fallbackProperties = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
    title: 'Modern Beach House',
    location: 'Malibu, California',
    distance: '2,500 kilometers away',
    dates: 'Nov 15-20',
    price: 450,
    rating: 4.92,
    isSuperhost: true,
    category: 'beach',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    title: 'Luxury City Apartment',
    location: 'New York, USA',
    distance: '1,200 kilometers away',
    dates: 'Dec 1-6',
    price: 320,
    rating: 4.88,
    isSuperhost: false,
    category: 'cities',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800',
    title: 'Cozy Mountain Cabin',
    location: 'Aspen, Colorado',
    distance: '3,100 kilometers away',
    dates: 'Dec 10-15',
    price: 280,
    rating: 4.95,
    isSuperhost: true,
    category: 'mountains',
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    title: 'Countryside Villa',
    location: 'Tuscany, Italy',
    distance: '8,500 kilometers away',
    dates: 'Jan 5-12',
    price: 520,
    rating: 4.91,
    isSuperhost: true,
    category: 'countryside',
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    title: 'Beachfront Paradise',
    location: 'Bali, Indonesia',
    distance: '12,000 kilometers away',
    dates: 'Nov 25-Dec 2',
    price: 180,
    rating: 4.87,
    isSuperhost: false,
    category: 'beach',
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800',
    title: 'Historic Castle Stay',
    location: 'Edinburgh, Scotland',
    distance: '6,800 kilometers away',
    dates: 'Dec 20-27',
    price: 890,
    rating: 4.96,
    isSuperhost: true,
    category: 'castles',
  },
  {
    id: '7',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
    title: 'Modern Lake House',
    location: 'Lake Como, Italy',
    distance: '8,200 kilometers away',
    dates: 'Jan 15-22',
    price: 650,
    rating: 4.93,
    isSuperhost: true,
    category: 'camping',
  },
  {
    id: '8',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
    title: 'Tropical Resort Villa',
    location: 'Phuket, Thailand',
    distance: '9,500 kilometers away',
    dates: 'Feb 1-8',
    price: 220,
    rating: 4.89,
    isSuperhost: false,
    category: 'beach',
  },
];

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  city: string;
  country: string;
  images: string[];
  featured: boolean;
  host?: {
    firstName: string;
    lastName: string;
  };
  _count?: {
    reviews: number;
  };
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState('');
  const [searchCheckIn, setSearchCheckIn] = useState('');
  const [searchCheckOut, setSearchCheckOut] = useState('');
  const [searchGuests, setSearchGuests] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await fetch(getApiUrl('/properties?status=ACTIVE'));
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
            category: 'all',
          }));
          setProperties(mapped);
        } else {
          setProperties(fallbackProperties);
        }
      } else {
        setProperties(fallbackProperties);
      }
    } catch (error) {
      console.error('Failed to fetch properties:', error);
      setProperties(fallbackProperties);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchLocation) params.append('location', searchLocation);
    if (searchCheckIn) params.append('checkIn', searchCheckIn);
    if (searchCheckOut) params.append('checkOut', searchCheckOut);
    if (searchGuests) params.append('guests', searchGuests);
    navigate(`/listings?${params.toString()}`);
  };

  const filteredProperties = activeCategory === 0 
    ? properties 
    : properties.filter(prop => prop.category === categories[activeCategory].type);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Find your next adventure</h1>
          <p>Discover unique stays and experiences around the world</p>
          <div className="hero-search">
            <div className="hero-search-item">
              <MapPin size={20} />
              <div>
                <label>Where</label>
                <input 
                  type="text" 
                  placeholder="Search destinations" 
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>
            </div>
            <div className="hero-search-divider"></div>
            <div className="hero-search-item">
              <Calendar size={20} />
              <div>
                <label>Check in</label>
                <input 
                  type="date" 
                  value={searchCheckIn}
                  onChange={(e) => setSearchCheckIn(e.target.value)}
                />
              </div>
            </div>
            <div className="hero-search-divider"></div>
            <div className="hero-search-item">
              <Calendar size={20} />
              <div>
                <label>Check out</label>
                <input 
                  type="date" 
                  value={searchCheckOut}
                  onChange={(e) => setSearchCheckOut(e.target.value)}
                />
              </div>
            </div>
            <div className="hero-search-divider"></div>
            <div className="hero-search-item">
              <Users size={20} />
              <div>
                <label>Who</label>
                <input 
                  type="number" 
                  placeholder="Add guests" 
                  min="1"
                  value={searchGuests}
                  onChange={(e) => setSearchGuests(e.target.value)}
                />
              </div>
            </div>
            <button className="hero-search-btn" onClick={handleSearch}>
              <Search size={20} />
              <span>Search</span>
            </button>
          </div>
        </div>
      </section>

      <section className="categories">
        <div className="container">
          <div className="categories-scroll">
            {categories.map((cat, index) => (
              <button
                key={index}
                className={`category-item ${activeCategory === index ? 'active' : ''}`}
                onClick={() => setActiveCategory(index)}
              >
                <cat.icon size={24} />
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="listings-section">
        <div className="container">
          {loading ? (
            <div className="loading-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="property-skeleton">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-text"></div>
                  <div className="skeleton-text short"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="listings-grid">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
          )}
          {!loading && filteredProperties.length === 0 && (
            <div className="no-properties">
              <h3>No properties found</h3>
              <p>Try adjusting your search or explore all categories</p>
            </div>
          )}
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <h2>Become a Host</h2>
              <p>Earn extra income and unlock new opportunities by sharing your space.</p>
              <button className="btn btn-accent" onClick={() => navigate('/hosting')}>
                Learn more
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
