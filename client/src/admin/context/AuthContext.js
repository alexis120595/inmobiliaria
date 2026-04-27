import React, { createContext, useState, useContext, useEffect } from 'react';
import API_URL from '../../config';

const AuthContext = createContext(null);

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
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [loading, setLoading] = useState(true);

  // Al montar, verificar si hay un token guardado
  useEffect(() => {
    const verificarToken = async () => {
      const savedToken = localStorage.getItem('admin_token');
      if (savedToken) {
        try {
          const res = await fetch(`${API_URL}/api/auth/me`, {
            headers: { 'Authorization': `Bearer ${savedToken}` }
          });
          if (res.ok) {
            const data = await parseApiResponse(res);
            setUsuario(data);
            setToken(savedToken);
          } else {
            // Token inválido, limpiar
            localStorage.removeItem('admin_token');
            setToken(null);
            setUsuario(null);
          }
        } catch (err) {
          localStorage.removeItem('admin_token');
          setToken(null);
          setUsuario(null);
        }
      }
      setLoading(false);
    };
    verificarToken();
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await parseApiResponse(res);

    if (!res.ok) {
      throw new Error(data.error || 'Error al iniciar sesión');
    }

    localStorage.setItem('admin_token', data.token);
    setToken(data.token);
    setUsuario(data.usuario);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    setUsuario(null);
  };

  const isAuthenticated = () => {
    return !!token && !!usuario;
  };

  return (
    <AuthContext.Provider value={{ usuario, token, loading, login, logout, isAuthenticated }}>
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
