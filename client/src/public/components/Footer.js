import React from 'react';

const Footer = () => {
  return (
    <footer className="public-footer">
      <div className="footer-brand-block">
        <h3 className="footer-brand-title">INMOBILIARIA</h3>
        <p className="footer-brand-subtitle">PREMIUM</p>
      </div>

      <div className="footer-container">
        <div className="footer-contact-card">
          <div className="footer-contact-icon" aria-hidden="true">📍</div>
          <p className="footer-contact-text">Av. Aguinaga 1338, Chacras de Coria, Luján de Cuyo, Mendoza, Argentina.</p>
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
          <p className="footer-contact-text">261 5369447 / 4962711</p>
        </div>

        <div className="footer-contact-card">
          <div className="footer-contact-icon" aria-hidden="true">✉</div>
          <p className="footer-contact-text">info@inmobiliariapremium.com</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
