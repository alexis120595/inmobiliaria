import API_URL from '../../config';
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API = `${API_URL}/api`;

const Contactos = () => {
  const { getAuthHeaders } = useAuth();
  const [contactos, setContactos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  const fetchContactos = useCallback(async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch(`${API}/contactos`, {
        headers: getAuthHeaders()
      });
      const data = await res.json().catch(() => []);

      if (!res.ok) {
        throw new Error(data.error || 'No se pudieron cargar los contactos.');
      }

      setContactos(Array.isArray(data) ? data : []);
    } catch (error) {
      setErrorMessage(error.message || 'Error al cargar los contactos.');
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    fetchContactos();
  }, [fetchContactos]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm('¿Seguro que deseas eliminar esta consulta? Esta acción no se puede deshacer.');
    if (!confirmed) return;

    setDeleteLoadingId(id);
    try {
      const res = await fetch(`${API}/contactos/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'No se pudo eliminar el contacto.');
      }

      setContactos((prev) => prev.filter((contacto) => contacto.id !== id));
    } catch (error) {
      alert(error.message || 'Error al eliminar el contacto.');
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const formatDate = (fecha) => {
    if (!fecha) return 'Sin fecha';
    return new Date(fecha).toLocaleString('es-AR');
  };

  return (
    <div>
      <h1 className="page-title">Gestión de Contactos</h1>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <p style={{ margin: 0, color: '#6b7280' }}>
          Aquí puedes revisar todas las consultas enviadas desde el sitio y eliminarlas cuando ya fueron gestionadas.
        </p>
      </div>

      {loading && <p>Cargando contactos...</p>}
      {errorMessage && <p style={{ color: '#b91c1c' }}>{errorMessage}</p>}

      {!loading && !errorMessage && (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Propiedad</th>
                <th>Mensaje</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {contactos.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', color: '#6b7280' }}>
                    No hay consultas registradas.
                  </td>
                </tr>
              )}

              {contactos.map((contacto) => (
                <tr key={contacto.id}>
                  <td>{contacto.id}</td>
                  <td>{formatDate(contacto.fecha)}</td>
                  <td>{contacto.nombre || 'Sin nombre'}</td>
                  <td>{contacto.email || 'Sin email'}</td>
                  <td>{contacto.telefono || 'Sin teléfono'}</td>
                  <td>
                    {contacto.Propiedad ? (
                      <Link to={`/propiedades/${contacto.Propiedad.id}`} target="_blank" rel="noreferrer" style={{ color: '#ea580c', textDecoration: 'none', fontWeight: 600 }}>
                        {contacto.Propiedad.titulo || `Propiedad #${contacto.Propiedad.id}`}
                      </Link>
                    ) : (
                      'Consulta general'
                    )}
                  </td>
                  <td style={{ maxWidth: '320px', whiteSpace: 'normal', lineHeight: 1.4 }}>
                    {contacto.mensaje || 'Sin mensaje'}
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(contacto.id)}
                      disabled={deleteLoadingId === contacto.id}
                    >
                      {deleteLoadingId === contacto.id ? 'Eliminando...' : 'Eliminar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Contactos;
