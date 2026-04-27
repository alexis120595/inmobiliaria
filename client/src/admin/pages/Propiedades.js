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
  const [archivos, setArchivos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [vista, setVista] = useState('formulario'); // 'formulario' o 'lista'

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

  const handleFileChange = e => {
    setArchivos(Array.from(e.target.files));
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
    
    const formData = new FormData();
    
    const payload = { ...form };
    const imagenesUrls = [form.imagen1, form.imagen2, form.imagen3].filter(Boolean);
    delete payload.imagen1;
    delete payload.imagen2;
    delete payload.imagen3;

    // Agregar campos de texto al FormData
    Object.keys(payload).forEach(key => {
      if (key === 'caracteristicas') {
        payload[key].forEach(c => formData.append('caracteristicas[]', c));
      } else {
        const val = payload[key] === '' ? '' : payload[key]; // backend expects empty string or value
        formData.append(key, val);
      }
    });

    // Agregar URLs de imagenes si hay
    imagenesUrls.forEach(img => formData.append('imagenes[]', img));

    // Agregar archivos físicos
    archivos.forEach(file => {
      formData.append('imagenes_archivos', file);
    });

    try {
      const res = await fetch(url, {
        method,
        body: formData
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        alert('Error al guardar: ' + (errorData.error || 'Verifica los campos ingresados.'));
        return;
      }

      setForm(initialForm);
      setArchivos([]);
      setEditId(null);
      
      // Reset input file (uncontrolled)
      const fileInput = document.getElementById('imagenes_archivos_input');
      if (fileInput) fileInput.value = '';

      alert('¡Propiedad guardada exitosamente!');
      fetchData();
    } catch (err) {
      alert('Error de conexión con el servidor.');
    }
  };

  const handleEdit = (prop) => {
    setForm({
      titulo: prop.titulo || '',
      descripcion: prop.descripcion || '',
      tipo_propiedad: prop.tipo_propiedad || '',
      operacion: prop.operacion || '',
      direccion: prop.direccion || '',
      localidad: prop.localidad || '',
      provincia: prop.provincia || '',
      pais: prop.pais || '',
      precio: prop.precio || '',
      moneda: prop.moneda || 'USD',
      superficie_cubierta: prop.superficie_cubierta || '',
      superficie_total: prop.superficie_total || '',
      dormitorios: prop.dormitorios || '',
      banos: prop.banos || '',
      ambientes: prop.ambientes || '',
      plantas: prop.plantas || '',
      garaje: prop.garaje || '',
      antiguedad: prop.antiguedad || '',
      condicion: prop.condicion || '',
      estado: prop.estado || 'activa',
      agente_id: prop.agente_id || prop.Usuario?.id || '',
      imagen1: '',
      imagen2: '',
      imagen3: '',
      caracteristicas: prop.Caracteristicas ? prop.Caracteristicas.map(c => c.id) : []
    });
    setEditId(prop.id);
    setArchivos([]);
    setVista('formulario');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta propiedad? Esta acción no se puede deshacer.')) return;
    try {
      const res = await fetch(`${API}/propiedades/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Propiedad eliminada correctamente.');
        fetchData();
      } else {
        alert('Error al eliminar la propiedad.');
      }
    } catch (err) {
      alert('Error de conexión con el servidor.');
    }
  };

  const formatPrecio = (precio, moneda) => {
    if (!precio) return '—';
    const num = Number(precio).toLocaleString('es-AR');
    return `${moneda || '$'} ${num}`;
  };

  return (
    <div>
      {/* Header con botones de navegación */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>
          {vista === 'formulario' ? (editId ? 'Editar Propiedad' : 'Crear Propiedad') : 'Propiedades Creadas'}
        </h1>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {vista === 'formulario' ? (
            <button className="btn btn-primary" onClick={() => setVista('lista')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📋 Ver Propiedades ({propiedades.length})
            </button>
          ) : (
            <button className="btn btn-primary" onClick={() => { setVista('formulario'); setEditId(null); setForm(initialForm); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ➕ Nueva Propiedad
            </button>
          )}
        </div>
      </div>

      {/* ========== VISTA FORMULARIO ========== */}
      {vista === 'formulario' && (
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
            
            <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>Imágenes (Sube archivos o usa URLs)</h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Subir archivos desde la PC:</label>
              <input id="imagenes_archivos_input" className="form-control" type="file" accept="image/*" multiple onChange={handleFileChange} />
            </div>

            <div className="grid grid-cols-3">
              <input className="form-control" name="imagen1" value={form.imagen1} onChange={handleChange} placeholder="URL Imagen 1 (Opcional)" />
              <input className="form-control" name="imagen2" value={form.imagen2} onChange={handleChange} placeholder="URL Imagen 2 (Opcional)" />
              <input className="form-control" name="imagen3" value={form.imagen3} onChange={handleChange} placeholder="URL Imagen 3 (Opcional)" />
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
              <button className="btn btn-primary" type="submit">{editId ? 'Actualizar Propiedad' : 'Guardar Propiedad'}</button>
              <button className="btn btn-secondary" type="button" onClick={() => { setForm(initialForm); setArchivos([]); setEditId(null); const fi = document.getElementById('imagenes_archivos_input'); if(fi) fi.value = ''; }}>Limpiar</button>
              {editId && (
                <button className="btn btn-secondary" type="button" onClick={() => { setForm(initialForm); setArchivos([]); setEditId(null); const fi = document.getElementById('imagenes_archivos_input'); if(fi) fi.value = ''; }}>Cancelar Edición</button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* ========== VISTA LISTA ========== */}
      {vista === 'lista' && (
        <div>
          {propiedades.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>No hay propiedades creadas todavía.</p>
              <button className="btn btn-primary" onClick={() => setVista('formulario')}>Crear tu primera propiedad</button>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Título</th>
                    <th>Tipo</th>
                    <th>Operación</th>
                    <th>Ubicación</th>
                    <th>Precio</th>
                    <th>Estado</th>
                    <th style={{ textAlign: 'center' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {propiedades.map(prop => {
                    const imagen = prop.imagenes && prop.imagenes.length > 0 ? prop.imagenes[0].url : null;
                    return (
                      <tr key={prop.id}>
                        <td>
                          {imagen ? (
                            <img 
                              src={imagen} 
                              alt={prop.titulo} 
                              style={{ width: '70px', height: '50px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e5e7eb' }} 
                            />
                          ) : (
                            <div style={{ width: '70px', height: '50px', background: '#f3f4f6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', border: '1px solid #e5e7eb' }}>
                              🏠
                            </div>
                          )}
                        </td>
                        <td style={{ fontWeight: 600, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{prop.titulo}</td>
                        <td>{prop.tipo_propiedad}</td>
                        <td>
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            background: prop.operacion?.toLowerCase() === 'venta' ? '#fef3c7' : '#dbeafe',
                            color: prop.operacion?.toLowerCase() === 'venta' ? '#92400e' : '#1e40af'
                          }}>
                            {prop.operacion}
                          </span>
                        </td>
                        <td>{[prop.localidad, prop.provincia].filter(Boolean).join(', ') || '—'}</td>
                        <td style={{ fontWeight: 600 }}>{formatPrecio(prop.precio, prop.moneda)}</td>
                        <td>
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            background: prop.estado === 'activa' ? '#d1fae5' : '#fee2e2',
                            color: prop.estado === 'activa' ? '#065f46' : '#991b1b'
                          }}>
                            {prop.estado}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }} onClick={() => handleEdit(prop)}>
                              ✏️ Editar
                            </button>
                            <button className="btn btn-danger" style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }} onClick={() => handleDelete(prop.id)}>
                              🗑️ Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Propiedades;
