import { Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import './PropertyCard.css';

interface PropertyCardProps {
  id: number;
  image: string;
  title: string;
  location: string;
  distance: string;
  dates: string;
  price: number;
  rating: number;
  isSuperhost?: boolean;
}

export default function PropertyCard({
  id,
  image,
  title,
  location,
  distance,
  dates,
  price,
  rating,
  isSuperhost
}: PropertyCardProps) {
  return (
    <Link to={`/property/${id}`} className="property-card">
      <div className="property-image">
        <img src={image} alt={title} />
        <button className="wishlist-btn" onClick={(e) => {
          e.preventDefault();
        }}>
          <Heart size={20} />
        </button>
        {isSuperhost && (
          <span className="superhost-badge">Superhost</span>
        )}
      </div>
      <div className="property-info">
        <div className="property-header">
          <h3>{location}</h3>
          <div className="property-rating">
            <Star size={14} fill="currentColor" />
            <span>{rating.toFixed(2)}</span>
          </div>
        </div>
        <p className="property-distance">{distance}</p>
        <p className="property-dates">{dates}</p>
        <p className="property-price">
          <strong>${price}</strong> night
        </p>
      </div>
    </Link>
  );
}
