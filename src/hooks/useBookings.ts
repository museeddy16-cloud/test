import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getApiUrl } from '../config/api';

interface Booking {
  id: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  paymentId?: string;
  createdAt: string;
  property?: {
    id: string;
    title: string;
    images: string[];
    location: string;
    price: number;
  };
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
}

interface CreateBookingData {
  propertyId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export function useBookings() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(getApiUrl('/bookings'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch bookings');
      }

      setBookings(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { bookings, loading, error, refetch: fetchBookings };
}

export function useBooking(id: string | undefined) {
  const { token } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooking = useCallback(async () => {
    if (!id || !token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(getApiUrl(`/bookings/${id}`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch booking');
      }

      setBooking(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  return { booking, loading, error, refetch: fetchBooking };
}

export function useCreateBooking() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBooking = useCallback(async (data: CreateBookingData): Promise<Booking | null> => {
    if (!token) {
      setError('Authentication required');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(getApiUrl('/bookings'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create booking');
      }

      return result;
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [token]);

  return { createBooking, loading, error };
}

export function useBookingActions() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = useCallback(async (bookingId: string, status: string): Promise<boolean> => {
    if (!token) return false;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(getApiUrl(`/bookings/${bookingId}/status`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update status');
      }

      return true;
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const cancelBooking = useCallback(async (bookingId: string): Promise<boolean> => {
    if (!token) return false;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(getApiUrl(`/bookings/${bookingId}/cancel`), {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to cancel booking');
      }

      return true;
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  }, [token]);

  return { updateStatus, cancelBooking, loading, error };
}

export default useBookings;
