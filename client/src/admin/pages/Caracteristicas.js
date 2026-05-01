import API_URL from '../../config';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const API = `${API_URL}/api`;

const Caracteristicas = () => {
  const { getAuthHeaders } = useAuth();
  const [caracteristicas, setCaracteristicas] = useState([]);
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');

  const fetchData = async () => {
    try {
      const res = await fetch(`${API}/caracteristicas`);
      const data = await res.json();
      setCaracteristicas(data);
    } catch(e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    
    if (!nombre.trim()) return;

    try {
      const res = await fetch(`${API}/caracteristicas`, {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ nombre })
      });
      
      if (res.ok) {
          setMensaje('Característica agregada exitosamente');
          setNombre('');
          fetchData();
      } else {
          setMensaje('Error al agregar característica');
      }
    } catch(e) {
      setMensaje('Error de conexión');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta característica?')) {
      try {
        const res = await fetch(`${API}/caracteristicas/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        if(res.ok) fetchData();
      } catch(e) {
        console.error(e);
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Gestión de Características</h1>
      </div>

      <div className="grid grid-cols-2">
        <div className="card" style={{ alignSelf: 'start' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Agregar Nueva Característica</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <input className="form-control" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej: WiFi, Piscina, Seguridad 24hs" required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Guardar Característica</button>
          </form>
          {mensaje && (
            <p style={{ marginTop: '1.5rem', textAlign: 'center', fontWeight: 500, color: mensaje.includes('Error') ? 'var(--danger-color)' : 'var(--secondary-color)' }}>
              {mensaje}
            </p>
          )}
        </div>

        <div className="card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Características Existentes</h2>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th style={{ width: 100, textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {caracteristicas.length === 0 ? (
                  <tr><td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No hay características registradas</td></tr>
                ) : (
                  caracteristicas.map(c => (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td>{c.nombre}</td>
                      <td style={{ textAlign: 'center' }}>
                        <button onClick={() => handleDelete(c.id)} className="btn btn-danger" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Eliminar</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Caracteristicas;
