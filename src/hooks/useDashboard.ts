import { useState, useEffect, useCallback } from 'react';
import { getApiUrl } from '../config/api';
import { ApiResponse, LoadingState } from '../types/dashboard';

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export function useFetch<T>(endpoint: string, immediate = true) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading('loading');
    setError(null);
    try {
      const response = await fetch(getApiUrl(endpoint), {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch data');
      const result: ApiResponse<T> = await response.json();
      setData(result.data || (result as unknown as T));
      setLoading('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading('error');
    }
  }, [endpoint]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [fetchData, immediate]);

  return { data, loading, error, refetch: fetchData };
}

export function usePost<T, R = T>() {
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  const post = async (endpoint: string, body: T): Promise<R | null> => {
    setLoading('loading');
    setError(null);
    try {
      const response = await fetch(getApiUrl(endpoint), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error('Request failed');
      const result: ApiResponse<R> = await response.json();
      setLoading('success');
      return result.data || (result as unknown as R);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading('error');
      return null;
    }
  };

  return { post, loading, error };
}

export function usePut<T, R = T>() {
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  const put = async (endpoint: string, body: T): Promise<R | null> => {
    setLoading('loading');
    setError(null);
    try {
      const response = await fetch(getApiUrl(endpoint), {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error('Request failed');
      const result: ApiResponse<R> = await response.json();
      setLoading('success');
      return result.data || (result as unknown as R);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading('error');
      return null;
    }
  };

  return { put, loading, error };
}

export function useDelete() {
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  const remove = async (endpoint: string): Promise<boolean> => {
    setLoading('loading');
    setError(null);
    try {
      const response = await fetch(getApiUrl(endpoint), {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Delete failed');
      setLoading('success');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading('error');
      return false;
    }
  };

  return { remove, loading, error };
}

export function usePagination<T>(endpoint: string, limit = 10) {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(async (pageNum: number) => {
    setLoading('loading');
    setError(null);
    try {
      const url = `${endpoint}${endpoint.includes('?') ? '&' : '?'}page=${pageNum}&limit=${limit}`;
      const response = await fetch(getApiUrl(url), {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();
      setData(result.data || result.items || []);
      setTotal(result.pagination?.total || result.total || 0);
      setTotalPages(result.pagination?.totalPages || Math.ceil((result.total || 0) / limit));
      setPage(pageNum);
      setLoading('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading('error');
    }
  }, [endpoint, limit]);

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  return {
    data,
    page,
    totalPages,
    total,
    loading,
    error,
    goToPage: fetchPage,
    nextPage: () => page < totalPages && fetchPage(page + 1),
    prevPage: () => page > 1 && fetchPage(page - 1),
    refresh: () => fetchPage(page),
  };
}
