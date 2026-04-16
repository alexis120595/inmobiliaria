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
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

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

  const handleSubmit = async e => {
    e.preventDefault();
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `${API}/usuarios/${editId}` : `${API}/usuarios`;
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setForm(initialForm);
    setEditId(null);
    setShowForm(false);
    fetchData();
  };

  const handleEdit = a => {
    setForm({ ...a, password_hash: '' });
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
          onClick={() => { setShowForm(!showForm); if(!showForm) { setForm(initialForm); setEditId(null); } }}
        >
          {showForm ? 'Ocultar Formulario' : 'Nuevo Agente'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>{editId ? 'Editar Agente' : 'Nuevo Agente'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2">
              <input className="form-control" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" required />
              <input className="form-control" name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" required />
              <input className="form-control" name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" />
              <input className="form-control" name="foto_url" value={form.foto_url} onChange={handleChange} placeholder="Foto URL" />
              <input className="form-control" name="password_hash" value={form.password_hash} onChange={handleChange} placeholder="Contraseña (hash)" type="password" required={!editId} />
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-start' }}>
              <button type="submit" className="btn btn-primary">{editId ? 'Actualizar' : 'Crear Agente'}</button>
              <button type="button" className="btn btn-secondary" onClick={() => { setShowForm(false); setEditId(null); setForm(initialForm); }}>Cancelar</button>
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
