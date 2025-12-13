import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Heart } from 'lucide-react';
import './Rwanda.css';

const rwandaHotels = [
  {
    id: 9,
    title: 'Kigali Luxury Mansion',
    location: 'Kigali, Rwanda',
    price: 350,
    rating: 4.88,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    description: 'Modern luxury mansion with stunning city views, infinity pool, and world-class amenities.',
    isSuperhost: true,
  },
  {
    id: 16,
    title: 'Nyungwe Forest Lodge',
    location: 'Nyungwe, Rwanda',
    price: 400,
    rating: 4.94,
    image: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&h=600&fit=crop',
    description: 'Rainforest lodge with canopy walks, primate tracking, and eco-tourism experiences.',
    isSuperhost: true,
  },
  {
    id: 15,
    title: 'Kigali Luxury Stay',
    location: 'Kigali, Rwanda',
    price: 270,
    rating: 4.89,
    image: 'https://i.pinimg.com/736x/7e/b6/a6/7eb6a6d97d0ac17d9a2e34e8365c0afe.jpg',
    description: 'Modern accommodation in Rwanda\'s capital city with access to Kigali\'s vibrant art scene, cultural villages, and the historic Genocide Memorial.',
    isSuperhost: false,
  },
  {
    id: 1,
    title: 'Volcanoes National Park Resort',
    location: 'Volcanoes, Rwanda',
    price: 480,
    rating: 4.95,
    image: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Volcanoes_National_Park_Rwanda.jpg',
    description: 'Luxury resort near volcanic mountains, perfect for gorilla trekking expeditions.',
    isSuperhost: true,
  },
  {
    id: 2,
    title: 'Lake Kivu Beachfront Villa',
    location: 'Lake Kivu, Rwanda',
    price: 320,
    rating: 4.91,
    image: 'https://i.pinimg.com/736x/4f/17/5c/4f175cd4e1b5e639080a22f8a4dab463.jpg',
    description: 'Stunning beachfront property with lake views and water activities.',
    isSuperhost: true,
  },
];

const placesToVisit = [
  {
    title: 'Volcanoes National Park',
    description: 'Home to endangered mountain gorillas. Experience the thrill of gorilla trekking in their natural habitat.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Volcanoes_National_Park_Rwanda.jpg',
    highlight: 'Gorilla Trekking',
  },
  {
    title: 'Lake Kivu',
    description: 'Scenic alpine lake with beautiful beaches, water sports, and island exploration opportunities.',
    image: 'https://i.pinimg.com/736x/4f/17/5c/4f175cd4e1b5e639080a22f8a4dab463.jpg',
    highlight: 'Water Activities',
  },
  {
    title: 'Nyungwe Forest',
    description: 'Dense rainforest with canopy walks, diverse wildlife, and over 250 tree species to discover.',
    image: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&h=600&fit=crop',
    highlight: 'Forest Canopy Walks',
  },
  {
    title: 'Akagera National Park',
    description: 'Large savanna reserve with Big Five wildlife viewing and scenic safari experiences.',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&h=600&fit=crop',
    highlight: 'Safari Experience',
  },
  {
    title: 'Kigali Genocide Memorial',
    description: 'Important historical site honoring victims. A moving tribute to resilience and remembrance.',
    image: 'https://i.pinimg.com/736x/9e/74/af/9e74afde0f6ca784899e0374edfc467f.jpg',
    highlight: 'Cultural Heritage',
  },
];

