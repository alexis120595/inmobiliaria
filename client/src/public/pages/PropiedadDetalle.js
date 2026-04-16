import API_URL from '../../config';
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const PropiedadDetalle = () => {
  const { id } = useParams();
  const [propiedad, setPropiedad] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/propiedades/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setPropiedad(null);
        } else {
          setPropiedad(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching property data:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ fontSize: '1.2rem', color: '#64748b' }}>Cargando detalle de propiedad...</p>
      </div>
    );
  }

  if (!propiedad) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h1 style={{ color: '#1e293b' }}>Propiedad no encontrada</h1>
        <Link to="/propiedades" style={{ color: '#2563eb', textDecoration: 'none', marginTop: '20px', fontWeight: 600 }}>← Volver a Propiedades</Link>
      </div>
    );
  }

  const direccionCompleta = [propiedad.localidad, propiedad.provincia, propiedad.pais].filter(Boolean).join(', ');
  const currentImgs = propiedad.imagenes || [];
  const mainImage = selectedImageUrl || (currentImgs.length > 0 ? currentImgs[0].url : '');
  const smallImages = currentImgs.filter(img => img.url !== mainImage).slice(0, 4);

  return (
    <div style={{ backgroundColor: '#f8fafc', paddingBottom: '60px', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Contenedor principal centrado */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', paddingTop: '30px' }}>
        
        {/* Breadcrumbs y Acciones superiores */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', marginBottom: '15px' }}>
          <div style={{ color: '#64748b' }}>
            <Link to="/" style={{ color: '#dc2626', textDecoration: 'none' }}>Home</Link> &gt; <Link to="/propiedades" style={{ color: '#dc2626', textDecoration: 'none' }}>{propiedad.tipo_propiedad ? propiedad.tipo_propiedad.charAt(0).toUpperCase() + propiedad.tipo_propiedad.slice(1) + 's' : 'Propiedades'}</Link> &gt; <span style={{ color: '#1e293b' }}>{propiedad.titulo}</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
             <button style={{ border: '1px solid #cbd5e1', background: '#fff', borderRadius: '4px', padding: '5px 10px', color: '#475569', cursor: 'pointer' }}>♡</button>
             <button style={{ border: '1px solid #cbd5e1', background: '#fff', borderRadius: '4px', padding: '5px 10px', color: '#475569', cursor: 'pointer' }}>🔗</button>
             <button style={{ border: '1px solid #cbd5e1', background: '#fff', borderRadius: '4px', padding: '5px 10px', color: '#475569', cursor: 'pointer' }}>🖨️</button>
          </div>
        </div>

        {/* Título y Precio */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '5px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b', margin: '0 0 10px 0', flex: '1 1 60%' }}>{propiedad.titulo}</h1>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b', margin: '0 0 10px 0' }}>{propiedad.moneda || 'U$D'} {propiedad.precio ? Number(propiedad.precio).toLocaleString('es-AR') : 'Consultar'}</h2>
        </div>

        {/* Ubicación y Badge */}
        <div style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '5px' }}>
            <span style={{ marginRight: '8px' }}>📍</span>
            <span>{propiedad.direccion ? `${propiedad.direccion} | ` : ''}{direccionCompleta}</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '10px' }}>ID: {propiedad.id}</div>
          <div style={{ display: 'inline-block', backgroundColor: '#334155', color: '#fff', fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '4px', letterSpacing: '1px' }}>
            {propiedad.operacion ? propiedad.operacion.toUpperCase() : 'VENTA'}
          </div>
        </div>

        {/* Galería de Imágenes */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px', height: '450px', marginBottom: '30px' }}>
          <div style={{ 
            backgroundColor: '#e2e8f0', 
            borderRadius: '8px 0 0 8px', 
            backgroundImage: mainImage ? `url(${mainImage})` : 'none', 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            transition: 'background-image 0.3s ease-in-out',
            height: '100%' 
          }}>
            {!mainImage && <div style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center', color: '#94a3b8' }}>Sin imagen</div>}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '10px', height: '100%' }}>
            {[0, 1, 2, 3].map(index => {
               const img = smallImages[index];
               const isLast = index === 3;
               return (
                 <div key={index} 
                   onClick={() => img && setSelectedImageUrl(img.url)}
                   style={{ 
                   backgroundColor: '#e2e8f0', 
                   backgroundImage: img ? `url(${img.url})` : 'none', 
                   backgroundSize: 'cover', 
                   backgroundPosition: 'center',
                   borderRadius: index === 1 ? '0 8px 0 0' : index === 3 ? '0 0 8px 0' : '0',
                   position: 'relative',
                   cursor: img ? 'pointer' : 'default'
                 }}>
                    {isLast && currentImgs.length > 5 && (
                      <div style={{ position: 'absolute', bottom: '15px', right: '15px', backgroundColor: 'rgba(255,255,255,0.9)', padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
                        📷 {currentImgs.length} fotos
                      </div>
                    )}
                 </div>
               )
            })}
          </div>
        </div>

        {/* Layout Dos Columnas */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px', alignItems: 'start' }}>
          
          {/* Columna Izquierda (Contenido) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* Visión General */}
            <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', marginBottom: '25px', marginTop: 0 }}>Visión general</h3>
              
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: '2', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '25px 15px' }}>
                  
                  <div>
                    <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{fontSize: '1.2rem', color: '#64748b'}}>🏠</span> {propiedad.tipo_propiedad ? (propiedad.tipo_propiedad.charAt(0).toUpperCase() + propiedad.tipo_propiedad.slice(1)) : 'Casa'}</div>
                    <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Tipo de inmueble</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{fontSize: '1.2rem', color: '#64748b'}}>🛏️</span> {propiedad.dormitorios || 0}</div>
                    <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Dormitorios</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{fontSize: '1.2rem', color: '#64748b'}}>🚿</span> {propiedad.banos || 0}</div>
                    <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Baños</div>
                  </div>
                  
                  <div>
                    <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{fontSize: '1.2rem', color: '#64748b'}}>🪴</span> {propiedad.plantas || 1}</div>
                    <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Plantas</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{fontSize: '1.2rem', color: '#64748b'}}>📐</span> {propiedad.superficie_cubierta || 0} M2</div>
                    <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Cubiertos</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{fontSize: '1.2rem', color: '#64748b'}}>🗺️</span> {propiedad.superficie_total || 0} M2</div>
                    <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Totales</div>
                  </div>

                  <div>
                    <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{fontSize: '1.2rem', color: '#64748b'}}>🚪</span> {propiedad.ambientes || 0}</div>
                    <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Habitaciones</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{fontSize: '1.2rem', color: '#64748b'}}>🚗</span> {propiedad.garaje || 0}</div>
                    <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Garajes</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{fontSize: '1.2rem', color: '#64748b'}}>🧭</span> {propiedad.orientacion || 'Norte'}</div>
                    <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Orientación</div>
                  </div>

                  <div>
                    <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{fontSize: '1.2rem', color: '#64748b'}}>✨</span> {propiedad.condicion || 'Excelente'}</div>
                    <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Condición</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{fontSize: '1.2rem', color: '#64748b'}}>⏳</span> {propiedad.antiguedad || 0}</div>
                    <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Antigüedad</div>
                  </div>
                </div>

                {/* Mapa placeholder derecho */}
                <div style={{ flex: '1', minHeight: '200px', backgroundColor: '#e2e8f0', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
                  <img src="https://static.vecteezy.com/system/resources/previews/000/153/588/original/vector-road-map-concept-flat-style.jpg" alt="Map" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '2rem', color: '#2563eb' }}>
                    <span style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>📍</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', marginBottom: '20px', marginTop: 0 }}>Descripción</h3>
              <div style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                {propiedad.descripcion || 'Propiedad sin descripción detallada proporcionada.'}
              </div>
            </div>

            {/* Características / Amenidades */}
            <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', marginBottom: '25px', marginTop: 0 }}>Características</h3>
              {propiedad.Caracteristicas && propiedad.Caracteristicas.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                  {propiedad.Caracteristicas.map(carac => (
                    <div key={carac.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475569', fontSize: '0.95rem' }}>
                      <span style={{ color: '#2563eb' }}>✓</span> {carac.nombre}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.95rem' }}>No hay características especiales listadas para esta propiedad.</p>
              )}
            </div>
            
          </div>

          {/* Columna Derecha (Sidebar Sticky Form) */}
          <div style={{ position: 'sticky', top: '20px' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', borderTop: '4px solid var(--primary-color)' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '25px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#f1f5f9', backgroundImage: propiedad.Usuario && propiedad.Usuario.foto_url ? `url(${propiedad.Usuario.foto_url})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', marginRight: '15px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                   {(!propiedad.Usuario || !propiedad.Usuario.foto_url) && <span style={{ fontSize: '1.5rem', color: '#94a3b8' }}>👤</span>}
                </div>
                <div>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '1.05rem', color: '#1e293b' }}>{propiedad.Usuario ? propiedad.Usuario.nombre : 'Agente Autorizado'}</h4>
                  <a href="#" style={{ color: '#dc2626', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600 }}>Ver anuncios</a>
                </div>
              </div>

              <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input type="text" placeholder="Nombre" style={{ padding: '12px 15px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }} required />
                <input type="tel" placeholder="Teléfono" style={{ padding: '12px 15px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }} required />
                <input type="email" placeholder="Correo" style={{ padding: '12px 15px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }} required />
                <textarea placeholder="Mensaje..." rows="4" style={{ padding: '12px 15px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.9rem', resize: 'none', outline: 'none' }} defaultValue={`Hola, me interesa agendar una visita para la propiedad con ID ${propiedad.id}`}></textarea>
                
                <select style={{ padding: '12px 15px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.9rem', backgroundColor: '#fff', color: '#64748b', outline: 'none' }}>
                  <option value="">Soy un(a)...</option>
                  <option value="comprador">Comprador interesado</option>
                  <option value="colega">Colega Inmobiliario</option>
                </select>

                <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '5px 0', lineHeight: 1.4 }}>
                  Al enviar el formulario, estoy de acuerdo con los <a href="#" style={{ color: '#dc2626', textDecoration: 'none' }}>Términos de uso</a>.
                </p>

                <button type="button" className="btn-primary" style={{ padding: '14px', borderRadius: '4px', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '1rem', marginTop: '5px', width: '100%', boxSizing: 'border-box' }}>
                  Enviar mensaje
                </button>
              </form>
            </div>
          </div>

        </div>
        
      </div>
    </div>
  );
};

export default PropiedadDetalle;
