import API_URL from '../../config';
import React, { useEffect, useState } from 'react';

const API = `${API_URL}/api`;

const initialForm = {
  url: '',
  propiedadId: ''
};

const Imagenes = () => {
  const [form, setForm] = useState(initialForm);
  const [propiedades, setPropiedades] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    fetch(`${API}/propiedades`)
      .then(res => res.json())
      .then(data => setPropiedades(data));
  }, []);


  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMensaje('');
    const body = {
      url: form.url,
      propiedad_id: form.propiedadId
    };
    const res = await fetch(`${API}/imagenes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (res.ok) {
      setMensaje('Imagen asociada correctamente');
      setForm(initialForm);
    } else {
      setMensaje('Error al asociar la imagen');
    }
  };

  return (
    <div>
      <h1 className="page-title" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Asociar Imagen a Propiedad</h1>
      <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1">
            <input className="form-control" name="url" value={form.url} onChange={handleChange} placeholder="URL de la imagen" required />
            <select className="form-control" name="propiedadId" value={form.propiedadId} onChange={handleChange} required>
              <option value="">Selecciona una propiedad</option>
              {propiedades.map(p => (
                <option key={p.id} value={p.id}>{p.titulo}</option>
              ))}
            </select>
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Asociar Imagen</button>
          </div>
        </form>
        {mensaje && (
          <p style={{ marginTop: '1.5rem', textAlign: 'center', fontWeight: 500, color: mensaje.includes('Error') ? 'var(--danger-color)' : 'var(--secondary-color)' }}>
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
};

export default Imagenes;
