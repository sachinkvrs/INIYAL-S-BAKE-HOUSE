import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-chocolate-950 flex flex-col items-center justify-center text-cream-200">
        <div className="w-12 h-12 border-4 border-caramel-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-serif text-lg tracking-wider text-gold-400">Loading Iniyal’s Bake House Admin...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
