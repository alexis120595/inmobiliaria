import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="header">
      <span className="header-user">
        👤 {usuario ? usuario.nombre : 'Administrador'}
      </span>
      <button className="btn btn-danger" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </header>
  );
};

export default Header;
