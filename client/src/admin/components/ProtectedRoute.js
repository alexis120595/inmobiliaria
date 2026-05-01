import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null, redirectTo = '/admin/login' }) => {
  const { isAuthenticated, loading, usuario } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-main)' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="login-spinner" />
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to={redirectTo} replace />;
  }

  if (requiredRole && usuario?.rol !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
