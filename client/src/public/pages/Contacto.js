import React, { useState } from 'react';
import API_URL from '../../config';

const initialForm = {
  nombre: '',
  email: '',
  telefono: '',
  asunto: 'comprar',
  mensaje: ''
};

const Contacto = () => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    const payload = {
      nombre: form.nombre.trim(),
      email: form.email.trim(),
      telefono: form.telefono.trim(),
      mensaje: `Asunto: ${form.asunto}\n\n${form.mensaje.trim()}`
    };

    try {
      const res = await fetch(`${API_URL}/api/contactos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'No se pudo enviar la consulta.');
      }

      setSuccessMessage('Tu consulta fue enviada correctamente. Te contactaremos a la brevedad.');
      setForm(initialForm);
    } catch (error) {
      setErrorMessage(error.message || 'Ocurrió un error al enviar la consulta.');
    } finally {
      setLoading(false);
    }
  };

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

      <div className="contact-layout">
        <div className="contact-info-section">
          <h3>Información de Contacto</h3>
          <p>Puedes escribirnos mediante este formulario o visitarnos directamente en nuestras oficinas.</p>
          
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

        <div className="contact-form-section">
          <h3>Envíanos un Mensaje</h3>
          <form className="main-contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre Completo</label>
              <input
                type="text"
                name="nombre"
                placeholder="Ej. Juan Pérez"
                className="form-control"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group half">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="ejemplo@correo.com"
                  className="form-control"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group half">
                <label>Teléfono</label>
                <input
                  type="tel"
                  name="telefono"
                  placeholder="+54 9 11 1234..."
                  className="form-control"
                  value={form.telefono}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Asunto</label>
              <select className="form-control" name="asunto" value={form.asunto} onChange={handleChange}>
                <option value="comprar">Quiero comprar una propiedad</option>
                <option value="alquilar">Quiero alquilar una propiedad</option>
                <option value="vender">Quiero vender/alquilar mi propiedad</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Mensaje</label>
              <textarea
                className="form-control"
                rows="5"
                placeholder="Escribe tu consulta aquí..."
                name="mensaje"
                value={form.mensaje}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            {successMessage && (
              <p style={{ marginTop: '0.5rem', color: '#15803d', fontWeight: 500 }}>{successMessage}</p>
            )}
            {errorMessage && (
              <p style={{ marginTop: '0.5rem', color: '#b91c1c', fontWeight: 500 }}>{errorMessage}</p>
            )}
            
            <button type="submit" className="btn-primary btn-submit-contact" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar Mensaje'}
            </button>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Contacto;
