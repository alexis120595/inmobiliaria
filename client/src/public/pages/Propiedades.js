import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import API_URL from '../../config';
import MapaPropiedades from '../components/MapaPropiedades';

const Propiedades = () => {
  const [propiedades, setPropiedades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vistaActual, setVistaActual] = useState('lista'); // 'lista' | 'mapa'
  const location = useLocation();
  const navigate = useNavigate();

  // Leer filtros desde la URL
  const searchParams = new URLSearchParams(location.search);
  const urlTipo = searchParams.get('tipo') || '';
  const urlOperacion = searchParams.get('operacion') || '';
  const urlUbicacion = searchParams.get('ubicacion') || '';
  const urlDormitorios = searchParams.get('dormitorios') || '';

  // Estado local de los campos del formulario (se sincroniza con la URL)
  const [filtroUbicacion, setFiltroUbicacion] = useState(urlUbicacion);
  const [filtroOperacion, setFiltroOperacion] = useState(urlOperacion);
  const [filtroTipo, setFiltroTipo] = useState(urlTipo);
  const [filtroDormitorios, setFiltroDormitorios] = useState(urlDormitorios);

  // Sincronizar estado local cuando la URL cambia (por ej. al venir del Home)
  useEffect(() => {
    setFiltroUbicacion(urlUbicacion);
    setFiltroOperacion(urlOperacion);
    setFiltroTipo(urlTipo);
    setFiltroDormitorios(urlDormitorios);
  }, [urlUbicacion, urlOperacion, urlTipo, urlDormitorios]);

  useEffect(() => {
    const fetchPropiedades = async () => {
      try {
        const res = await fetch(`${API_URL}/api/propiedades`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setPropiedades(data);
        }
      } catch (err) {
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPropiedades();
  }, []);

  // Filtrado basado en la URL (no en el estado local del form)
  const propiedadesFiltradas = useMemo(() => {
    return propiedades.filter(p => {
      // Filtro por tipo de propiedad
      if (urlTipo && (!p.tipo_propiedad || p.tipo_propiedad.toLowerCase() !== urlTipo.toLowerCase())) {
        return false;
      }

      // Filtro por operación
      if (urlOperacion && (!p.operacion || p.operacion.toLowerCase() !== urlOperacion.toLowerCase())) {
        return false;
      }

      // Filtro por ubicación (busca en dirección, localidad, provincia, país y título)
      if (urlUbicacion) {
        const termino = urlUbicacion.toLowerCase();
        const campos = [p.direccion, p.localidad, p.provincia, p.pais, p.titulo].filter(Boolean);
        const coincide = campos.some(campo => campo.toLowerCase().includes(termino));
        if (!coincide) return false;
      }

      // Filtro por dormitorios mínimos
      if (urlDormitorios) {
        const minDorm = Number(urlDormitorios);
        if (!p.dormitorios || Number(p.dormitorios) < minDorm) {
          return false;
        }
      }

      return true;
    });
  }, [propiedades, urlTipo, urlOperacion, urlUbicacion, urlDormitorios]);

  const hayFiltrosActivos = urlTipo || urlOperacion || urlUbicacion || urlDormitorios;

  // Aplicar filtros: actualiza la URL con los valores del formulario
  const aplicarFiltros = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (filtroUbicacion.trim()) params.set('ubicacion', filtroUbicacion.trim());
    if (filtroOperacion) params.set('operacion', filtroOperacion);
    if (filtroTipo) params.set('tipo', filtroTipo);
    if (filtroDormitorios) params.set('dormitorios', filtroDormitorios);
    const queryString = params.toString();
    navigate(queryString ? `/propiedades?${queryString}` : '/propiedades', { replace: true });
  };

  // Limpiar todos los filtros
  const limpiarFiltros = () => {
    setFiltroUbicacion('');
    setFiltroOperacion('');
    setFiltroTipo('');
    setFiltroDormitorios('');
    navigate('/propiedades', { replace: true });
  };

  const getDaysAgo = (dateString) => {
    if (!dateString) return '';
    const diffTime = Math.abs(new Date() - new Date(dateString));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'hoy';
    if (diffDays === 1) return 'hace 1 día';
    return `hace ${diffDays} días`;
  };

  return (
    <div className="page-container" style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', paddingBottom: '40px' }}>
      <div className="page-header" style={{ paddingTop: '40px' }}>
        <h1 className="page-title">Todas las Propiedades</h1>
        <p className="page-subtitle">Explora nuestro catálogo completo y encuentra el lugar ideal para ti.</p>
      </div>

      <div className="properties-search-section">
        <form className="catalog-search-form" onSubmit={aplicarFiltros}>
          <div className="search-field">
            <label>Ubicación / Palabra clave</label>
            <div className="input-with-icon">
              <span className="icon">📍</span>
              <input
                type="text"
                placeholder="¿Dónde buscas?"
                value={filtroUbicacion}
                onChange={(e) => setFiltroUbicacion(e.target.value)}
              />
            </div>
          </div>
          
          <div className="search-field">
            <label>Operación</label>
            <select value={filtroOperacion} onChange={(e) => setFiltroOperacion(e.target.value)}>
              <option value="">Todas</option>
              <option value="venta">Venta</option>
              <option value="alquiler">Alquiler</option>
            </select>
          </div>

          <div className="search-field">
            <label>Tipo Inmueble</label>
            <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
              <option value="">Cualquiera</option>
              <option value="casa">Casa</option>
              <option value="departamento">Departamento</option>
              <option value="terreno">Terreno</option>
            </select>
          </div>
          
          <div className="search-field">
            <label>Hab.</label>
            <select value={filtroDormitorios} onChange={(e) => setFiltroDormitorios(e.target.value)}>
              <option value="">Todas</option>
              <option value="1">1 o más</option>
              <option value="2">2 o más</option>
              <option value="3">3 o más</option>
              <option value="4">4 o más</option>
            </select>
          </div>

          <button type="submit" className="btn-primary search-action-btn">
            🔍 Filtrar
          </button>
        </form>

        {/* Indicador de filtros activos */}
        {hayFiltrosActivos && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            flexWrap: 'wrap',
            marginTop: '1rem',
            padding: '0.75rem 1rem',
            background: '#fff',
            borderRadius: '10px',
            maxWidth: '900px',
            margin: '1rem auto 0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Filtros activos:</span>
            {urlUbicacion && (
              <span style={{ padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, background: '#dbeafe', color: '#1e40af' }}>
                📍 {urlUbicacion}
              </span>
            )}
            {urlTipo && (
              <span style={{ padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, background: '#fef3c7', color: '#92400e', textTransform: 'capitalize' }}>
                🏠 {urlTipo}
              </span>
            )}
            {urlOperacion && (
              <span style={{ padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, background: '#d1fae5', color: '#065f46', textTransform: 'capitalize' }}>
                🏷️ {urlOperacion}
              </span>
            )}
            {urlDormitorios && (
              <span style={{ padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, background: '#ede9fe', color: '#5b21b6' }}>
                🛏️ {urlDormitorios}+ hab.
              </span>
            )}
            <button
              type="button"
              onClick={limpiarFiltros}
              style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 600,
                background: '#fee2e2',
                color: '#991b1b',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
            >
              ✕ Limpiar
            </button>
          </div>
        )}
      </div>

      {/* Contador de resultados + Toggle de vista */}
      {!loading && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          maxWidth: '1200px', 
          margin: '1rem auto 0.5rem',
          padding: '0 20px'
        }}>
          <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
            {propiedadesFiltradas.length} {propiedadesFiltradas.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
            {hayFiltrosActivos ? ' con los filtros aplicados' : ''}
          </span>

          {/* Toggle Lista / Mapa */}
          <div className="vista-toggle" id="vista-toggle">
            <button
              className={`vista-toggle-btn ${vistaActual === 'lista' ? 'active' : ''}`}
              onClick={() => setVistaActual('lista')}
              id="btn-vista-lista"
            >
              <span className="vista-toggle-icon">📋</span>
              Lista
            </button>
            <button
              className={`vista-toggle-btn ${vistaActual === 'mapa' ? 'active' : ''}`}
              onClick={() => setVistaActual('mapa')}
              id="btn-vista-mapa"
            >
              <span className="vista-toggle-icon">🗺️</span>
              Mapa
            </button>
          </div>
        </div>
      )}

      {/* VISTA MAPA */}
      {vistaActual === 'mapa' && !loading && (
        <div style={{ maxWidth: '1200px', margin: '1rem auto', padding: '0 20px' }}>
          <MapaPropiedades 
            propiedades={propiedadesFiltradas} 
            height="500px"
          />
        </div>
      )}

      {/* VISTA LISTA (Grid de cards) */}
      <div className="properties-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
        gap: '30px', 
        paddingTop: '20px',
        maxWidth: '1200px',
        margin: '0 auto' 
      }}>
        {loading ? (
          <p style={{ textAlign: 'center', gridColumn: '1/-1' }}>Cargando propiedades...</p>
        ) : propiedadesFiltradas.length === 0 ? (
          <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '3rem 1rem' }}>
            <p style={{ fontSize: '1.2rem', color: '#64748b', marginBottom: '1rem' }}>
              No se encontraron propiedades con los filtros seleccionados.
            </p>
            {hayFiltrosActivos && (
              <button
                onClick={limpiarFiltros}
                style={{
                  padding: '0.5rem 1.5rem',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  background: '#3b82f6',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Ver todas las propiedades
              </button>
            )}
          </div>
        ) : (
          propiedadesFiltradas.map((item) => (
            <div key={item.id} className="property-card" style={{ 
              backgroundColor: '#fff', 
              borderRadius: '8px', 
              overflow: 'hidden', 
              boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
              display: 'flex', 
              flexDirection: 'column',
              transition: 'all 0.3s ease',
              border: '1px solid #f0f0f0'
            }}>
              <Link to={`/propiedades/${item.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                
                {/* Imagen y Gradiente Superior */}
                <div style={{ position: 'relative', height: '260px' }}>
                   {item.imagenes && item.imagenes.length > 0 ? (
                      <div style={{ width: '100%', height: '100%', backgroundImage: `url(${item.imagenes[0].url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                   ) : (
                      <div style={{ width: '100%', height: '100%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>Sin imagen asignada</div>
                   )}
                   
                   {/* Operación Venta/Alquiler (badge derecho superior como en fotos clásicas) */}
                   <div style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: 'rgba(0,0,0,0.7)', color: '#fff', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px' }}>
                      {item.operacion ? item.operacion.toUpperCase() : 'VENTA'}
                   </div>
                   
                   {/* Gradiente oscuro inferior */}
                   <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}></div>
                   
                   {/* Precio (bottom left) */}
                   <div style={{ position: 'absolute', bottom: '15px', left: '20px', color: '#fff', fontSize: '1.6rem', fontWeight: 800 }}>
                     {item.moneda || 'U$D'} {item.precio ? Number(item.precio).toLocaleString('es-AR') : 'Consultar'}
                   </div>
                   
                   {/* Ícono de expandir (bottom right) */}
                   <div style={{ position: 'absolute', bottom: '15px', right: '20px', color: '#fff', fontSize: '1.4rem' }}>
                     ⤢
                   </div>
                </div>

                {/* Contenedor central info */}
                <div style={{ padding: '25px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1a202c', margin: '0 0 12px 0', lineHeight: 1.3 }}>{item.titulo}</h3>
                  
                  <div style={{ display: 'flex', alignItems: 'flex-start', color: '#64748b', fontSize: '0.95rem', marginBottom: '20px', lineHeight: 1.5 }}>
                    <span style={{ marginRight: '6px', fontSize: '1rem', marginTop: '1px' }}>📍</span>
                    <span>{item.direccion ? `${item.direccion} | ` : ''}{[item.localidad, item.provincia, item.pais].filter(Boolean).join(', ')}</span>
                  </div>
                  
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '0.5px' }}>
                    {item.tipo_propiedad || 'CASA'}
                  </div>

                  {/* Iconos de ambiente grid flex */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '25px', marginLeft: '-15px' }}>
                    {item.superficie_total > 0 && (
                      <div style={{ padding: '0 15px', borderRight: '1px solid #e2e8f0', marginBottom: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1.25rem', color: '#1e293b', fontWeight: 500 }}>
                          {item.superficie_total} <span>🗺️</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>M2</div>
                      </div>
                    )}
                    {item.superficie_cubierta > 0 && (
                      <div style={{ padding: '0 15px', borderRight: '1px solid #e2e8f0', marginBottom: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1.25rem', color: '#1e293b', fontWeight: 500 }}>
                          {item.superficie_cubierta} <span>📐</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>M2</div>
                      </div>
                    )}
                    {item.garaje > 0 && (
                      <div style={{ padding: '0 15px', borderRight: '1px solid #e2e8f0', marginBottom: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1.25rem', color: '#1e293b', fontWeight: 500 }}>
                          {item.garaje} <span>🚗</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>Garajes</div>
                      </div>
                    )}
                    {item.ambientes > 0 && (
                      <div style={{ padding: '0 15px', borderRight: 'none', marginBottom: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1.25rem', color: '#1e293b', fontWeight: 500 }}>
                          {item.ambientes} <span>🚪</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>Habitaciones</div>
                      </div>
                    )}
                    
                    {/* Fila inferior de amenities en card */}
                    <div style={{ width: '100%', height: 0 }}></div>
                    
                    {item.dormitorios > 0 && (
                      <div style={{ padding: '0 15px', borderRight: '1px solid #e2e8f0', marginTop: '5px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1.25rem', color: '#1e293b', fontWeight: 500 }}>
                          {item.dormitorios} <span>🛏️</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>Dormitorios</div>
                      </div>
                    )}
                    {item.banos > 0 && (
                      <div style={{ padding: '0 15px', borderRight: 'none', marginTop: '5px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1.25rem', color: '#1e293b', fontWeight: 500 }}>
                          {item.banos} <span>🚿</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>Baños</div>
                      </div>
                    )}
                  </div>

                  <div style={{ flexGrow: 1 }}></div>
                  
                  {/* Footer agente y tiempo */}
                  <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#f1f5f9', backgroundImage: item.Usuario && item.Usuario.foto_url ? `url(${item.Usuario.foto_url})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', marginRight: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                        {(!item.Usuario || !item.Usuario.foto_url) && <span>👤</span>}
                      </div>
                      <span style={{ fontSize: '0.95rem', color: '#475569', fontWeight: 500 }}>
                        {item.Usuario ? item.Usuario.nombre : 'Agente Autorizado'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>📎</span> {getDaysAgo(item.fecha_publicacion)}
                    </div>
                  </div>

                  {/* ID */}
                  <div style={{ textAlign: 'center', fontSize: '0.9rem', color: '#64748b', marginTop: '20px' }}>
                    <span style={{ fontWeight: 700, color: '#475569' }}>ID:</span> {item.id}
                  </div>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Propiedades;
