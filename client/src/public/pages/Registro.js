import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../admin/context/AuthContext';

const Registro = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      await register({
        nombre: form.nombre,
        email: form.email,
        telefono: form.telefono,
        password: form.password
      });
      navigate('/');
    } catch (err) {
      setError(err.message || 'No fue posible crear la cuenta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">📝</div>
          <h1 className="login-title">Crear Cuenta</h1>
          <p className="login-subtitle">Regístrate como usuario para continuar</p>
        </div>

        {error && (
          <div className="login-error">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label htmlFor="nombre">Nombre completo</label>
            <input
              id="nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej: Juan Pérez"
              required
              autoFocus
            />
          </div>

          <div className="login-field">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="telefono">Teléfono (opcional)</label>
            <input
              id="telefono"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              placeholder="+54 11 1234 5678"
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repite la contraseña"
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="login-spinner-small" />
                Creando cuenta...
              </>
            ) : (
              'Registrarme'
            )}
          </button>
        </form>

        <div className="login-footer">
          <Link to="/acceso" className="login-back-link">¿Ya tienes cuenta? Inicia sesión</Link>
        </div>
      </div>
    </div>
  );
};

export default Registro;
