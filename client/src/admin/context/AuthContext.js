import React, { createContext, useState, useContext, useEffect } from 'react';
import API_URL from '../../config';

const AuthContext = createContext(null);
const AUTH_TOKEN_KEY = 'auth_token';
const LEGACY_ADMIN_TOKEN_KEY = 'admin_token';

const parseApiResponse = async (res) => {
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  if (isJson) {
    return res.json();
  }

  const rawText = await res.text();
  const maybeHtml = rawText.trim().startsWith('<!DOCTYPE') || rawText.trim().startsWith('<html');

  if (maybeHtml) {
    throw new Error(`El servidor devolvió HTML en lugar de JSON. Revisa REACT_APP_API_URL (actual: ${API_URL}).`);
  }

  throw new Error(rawText || 'Respuesta inválida del servidor.');
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(localStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem(LEGACY_ADMIN_TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  const getAuthHeaders = (extraHeaders = {}) => {
    const savedToken = token || localStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem(LEGACY_ADMIN_TOKEN_KEY);
    if (!savedToken) return { ...extraHeaders };

    return {
      Authorization: `Bearer ${savedToken}`,
      ...extraHeaders
    };
  };

  // Al montar, verificar si hay un token guardado
  useEffect(() => {
    const verificarToken = async () => {
      const savedToken = localStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem(LEGACY_ADMIN_TOKEN_KEY);
      if (savedToken) {
        try {
          const res = await fetch(`${API_URL}/api/auth/me`, {
            headers: { 'Authorization': `Bearer ${savedToken}` }
          });
          if (res.ok) {
            const data = await parseApiResponse(res);
            setUsuario(data);
            setToken(savedToken);
            localStorage.setItem(AUTH_TOKEN_KEY, savedToken);
            localStorage.removeItem(LEGACY_ADMIN_TOKEN_KEY);
          } else {
            // Token inválido, limpiar
            localStorage.removeItem(AUTH_TOKEN_KEY);
            localStorage.removeItem(LEGACY_ADMIN_TOKEN_KEY);
            setToken(null);
            setUsuario(null);
          }
        } catch (err) {
          localStorage.removeItem(AUTH_TOKEN_KEY);
          localStorage.removeItem(LEGACY_ADMIN_TOKEN_KEY);
          setToken(null);
          setUsuario(null);
        }
      }
      setLoading(false);
    };
    verificarToken();
  }, []);

  const applyAuthSession = (data) => {
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    localStorage.removeItem(LEGACY_ADMIN_TOKEN_KEY);
    setToken(data.token);
    setUsuario(data.usuario);
  };

  const login = async (email, password, options = {}) => {
    const { requiredRole } = options;
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await parseApiResponse(res);

    if (!res.ok) {
      throw new Error(data.error || 'Error al iniciar sesión');
    }

    if (requiredRole && data?.usuario?.rol !== requiredRole) {
      throw new Error('No tienes permisos para acceder a esta sección.');
    }

    applyAuthSession(data);
    return data;
  };

  const register = async ({ nombre, email, password, telefono }) => {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password, telefono })
    });

    const data = await parseApiResponse(res);

    if (!res.ok) {
      throw new Error(data.error || 'Error al crear la cuenta');
    }

    applyAuthSession(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(LEGACY_ADMIN_TOKEN_KEY);
    setToken(null);
    setUsuario(null);
  };

  const isAuthenticated = () => {
    return !!token && !!usuario;
  };

  return (
    <AuthContext.Provider value={{ usuario, token, loading, login, register, logout, isAuthenticated, getAuthHeaders }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export default AuthContext;
