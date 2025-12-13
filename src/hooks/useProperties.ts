import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  address: string;
  city: string;
  country: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  amenities: string[];
  images: string[];
  status: string;
  featured: boolean;
  avgRating?: number;
  reviewCount?: number;
  host?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

interface PropertyFilters {
  search?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  guests?: number;
  page?: number;
  limit?: number;
}

interface UsePropertiesResult {
  properties: Property[];
  loading: boolean;
  error: string | null;
  total: number;
  pages: number;
  refetch: () => void;
}

export function useProperties(filters: PropertyFilters = {}): UsePropertiesResult {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });

      const response = await fetch(`/api/properties?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch properties');
      }

      setProperties(data.properties || data);
      setTotal(data.total || (data.properties || data).length);
      setPages(data.pages || 1);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return { properties, loading, error, total, pages, refetch: fetchProperties };
}

export function useProperty(id: string | undefined) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperty = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/properties/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch property');
      }

      setProperty(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  return { property, loading, error, refetch: fetchProperty };
}

export function useMyProperties() {
  const { token } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyProperties = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/properties/my-properties', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch properties');
      }

      setProperties(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchMyProperties();
  }, [fetchMyProperties]);

  return { properties, loading, error, refetch: fetchMyProperties };
}

export function useFeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeatured = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/properties/featured');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch featured properties');
      }

      setProperties(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeatured();
  }, [fetchFeatured]);

  return { properties, loading, error, refetch: fetchFeatured };
}

export default useProperties;
