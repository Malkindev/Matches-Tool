import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole: 'admin' | 'client';
}

function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const token = localStorage.getItem('authToken');
  const role = localStorage.getItem('authRole');

  if (!token) {
    return <Navigate to={requiredRole === 'admin' ? '/admin/login' : '/login'} replace />;
  }

  if (requiredRole === 'admin' && role !== 'admin') {
    return <Navigate to={role === 'customer' ? '/dashboard' : '/login'} replace />;
  }

  if (requiredRole === 'client' && role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
