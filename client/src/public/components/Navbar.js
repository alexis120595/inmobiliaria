import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="public-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          Inmobiliaria<span>Premium</span>
        </Link>
        
        {/* Botón de hamburguesa para móvil */}
        <button className="hamburger-btn" onClick={toggleMenu} aria-label="Abrir menú">
          <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
        </button>

        {/* Enlaces de navegación */}
        <nav className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={closeMenu}>Inicio</Link>
          <Link to="/propiedades" className="nav-link" onClick={closeMenu}>Propiedades</Link>
          <Link to="/sobre-nosotros" className="nav-link" onClick={closeMenu}>Sobre Nosotros</Link>
          <Link to="/contacto" className="nav-link" onClick={closeMenu}>Contacto</Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
