import API_URL from '../../config';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const API = `${API_URL}/api`;

const MAX_IMAGENES = 10;

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
  caracteristicas: []
};

const Propiedades = () => {
  const { getAuthHeaders } = useAuth();
  const [propiedades, setPropiedades] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [caracteristicasBD, setCaracteristicasBD] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [archivos, setArchivos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [editId, setEditId] = useState(null);
  const [vista, setVista] = useState('formulario');
  const fileInputRef = useRef(null);

  const fetchData = useCallback(async () => {
    const res = await fetch(`${API}/propiedades`);
    const data = await res.json();
    setPropiedades(data);
  }, []);

  const fetchUsuarios = useCallback(async () => {
    const res = await fetch(`${API}/usuarios`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    setUsuarios(data.filter(u => u.rol === 'agente'));
  }, [getAuthHeaders]);

  const fetchCaracteristicas = useCallback(async () => {
    const res = await fetch(`${API}/caracteristicas`);
    const data = await res.json();
    setCaracteristicasBD(data);
  }, []);

  useEffect(() => {
    fetchData();
    fetchUsuarios();
    fetchCaracteristicas();
  }, [fetchData, fetchUsuarios, fetchCaracteristicas]);

  // Liberar URLs de objeto al desmontar o al cambiar previews
  useEffect(() => {
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = e => {
    const nuevosArchivos = Array.from(e.target.files).slice(0, MAX_IMAGENES);
    // Si ya hay archivos seleccionados, combinar hasta el límite
    const combinados = [...archivos, ...nuevosArchivos].slice(0, MAX_IMAGENES);
    // Revocar previews anteriores antes de reemplazar
    previews.forEach(url => URL.revokeObjectURL(url));
    const nuevasPreviews = combinados.map(f => URL.createObjectURL(f));
    setArchivos(combinados);
    setPreviews(nuevasPreviews);
    // Reset input para permitir re-seleccionar los mismos archivos
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index) => {
    URL.revokeObjectURL(previews[index]);
    setArchivos(archivos.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
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

  const resetForm = () => {
    setForm(initialForm);
    previews.forEach(url => URL.revokeObjectURL(url));
    setArchivos([]);
    setPreviews([]);
    setEditId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `${API}/propiedades/${editId}` : `${API}/propiedades`;

    const formData = new FormData();

    const { caracteristicas, ...payload } = form;

    // Agregar campos de texto al FormData
    Object.keys(payload).forEach(key => {
      formData.append(key, payload[key] === undefined ? '' : payload[key]);
    });

    // Agregar características
    if (caracteristicas && Array.isArray(caracteristicas)) {
      caracteristicas.forEach(c => formData.append('caracteristicas[]', c));
    }

    // Agregar archivos físicos (hasta 10)
    archivos.forEach(file => {
      formData.append('imagenes_archivos', file);
    });

    try {
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert('Error al guardar: ' + (errorData.error || 'Verifica los campos ingresados.'));
        return;
      }

      resetForm();
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
      caracteristicas: prop.Caracteristicas ? prop.Caracteristicas.map(c => c.id) : []
    });
    setEditId(prop.id);
    previews.forEach(url => URL.revokeObjectURL(url));
    setArchivos([]);
    setPreviews([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setVista('formulario');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta propiedad? Esta acción no se puede deshacer.')) return;
    try {
      const res = await fetch(`${API}/propiedades/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
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

  const puedeAgregarMas = archivos.length < MAX_IMAGENES;

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
            <button className="btn btn-primary" onClick={() => { setVista('formulario'); resetForm(); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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

            {/* ===== SECCIÓN DE IMÁGENES ===== */}
            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Imágenes</h3>
                <span style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  background: archivos.length >= MAX_IMAGENES ? '#fee2e2' : '#dbeafe',
                  color: archivos.length >= MAX_IMAGENES ? '#991b1b' : '#1e40af'
                }}>
                  {archivos.length} / {MAX_IMAGENES} imágenes
                </span>
              </div>

              {/* Zona de drop / input */}
              {puedeAgregarMas && (
                <label
                  htmlFor="imagenes_archivos_input"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    border: '2px dashed var(--border-color, #d1d5db)',
                    borderRadius: '12px',
                    padding: '2rem',
                    cursor: 'pointer',
                    background: 'var(--bg-secondary, #f9fafb)',
                    transition: 'border-color 0.2s, background 0.2s',
                    marginBottom: previews.length > 0 ? '1rem' : 0
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary, #3b82f6)'; e.currentTarget.style.background = 'var(--bg-hover, #eff6ff)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color, #d1d5db)'; e.currentTarget.style.background = 'var(--bg-secondary, #f9fafb)'; }}
                >
                  <span style={{ fontSize: '2rem' }}>🖼️</span>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                    Hacé clic para agregar imágenes
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted, #6b7280)' }}>
                    Podés seleccionar varias a la vez · Máximo {MAX_IMAGENES} en total
                  </span>
                  <input
                    id="imagenes_archivos_input"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </label>
              )}

              {/* Grid de miniaturas */}
              {previews.length > 0 && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                  gap: '0.75rem',
                  marginTop: puedeAgregarMas ? 0 : '0.5rem'
                }}>
                  {previews.map((src, index) => (
                    <div key={index} style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-color, #e5e7eb)', aspectRatio: '1' }}>
                      <img
                        src={src}
                        alt={`preview-${index}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                      {/* Overlay con número de orden */}
                      <span style={{
                        position: 'absolute',
                        bottom: '4px',
                        left: '6px',
                        background: 'rgba(0,0,0,0.55)',
                        color: '#fff',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: '10px'
                      }}>
                        #{index + 1}
                      </span>
                      {/* Botón eliminar */}
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        style={{
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
                          background: 'rgba(239,68,68,0.9)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '50%',
                          width: '22px',
                          height: '22px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          lineHeight: 1,
                          transition: 'background 0.2s'
                        }}
                        title="Quitar imagen"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  {/* Celda "Agregar más" dentro de la grilla cuando ya hay imágenes y hay lugar */}
                  {puedeAgregarMas && (
                    <label
                      htmlFor="imagenes_archivos_input"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.25rem',
                        border: '2px dashed var(--border-color, #d1d5db)',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        background: 'var(--bg-secondary, #f9fafb)',
                        aspectRatio: '1',
                        transition: 'border-color 0.2s'
                      }}
                      title="Agregar más imágenes"
                    >
                      <span style={{ fontSize: '1.5rem' }}>➕</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted, #6b7280)', textAlign: 'center' }}>Agregar</span>
                    </label>
                  )}
                </div>
              )}

              {/* Aviso si editando propiedad ya tiene imágenes */}
              {editId && archivos.length === 0 && (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted, #6b7280)', marginTop: '0.5rem', fontStyle: 'italic' }}>
                  💡 Si no subís nuevas imágenes, las imágenes actuales de la propiedad se conservarán.
                </p>
              )}
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
              <button className="btn btn-secondary" type="button" onClick={resetForm}>Limpiar</button>
              {editId && (
                <button className="btn btn-secondary" type="button" onClick={resetForm}>Cancelar Edición</button>
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
