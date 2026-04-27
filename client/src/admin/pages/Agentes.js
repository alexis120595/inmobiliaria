import API_URL from '../../config';
import React, { useEffect, useState } from 'react';
import AgentesTable from '../components/AgentesTable';

const API = `${API_URL}/api`;

const initialForm = {
  nombre: '',
  email: '',
  telefono: '',
  foto_url: '',
  password_hash: '',
  rol: 'agente'
};

const Agentes = () => {
  const [agentes, setAgentes] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const res = await fetch(`${API}/usuarios`);
    const data = await res.json();
    setAgentes(data.filter(u => u.rol === 'agente'));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = e => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `${API}/usuarios/${editId}` : `${API}/usuarios`;
    
    const formData = new FormData();
    if (file) {
      formData.append('foto', file);
    } else {
      formData.append('foto_url', form.foto_url);
    }
    formData.append('nombre', form.nombre);
    formData.append('email', form.email);
    formData.append('telefono', form.telefono);
    formData.append('password_hash', form.password_hash);
    formData.append('rol', form.rol);

    try {
      const res = await fetch(url, { method, body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error al guardar el agente.');
        setLoading(false);
        return;
      }
      setForm(initialForm);
      setFile(null);
      setEditId(null);
      setShowForm(false);
      fetchData();
    } catch (err) {
      setError('Error de conexión con el servidor: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = a => {
    setForm({ ...a, password_hash: '' });
    setFile(null);
    setEditId(a.id);
    setShowForm(true);
  };

  const handleDelete = async a => {
    if (window.confirm('¿Eliminar agente?')) {
      await fetch(`${API}/usuarios/${a.id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Gestión de Agentes</h1>
        <button 
          className="btn btn-primary" 
          onClick={() => { setShowForm(!showForm); if(!showForm) { setForm(initialForm); setFile(null); setEditId(null); } }}
        >
          {showForm ? 'Ocultar Formulario' : 'Nuevo Agente'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>{editId ? 'Editar Agente' : 'Nuevo Agente'}</h2>
          {error && (
            <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.75rem 1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
              ⚠️ {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2">
              <input className="form-control" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" required />
              <input className="form-control" name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" required />
              <input className="form-control" name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" />
              <input className="form-control" name="foto_url" value={form.foto_url} onChange={handleChange} placeholder="O Foto URL (opcional)" required={!file && !editId} />
              <input className="form-control" name="foto" type="file" accept="image/*" onChange={handleFileChange} style={{ gridColumn: 'span 2' }} />
              <input className="form-control" name="password_hash" value={form.password_hash} onChange={handleChange} placeholder="Contraseña (hash)" type="password" required={!editId} style={{ gridColumn: 'span 2' }} />
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-start' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Guardando...' : (editId ? 'Actualizar' : 'Crear Agente')}</button>
              <button type="button" className="btn btn-secondary" onClick={() => { setShowForm(false); setEditId(null); setFile(null); setForm(initialForm); setError(''); }}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <AgentesTable agentes={agentes} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default Agentes;