export default function VisitRwanda() {
  const navigate = useNavigate();

  return (
    <div className="rwanda-page">
      <div className="rwanda-hero">
        <div className="hero-overlay">
          <h1>Visit Rwanda - Land of a Thousand Hills</h1>
          <p>Discover the beauty, culture, and warmth of Rwanda</p>
        </div>
      </div>

      <section className="rwanda-intro">
        <div className="container">
          <h2>Welcome to Rwanda</h2>
          <p>
            Rwanda is a country of remarkable contrasts, from misty mountains and dense forests to pristine lakes and 
            vibrant cities. Known as the "Land of a Thousand Hills," Rwanda offers unforgettable experiences for travelers 
            seeking adventure, cultural immersion, and natural beauty.
          </p>
        </div>
      </section>

      <section className="top-hotels-section">
        <div className="container">
          <h2>Top 5 Hotels & Accommodations</h2>
          <p className="section-subtitle">Experience luxury and comfort in Rwanda's finest establishments</p>
          
          <div className="hotels-grid">
            {rwandaHotels.map((hotel) => (
              <div key={hotel.id} className="hotel-card">
                <div className="hotel-image-wrapper">
                  <img src={hotel.image} alt={hotel.title} className="hotel-image" />
                  {hotel.isSuperhost && <span className="superhost-badge">Superhost</span>}
                  <button className="wishlist-btn"><Heart size={20} /></button>
                </div>
                
                <div className="hotel-info">
                  <h3>{hotel.title}</h3>
                  
                  <div className="hotel-meta">
                    <div className="location">
                      <MapPin size={16} />
                      <span>{hotel.location}</span>
                    </div>
                    <div className="rating">
                      <Star size={16} fill="currentColor" />
                      <span>{hotel.rating}</span>
                    </div>
                  </div>
                  
                  <p className="hotel-description">{hotel.description}</p>
                  
                  <div className="hotel-footer">
                    <span className="price">${hotel.price}/night</span>
                    <button 
                      className="view-btn"
                      onClick={() => navigate(`/property/${hotel.id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="places-to-visit-section">
        <div className="container">
          <h2>Top 5 Places to Visit</h2>
          <p className="section-subtitle">Explore Rwanda's most iconic destinations and attractions</p>
          
          <div className="places-grid">
            {placesToVisit.map((place, idx) => (
              <div key={idx} className="place-card">
                <div className="place-image">
                  <img src={place.image} alt={place.title} />
                  <span className="highlight-tag">{place.highlight}</span>
                </div>
                
                <div className="place-content">
                  <h3>{place.title}</h3>
                  <p>{place.description}</p>
                  <button className="learn-more-btn">Learn More</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rwanda-highlights">
        <div className="container">
          <h2>Why Visit Rwanda?</h2>
          
          <div className="highlights-grid">
            <div className="highlight-item">
              <h3>🦍 Mountain Gorillas</h3>
              <p>Trek with endangered mountain gorillas in their natural habitat - a life-changing experience.</p>
            </div>
            
            <div className="highlight-item">
              <h3>🌿 Lush Landscapes</h3>
              <p>Explore verdant hills, tropical forests, and pristine lakes across this stunning country.</p>
            </div>
            
            <div className="highlight-item">
              <h3>🛣️ Warm Hospitality</h3>
              <p>Experience genuine warmth and kindness from Rwandan people known for their friendliness.</p>
            </div>
            
            <div className="highlight-item">
              <h3>🏞️ Adventure Activities</h3>
              <p>Enjoy hiking, safari, canoe trips, cultural tours, and water sports throughout the country.</p>
            </div>
            
            <div className="highlight-item">
              <h3>🌍 Rich Culture</h3>
              <p>Discover vibrant Rwandan traditions, art, music, and cuisine in markets and cultural centers.</p>
            </div>
            
            <div className="highlight-item">
              <h3>💚 Safety & Cleanliness</h3>
              <p>Rwanda is known as Africa's safest destination with excellent infrastructure and cleanliness.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="best-time-section">
        <div className="container">
          <h2>Best Time to Visit</h2>
          
          <div className="seasons">
            <div className="season">
              <h3>Dry Seasons</h3>
              <p><strong>June - September</strong> & <strong>December - February</strong></p>
              <p>Best for gorilla trekking and safari. Clear skies and optimal wildlife viewing conditions.</p>
            </div>
            
            <div className="season">
              <h3>Rainy Seasons</h3>
              <p><strong>March - May</strong> & <strong>October - November</strong></p>
              <p>Fewer tourists, lush scenery, and lower prices. Still excellent for activities.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Ready to Explore Rwanda?</h2>
          <p>Book your perfect Rwandan accommodation and start your adventure today</p>
          <button className="cta-button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            View All Hotels
          </button>
        </div>
      </section>
    </div>
  );
}
