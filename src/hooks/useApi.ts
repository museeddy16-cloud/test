import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
}

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T = any>() {
  const { token } = useAuth();
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const request = useCallback(async (endpoint: string, options: ApiOptions = {}) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(endpoint, {
        method: options.method || 'GET',
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Request failed');
      }

      setState({ data, loading: false, error: null });
      return data;
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, [token]);

  const get = useCallback((endpoint: string) => request(endpoint, { method: 'GET' }), [request]);
  const post = useCallback((endpoint: string, body: any) => request(endpoint, { method: 'POST', body }), [request]);
  const put = useCallback((endpoint: string, body: any) => request(endpoint, { method: 'PUT', body }), [request]);
  const del = useCallback((endpoint: string) => request(endpoint, { method: 'DELETE' }), [request]);
  const patch = useCallback((endpoint: string, body: any) => request(endpoint, { method: 'PATCH', body }), [request]);

  return {
    ...state,
    request,
    get,
    post,
    put,
    delete: del,
    patch
  };
}

export function useFetch<T = any>(endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(endpoint, {
        headers,
        credentials: 'include'
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch data');
      }

      setData(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [endpoint, token]);

  return { data, loading, error, refetch: fetchData };
}

export default useApi;
