import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="public-footer">
      <div className="footer-container">
        <div className="footer-column">
          <h3 className="footer-title">Inmobiliaria<span>Premium</span></h3>
          <p className="footer-text">
            Tu socio de confianza para encontrar el hogar de tus sueños. Propiedades exclusivas con atención personalizada.
          </p>
        </div>
        
        <div className="footer-column">
          <h4 className="footer-subtitle">Enlaces Rápidos</h4>
          <ul className="footer-links">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/propiedades">Propiedades</Link></li>
            <li><Link to="/sobre-nosotros">Sobre Nosotros</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h4 className="footer-subtitle">Contacto</h4>
          <ul className="footer-contact-info">
            <li>📍 Av. Principal 1234, Ciudad</li>
            <li>📞 +1 234 567 8900</li>
            <li>✉️ info@inmobiliariapremium.com</li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} Inmobiliaria Premium. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
