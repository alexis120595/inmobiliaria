import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const logoSrc = `${process.env.PUBLIC_URL}/assets/logo editado.png?v=20260615-2`;

  return (
    <footer className="public-footer">
      <div className="footer-brand-block">
        <Link to="/" className="footer-brand-link" aria-label="Volver al inicio">
          <img
            className="brand-logo brand-logo-footer"
            src={logoSrc}
            alt="Mariana Fernandez Servicio Inmobiliario"
          />
        </Link>
      </div>

      <div className="footer-container">
        <div className="footer-contact-card">
          <div className="footer-contact-icon" aria-hidden="true">📍</div>
          <p className="footer-contact-text">Av San Martin 596, Luján de Cuyo, Mendoza.</p>
        </div>

        <div className="footer-contact-card">
          <div className="footer-contact-icon" aria-hidden="true">◎</div>
          <p className="footer-contact-text">Seguinos en nuestras redes</p>
          <div className="footer-social-links" aria-label="Redes sociales">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>

        <div className="footer-contact-card">
          <div className="footer-contact-icon" aria-hidden="true">◔</div>
          <p className="footer-contact-text">2613381678 / 2614673852</p>
        </div>

        <div className="footer-contact-card">
          <div className="footer-contact-icon" aria-hidden="true">✉</div>
          <p className="footer-contact-text">fernandezinmobiliaria.mza@gmail.com</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
