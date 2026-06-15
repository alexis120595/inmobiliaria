import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../admin/context/AuthContext';

const Navbar = () => {
  const { usuario, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const logoSrc = `${process.env.PUBLIC_URL}/assets/logo editado.png?v=20260615-2`;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  return (
    <header className="public-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img
            className="brand-logo brand-logo-navbar"
            src={logoSrc}
            alt="Mariana Fernandez Servicio Inmobiliario"
          />
        </Link>
        
        {/* Botón de hamburguesa para móvil */}
        <button
          className={`hamburger-btn ${isMenuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isMenuOpen}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        {/* Enlaces de navegación */}
        <nav className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={closeMenu}>Inicio</Link>
          <Link to="/propiedades" className="nav-link" onClick={closeMenu}>Propiedades</Link>
          <Link to="/sobre-nosotros" className="nav-link" onClick={closeMenu}>Sobre Nosotros</Link>
          <Link to="/contacto" className="nav-link" onClick={closeMenu}>Contacto</Link>

          {isAuthenticated() ? (
            <>
              <span className="nav-user">Hola, {usuario?.nombre || 'Usuario'}</span>
              {usuario?.rol === 'admin' && (
                <Link to="/admin" className="btn-primary-outline" onClick={closeMenu}>Panel Admin</Link>
              )}
              <button type="button" className="btn btn-secondary nav-logout-btn" onClick={handleLogout}>Cerrar sesión</button>
            </>
          ) : (
            <>
              <Link to="/acceso" className="btn-primary-outline" onClick={closeMenu}>Iniciar sesión</Link>
              <Link to="/registro" className="btn btn-primary" onClick={closeMenu}>Registrarse</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
