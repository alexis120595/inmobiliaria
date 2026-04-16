import React from 'react';

const Contacto = () => {
  return (
    <div className="contact-page">
      {/* Contact Hero Section */}
      <section className="about-hero" style={{ backgroundImage: "url('/assets/contact_hero.png')" }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Estamos Aquí Para Ti</h1>
          <p className="hero-subtitle">Visítanos o envíanos tus dudas. Nuestro equipo de asesores está listo para ayudarte en tu próximo paso.</p>
        </div>
      </section>

      <div className="page-container pt-0">

      <div className="contact-layout">
        <div className="contact-info-section">
          <h3>Información de Contacto</h3>
          <p>Puedes escribirnos mediante este formulario o visitarnos directamente en nuestras oficinas.</p>
          
          <div className="info-list">
            <div className="info-item">
              <span className="info-icon">📍</span>
              <div>
                <strong>Dirección</strong>
                <p>Av. Principal 1234, Piso 5<br/>Ciudad Capital, CP 1000</p>
              </div>
            </div>
            
            <div className="info-item">
              <span className="info-icon">📞</span>
              <div>
                <strong>Teléfono</strong>
                <p>+1 234 567 8900<br/>+1 987 654 3210</p>
              </div>
            </div>
            
            <div className="info-item">
              <span className="info-icon">✉️</span>
              <div>
                <strong>Email</strong>
                <p>contacto@inmobiliariapremium.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form-section">
          <h3>Envíanos un Mensaje</h3>
          <form className="main-contact-form">
            <div className="form-group">
              <label>Nombre Completo</label>
              <input type="text" placeholder="Ej. Juan Pérez" className="form-control" />
            </div>
            
            <div className="form-row">
              <div className="form-group half">
                <label>Email</label>
                <input type="email" placeholder="ejemplo@correo.com" className="form-control" />
              </div>
              <div className="form-group half">
                <label>Teléfono</label>
                <input type="tel" placeholder="+54 9 11 1234..." className="form-control" />
              </div>
            </div>
            
            <div className="form-group">
              <label>Asunto</label>
              <select className="form-control">
                <option value="comprar">Quiero comprar una propiedad</option>
                <option value="alquilar">Quiero alquilar una propiedad</option>
                <option value="vender">Quiero vender/alquilar mi propiedad</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Mensaje</label>
              <textarea className="form-control" rows="5" placeholder="Escribe tu consulta aquí..."></textarea>
            </div>
            
            <button type="button" className="btn-primary btn-submit-contact">Enviar Mensaje</button>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Contacto;
