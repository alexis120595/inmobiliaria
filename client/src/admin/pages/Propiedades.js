import API_URL from '../../config';
import React, { useEffect, useState } from 'react';

const API = `${API_URL}/api`;

const initialForm = {
  titulo: '',
  descripcion: '',
  tipo_propiedad: '',
  operacion: '',
  direccion: '',
  localidad: '',
  provincia: '',
  pais: '',
  precio: '',
  moneda: 'USD',
  superficie_cubierta: '',
  superficie_total: '',
  dormitorios: '',
  banos: '',
  ambientes: '',
  plantas: '',
  garaje: '',
  antiguedad: '',
  condicion: '',
  estado: 'activa',
  agente_id: '',
  imagen1: '',
  imagen2: '',
  imagen3: '',
  caracteristicas: []
};

const Propiedades = () => {
  const [propiedades, setPropiedades] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [caracteristicasBD, setCaracteristicasBD] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);

  const fetchData = async () => {
    const res = await fetch(`${API}/propiedades`);
    const data = await res.json();
    setPropiedades(data);
  };

  const fetchUsuarios = async () => {
    const res = await fetch(`${API}/usuarios`);
    const data = await res.json();
    setUsuarios(data.filter(u => u.rol === 'agente'));
  };

  const fetchCaracteristicas = async () => {
    const res = await fetch(`${API}/caracteristicas`);
    const data = await res.json();
    setCaracteristicasBD(data);
  };

  useEffect(() => {
    fetchData();
    fetchUsuarios();
    fetchCaracteristicas();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (id) => {
    setForm(prev => {
      const isSelected = prev.caracteristicas.includes(id);
      return {
        ...prev,
        caracteristicas: isSelected
          ? prev.caracteristicas.filter(c => c !== id)
          : [...prev.caracteristicas, id]
      };
    });
  };


  const handleSubmit = async e => {
    e.preventDefault();
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `${API}/propiedades/${editId}` : `${API}/propiedades`;
    
    const payload = { ...form };
    payload.imagenes = [form.imagen1, form.imagen2, form.imagen3].filter(Boolean);
    delete payload.imagen1;
    delete payload.imagen2;
    delete payload.imagen3;

    // Convertir strings vacíos a null para evitar errores de tipo en la BD
    Object.keys(payload).forEach(key => {
      if (payload[key] === '') payload[key] = null;
    });

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        alert('Error al guardar: ' + (errorData.error || 'Verifica los campos ingresados.'));
        return;
      }

      setForm(initialForm);
      setEditId(null);
      alert('¡Propiedad guardada exitosamente!');
    } catch (err) {
      alert('Error de conexión con el servidor.');
    }
  };

  return (
    <div>
      <h1 className="page-title" style={{ marginBottom: '1.5rem' }}>Crear Propiedad</h1>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2">
            <input className="form-control" name="titulo" value={form.titulo} onChange={handleChange} placeholder="Título" required />
            <input className="form-control" name="tipo_propiedad" value={form.tipo_propiedad} onChange={handleChange} placeholder="Tipo (ej: Casa, Depto)" required />
            <input className="form-control" name="operacion" value={form.operacion} onChange={handleChange} placeholder="Operación" required />
            <input className="form-control" name="direccion" value={form.direccion} onChange={handleChange} placeholder="Dirección" />
            
            <input className="form-control" name="localidad" value={form.localidad} onChange={handleChange} placeholder="Localidad" />
            <input className="form-control" name="provincia" value={form.provincia} onChange={handleChange} placeholder="Provincia" />
            <input className="form-control" name="pais" value={form.pais} onChange={handleChange} placeholder="País" />
            <input className="form-control" name="precio" value={form.precio} onChange={handleChange} placeholder="Precio" type="number" min="0" step="0.01" />
            
            <input className="form-control" name="moneda" value={form.moneda} onChange={handleChange} placeholder="Moneda" />
            <input className="form-control" name="superficie_cubierta" value={form.superficie_cubierta} onChange={handleChange} placeholder="Sup. cubierta (m²)" type="number" min="0" step="0.01" />
            <input className="form-control" name="superficie_total" value={form.superficie_total} onChange={handleChange} placeholder="Sup. total (m²)" type="number" min="0" step="0.01" />
            <input className="form-control" name="dormitorios" value={form.dormitorios} onChange={handleChange} placeholder="Dormitorios" type="number" min="0" />
            
            <input className="form-control" name="banos" value={form.banos} onChange={handleChange} placeholder="Baños" type="number" min="0" />
            <input className="form-control" name="ambientes" value={form.ambientes} onChange={handleChange} placeholder="Ambientes" type="number" min="0" />
            <input className="form-control" name="plantas" value={form.plantas} onChange={handleChange} placeholder="Plantas" type="number" min="0" />
            <input className="form-control" name="garaje" value={form.garaje} onChange={handleChange} placeholder="Garaje" type="number" min="0" />
            
            <input className="form-control" name="antiguedad" value={form.antiguedad} onChange={handleChange} placeholder="Antigüedad" type="number" min="0" />
            <input className="form-control" name="condicion" value={form.condicion} onChange={handleChange} placeholder="Condición" />
            <input className="form-control" name="estado" value={form.estado} onChange={handleChange} placeholder="Estado" />
            <select className="form-control" name="agente_id" value={form.agente_id} onChange={handleChange}>
              <option value="">Sin agente</option>
              {usuarios.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
            </select>
          </div>
          
          <textarea className="form-control" name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción de la propiedad" style={{ width: '100%', marginTop: '1.5rem', minHeight: '100px' }} />
          
          <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>Imágenes (URLs)</h3>
          <div className="grid grid-cols-3">
            <input className="form-control" name="imagen1" value={form.imagen1} onChange={handleChange} placeholder="URL Imagen Principal" />
            <input className="form-control" name="imagen2" value={form.imagen2} onChange={handleChange} placeholder="URL Imagen 2" />
            <input className="form-control" name="imagen3" value={form.imagen3} onChange={handleChange} placeholder="URL Imagen 3" />
          </div>

          <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>Características</h3>
          <div className="grid grid-cols-4" style={{ gap: '1rem' }}>
            {caracteristicasBD.map(c => (
              <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={form.caracteristicas.includes(c.id)} 
                  onChange={() => handleCheckboxChange(c.id)} 
                  style={{ cursor: 'pointer' }}
                />
                {c.nombre}
              </label>
            ))}
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-start' }}>
            <button className="btn btn-primary" type="submit">Guardar Propiedad</button>
            <button className="btn btn-secondary" type="button" onClick={() => { setForm(initialForm); setEditId(null); }}>Limpiar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Propiedades;
