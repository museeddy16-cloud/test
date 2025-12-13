import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

type PaymentProvider = 'STRIPE' | 'MTN_MOMO' | 'AIRTEL_MONEY';
type PaymentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: PaymentProvider;
  providerPaymentId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  booking?: {
    id: string;
    checkIn: string;
    checkOut: string;
    property?: {
      id: string;
      title: string;
      images: string[];
    };
  };
}

interface CreatePaymentData {
  bookingId: string;
  provider: PaymentProvider;
  amount: number;
  currency?: string;
}

interface PaymentIntent {
  payment: Payment;
  clientSecret?: string;
  referenceId?: string;
}

export function usePayments() {
  const { token } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/payments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch payments');
      }

      setPayments(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return { payments, loading, error, refetch: fetchPayments };
}

export function usePayment(id: string | undefined) {
  const { token } = useAuth();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayment = useCallback(async () => {
    if (!id || !token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/payments/${id}/status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch payment');
      }

      setPayment(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchPayment();
  }, [fetchPayment]);

  return { payment, loading, error, refetch: fetchPayment };
}

export function useCreatePayment() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPaymentIntent = useCallback(async (data: CreatePaymentData): Promise<PaymentIntent | null> => {
    if (!token) {
      setError('Authentication required');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/payments/intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create payment');
      }

      return result;
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const confirmPayment = useCallback(async (paymentId: string): Promise<Payment | null> => {
    if (!token) {
      setError('Authentication required');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/payments/${paymentId}/confirm`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to confirm payment');
      }

      return result;
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const requestRefund = useCallback(async (paymentId: string): Promise<Payment | null> => {
    if (!token) {
      setError('Authentication required');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/payments/${paymentId}/refund`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to request refund');
      }

      return result;
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [token]);

  return { createPaymentIntent, confirmPayment, requestRefund, loading, error };
}

export default usePayments;
