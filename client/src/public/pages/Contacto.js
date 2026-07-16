import React from 'react';

const Contacto = () => {
  return (
    <div className="contact-page">
      {/* Contact Hero Section */}
      <section className="hero-section" style={{ backgroundImage: "url('/assets/home_banner_3.jpeg')" }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Estamos Aquí Para Ti</h1>
          <p className="hero-subtitle">Visítanos o envíanos tus dudas. Nuestro equipo de asesores está listo para ayudarte en tu próximo paso.</p>
        </div>
      </section>

      <div className="page-container pt-0">
        <div className="contact-info-centered">
          <h3>Información de Contacto</h3>
          <p>Visítanos directamente en nuestras oficinas o comunícate con nosotros.</p>

          <div className="info-list">
            <div className="info-item">
              <span className="info-icon">📍</span>
              <div>
                <strong>Dirección</strong>
                <p>Av San Martin 596<br/>Luján de Cuyo, Mendoza</p>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">📞</span>
              <div>
                <strong>Teléfono</strong>
                <p>2613381678<br/>2614673852</p>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">✉️</span>
              <div>
                <strong>Email</strong>
                <p>fernandezinmobiliaria.mza@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
