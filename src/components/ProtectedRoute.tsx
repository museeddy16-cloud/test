import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'USER' | 'HOST' | 'ADMIN';
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const { user, isLoading: loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading..." />;
  }

  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  if (requiredRole) {
    const roleHierarchy: Record<string, number> = {
      'USER': 1,
      'HOST': 2,
      'ADMIN': 3
    };

    const userRoleLevel = roleHierarchy[user.role] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

    if (userRoleLevel < requiredRoleLevel) {
      if (requiredRole === 'ADMIN') {
        return <Navigate to="/dashboard" replace />;
      }
      if (requiredRole === 'HOST') {
        return <Navigate to="/hosting" replace />;
      }
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}

interface GuestOnlyRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export function GuestOnlyRoute({
  children,
  redirectTo = '/dashboard'
}: GuestOnlyRouteProps) {
  const { user, isLoading: loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading..." />;
  }

  if (user) {
    const from = (location.state as any)?.from || redirectTo;
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}
