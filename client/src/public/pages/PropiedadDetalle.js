import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API_URL from '../../config';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para el ícono de marcador de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const detailMarkerIcon = new L.DivIcon({
  className: 'custom-property-marker',
  html: `<div class="marker-pin"><span>📍</span></div>`,
  iconSize: [40, 48],
  iconAnchor: [20, 48],
  popupAnchor: [0, -48],
});

const normalizePhoneForWhatsApp = (phoneRaw) => {
  const digits = String(phoneRaw || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('549')) return digits;
  if (digits.startsWith('54')) return `549${digits.slice(2)}`;
  if (digits.startsWith('0')) return `549${digits.slice(1)}`;
  if (digits.length === 10) return `549${digits}`;
  return digits;
};

const getImageUrl = (img) => {
  if (!img) return '';
  if (typeof img === 'string') return img;
  return img.url || img.secure_url || img.imagen_url || img.path || '';
};

const PropiedadDetalle = () => {
  const { id } = useParams();
  const [propiedad, setPropiedad] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [contactForm, setContactForm] = useState({
    nombre: '',
    telefono: '',
    email: '',
    mensaje: '',
    rol: ''
  });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState('');
  const [contactError, setContactError] = useState('');
  const [contactChannels, setContactChannels] = useState(null);

  useEffect(() => {
    const fetchPropiedad = async () => {
      try {
        const res = await fetch(`${API_URL}/api/propiedades/${id}`);
        const data = await res.json();
        setPropiedad(data && data.id ? data : null);
      } catch (err) {
        console.error('Error fetching property:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPropiedad();
  }, [id]);

  useEffect(() => {
    // Evita arrastrar selección de imágenes al navegar entre propiedades.
    setSelectedImageUrl(null);
    setIsLightboxOpen(false);
    setLightboxIndex(0);
  }, [id]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const rawFavorites = window.localStorage.getItem('favoriteProperties');
      const parsedFavorites = rawFavorites ? JSON.parse(rawFavorites) : [];
      const favoriteIds = Array.isArray(parsedFavorites) ? parsedFavorites.map(String) : [];
      setIsFavorite(favoriteIds.includes(String(id)));
    } catch (error) {
      console.error('Error reading favorite properties:', error);
      setIsFavorite(false);
    }

    setActionMessage('');
  }, [id]);

  useEffect(() => {
    if (!actionMessage) return undefined;

    const timeoutId = window.setTimeout(() => {
      setActionMessage('');
    }, 2800);

    return () => window.clearTimeout(timeoutId);
  }, [actionMessage]);

  const currentImgsLength = Array.isArray(propiedad?.imagenes) ? propiedad.imagenes.length : 0;

  useEffect(() => {
    if (!isLightboxOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsLightboxOpen(false);
      }
      if (event.key === 'ArrowLeft' && currentImgsLength > 1) {
        setLightboxIndex((prev) => (prev - 1 + currentImgsLength) % currentImgsLength);
      }
      if (event.key === 'ArrowRight' && currentImgsLength > 1) {
        setLightboxIndex((prev) => (prev + 1) % currentImgsLength);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isLightboxOpen, currentImgsLength]);

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
  const agenteAsignado = propiedad.Usuario || null;
  const getOrdenSeguro = (img) => {
    const orden = Number(img?.orden);
    return Number.isFinite(orden) ? orden : Number.MAX_SAFE_INTEGER;
  };

  const getIdSeguro = (img) => {
    const id = Number(img?.id);
    return Number.isFinite(id) ? id : Number.MAX_SAFE_INTEGER;
  };

  const currentImgs = (Array.isArray(propiedad.imagenes) ? propiedad.imagenes : [])
    .map((img) => ({ ...img, url: getImageUrl(img) }))
    .filter((img) => Boolean(img.url))
    .sort((a, b) => (getOrdenSeguro(a) - getOrdenSeguro(b)) || (getIdSeguro(a) - getIdSeguro(b)));
  const selectedExists = currentImgs.some((img) => img.url === selectedImageUrl);
  const mainImage = selectedExists ? selectedImageUrl : (currentImgs.length > 0 ? currentImgs[0].url : '');
  const smallImages = currentImgs.filter(img => img.url !== mainImage).slice(0, 4);

  const openLightboxByUrl = (url) => {
    const index = currentImgs.findIndex((img) => img.url === url);
    const nextIndex = index >= 0 ? index : 0;
    if (!currentImgs[nextIndex]?.url) return;
    setLightboxIndex(nextIndex);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => setIsLightboxOpen(false);

  const goToPreviousImage = () => {
    if (currentImgs.length < 2) return;
    setLightboxIndex((prev) => (prev - 1 + currentImgs.length) % currentImgs.length);
  };

  const goToNextImage = () => {
    if (currentImgs.length < 2) return;
    setLightboxIndex((prev) => (prev + 1) % currentImgs.length);
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFavoriteToggle = () => {
    if (typeof window === 'undefined') return;

    try {
      const rawFavorites = window.localStorage.getItem('favoriteProperties');
      const parsedFavorites = rawFavorites ? JSON.parse(rawFavorites) : [];
      const favoriteIds = Array.isArray(parsedFavorites) ? parsedFavorites.map(String) : [];
      const propertyId = String(id);
      const nextFavorites = isFavorite
        ? favoriteIds.filter((favoriteId) => favoriteId !== propertyId)
        : Array.from(new Set([...favoriteIds, propertyId]));

      window.localStorage.setItem('favoriteProperties', JSON.stringify(nextFavorites));
      setIsFavorite(!isFavorite);
      setActionMessage(isFavorite ? 'Propiedad quitada de favoritos.' : 'Propiedad guardada en favoritos.');
    } catch (error) {
      console.error('Error updating favorite properties:', error);
      setActionMessage('No se pudo actualizar favoritos.');
    }
  };

  const handleCopyLink = async () => {
    if (typeof window === 'undefined') return;

    const propertyUrl = window.location.href;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(propertyUrl);
      } else {
        const helperInput = document.createElement('input');
        helperInput.value = propertyUrl;
        document.body.appendChild(helperInput);
        helperInput.select();
        document.execCommand('copy');
        document.body.removeChild(helperInput);
      }

      setActionMessage('Link de la propiedad copiado.');
    } catch (error) {
      console.error('Error copying property link:', error);
      setActionMessage('No se pudo copiar el link.');
    }
  };

  const handlePrint = () => {
    if (typeof window === 'undefined') return;

    window.print();
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactLoading(true);
    setContactSuccess('');
    setContactError('');
    setContactChannels(null);

    const rolTexto = contactForm.rol ? `\n\nRol del contacto: ${contactForm.rol}` : '';
    const payload = {
      nombre: contactForm.nombre.trim(),
      telefono: contactForm.telefono.trim(),
      email: contactForm.email.trim(),
      propiedad_id: propiedad.id,
      mensaje: `${contactForm.mensaje.trim() || `Hola, me interesa agendar una visita para la propiedad con ID ${propiedad.id}`}${rolTexto}`
    };

    try {
      const res = await fetch(`${API_URL}/api/contactos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'No se pudo enviar la consulta de la propiedad.');
      }

      const agenteNombre = agenteAsignado?.nombre || 'agente';
      const telefonoWhatsapp = normalizePhoneForWhatsApp(agenteAsignado?.telefono);
      const whatsappMessage = [
        `Hola ${agenteNombre}, ¿como estas?`,
        `Soy ${payload.nombre} y quiero consultar por la propiedad "${propiedad.titulo}" (ID ${propiedad.id}).`,
        `Mi telefono: ${payload.telefono || 'No informado'}`,
        `Mi email: ${payload.email || 'No informado'}`,
        '',
        `Mensaje: ${payload.mensaje}`,
        '',
        `Link de referencia: ${window.location.href}`
      ].join('\n');

      const whatsappUrl = telefonoWhatsapp
        ? `https://wa.me/${telefonoWhatsapp}?text=${encodeURIComponent(whatsappMessage)}`
        : '';

      const emailSubject = `Consulta por propiedad: ${propiedad.titulo} (ID ${propiedad.id})`;
      const emailBody = [
        `Hola ${agenteNombre},`,
        '',
        `Mi nombre es ${payload.nombre} y quiero consultar por la propiedad "${propiedad.titulo}" (ID ${propiedad.id}).`,
        `Telefono: ${payload.telefono || 'No informado'}`,
        `Email: ${payload.email || 'No informado'}`,
        '',
        `Mensaje:`,
        payload.mensaje,
        '',
        `Link de referencia: ${window.location.href}`
      ].join('\n');

      const emailUrl = agenteAsignado?.email
        ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(agenteAsignado.email)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
        : '';

      setContactSuccess('Mensaje enviado correctamente. Te responderemos pronto.');
      setContactChannels({
        whatsappUrl,
        emailUrl,
        agenteNombre
      });
      setContactForm({
        nombre: '',
        telefono: '',
        email: '',
        mensaje: '',
        rol: ''
      });
    } catch (error) {
      setContactError(error.message || 'Ocurrió un error al enviar la consulta.');
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <div className="property-detail-page" style={{ backgroundColor: '#f8fafc', paddingBottom: '60px', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Contenedor principal centrado */}
      <div className="detail-page-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', paddingTop: '30px' }}>
        
        {/* Breadcrumbs y Acciones superiores */}
        <div className="detail-topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', marginBottom: '15px' }}>
          <div style={{ color: '#64748b' }}>
            <Link to="/" style={{ color: '#dc2626', textDecoration: 'none' }}>Home</Link> &gt; <Link to="/propiedades" style={{ color: '#dc2626', textDecoration: 'none' }}>{propiedad.tipo_propiedad ? propiedad.tipo_propiedad.charAt(0).toUpperCase() + propiedad.tipo_propiedad.slice(1) + 's' : 'Propiedades'}</Link> &gt; <span style={{ color: '#1e293b' }}>{propiedad.titulo}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={handleFavoriteToggle}
                aria-label={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                title={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                style={{
                  border: '1px solid #cbd5e1',
                  background: isFavorite ? '#fee2e2' : '#fff',
                  borderRadius: '4px',
                  padding: '5px 10px',
                  color: isFavorite ? '#dc2626' : '#475569',
                  cursor: 'pointer'
                }}
              >
                {isFavorite ? '♥' : '♡'}
              </button>
              <button
                type="button"
                onClick={handleCopyLink}
                aria-label="Copiar link de la propiedad"
                title="Copiar link de la propiedad"
                style={{ border: '1px solid #cbd5e1', background: '#fff', borderRadius: '4px', padding: '5px 10px', color: '#475569', cursor: 'pointer' }}
              >
                🔗
              </button>
              <button
                type="button"
                onClick={handlePrint}
                aria-label="Imprimir propiedad"
                title="Imprimir propiedad"
                style={{ border: '1px solid #cbd5e1', background: '#fff', borderRadius: '4px', padding: '5px 10px', color: '#475569', cursor: 'pointer' }}
              >
                🖨️
              </button>
            </div>
            {actionMessage && (
              <span style={{ color: '#475569', fontSize: '0.8rem', fontWeight: 500 }}>{actionMessage}</span>
            )}
          </div>
        </div>

        {/* Título y Precio */}
        <div className="detail-title-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '5px' }}>
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
        <div className="detail-gallery" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px', height: '450px', marginBottom: '30px' }}>
          <div style={{ 
            backgroundColor: '#e2e8f0', 
            borderRadius: '8px 0 0 8px', 
            backgroundImage: mainImage ? `url(${mainImage})` : 'none', 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            transition: 'background-image 0.3s ease-in-out',
            height: '100%',
            cursor: mainImage ? 'zoom-in' : 'default'
          }}
            onClick={() => mainImage && openLightboxByUrl(mainImage)}
          >
            {!mainImage && <div style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center', color: '#94a3b8' }}>Sin imagen</div>}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '10px', height: '100%' }}>
            {[0, 1, 2, 3].map(index => {
               const img = smallImages[index];
               const isLast = index === 3;
               return (
                 <div key={index} 
                   onClick={() => {
                     if (!img) return;
                     setSelectedImageUrl(img.url);
                     openLightboxByUrl(img.url);
                   }}
                   style={{ 
                   backgroundColor: '#e2e8f0', 
                   backgroundImage: img ? `url(${img.url})` : 'none', 
                   backgroundSize: 'cover', 
                   backgroundPosition: 'center',
                   borderRadius: index === 1 ? '0 8px 0 0' : index === 3 ? '0 0 8px 0' : '0',
                   position: 'relative',
                   cursor: img ? 'zoom-in' : 'default'
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
        <div className="detail-content-layout" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px', alignItems: 'start' }}>
          
          {/* Columna Izquierda (Contenido) */}
          <div className="detail-main-column" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* Visión General */}
            <div className="detail-section-card detail-overview-card" style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', marginBottom: '25px', marginTop: 0 }}>Visión general</h3>
              
              <div className="detail-overview-layout" style={{ display: 'flex', gap: '20px' }}>
                <div className="detail-overview-grid" style={{ flex: '2', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '25px 15px' }}>
                  
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

                {/* Mapa real de la propiedad */}
                <div style={{ flex: '1', minHeight: '200px', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
                  {propiedad.latitud && propiedad.longitud ? (
                    <MapContainer
                      center={[parseFloat(propiedad.latitud), parseFloat(propiedad.longitud)]}
                      zoom={15}
                      style={{ height: '100%', width: '100%', minHeight: '250px', borderRadius: '8px' }}
                      scrollWheelZoom={false}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker
                        position={[parseFloat(propiedad.latitud), parseFloat(propiedad.longitud)]}
                        icon={detailMarkerIcon}
                      >
                        <Popup>
                          <strong>{propiedad.titulo}</strong><br />
                          {propiedad.direccion && <>{propiedad.direccion}<br /></>}
                          {[propiedad.localidad, propiedad.provincia].filter(Boolean).join(', ')}
                        </Popup>
                      </Marker>
                    </MapContainer>
                  ) : (
                    <div style={{ 
                      width: '100%', 
                      height: '100%', 
                      minHeight: '250px',
                      backgroundColor: '#f1f5f9', 
                      borderRadius: '8px', 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: '#94a3b8',
                      gap: '8px'
                    }}>
                      <span style={{ fontSize: '2.5rem' }}>🗺️</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Ubicación no disponible</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="detail-section-card detail-description-card" style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', marginBottom: '20px', marginTop: 0 }}>Descripción</h3>
              <div style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                {propiedad.descripcion || 'Propiedad sin descripción detallada proporcionada.'}
              </div>
            </div>

            {/* Características / Amenidades */}
            <div className="detail-section-card detail-characteristics-card" style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', marginBottom: '25px', marginTop: 0 }}>Características</h3>
              {propiedad.Caracteristicas && propiedad.Caracteristicas.length > 0 ? (
                <div className="detail-characteristics-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
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
          <div className="detail-sidebar" style={{ position: 'sticky', top: '20px' }}>
            <div className="contact-agent-card" style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', borderTop: '4px solid var(--primary-color)' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '25px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#f1f5f9', backgroundImage: propiedad.Usuario && propiedad.Usuario.foto_url ? `url(${propiedad.Usuario.foto_url})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', marginRight: '15px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                   {(!propiedad.Usuario || !propiedad.Usuario.foto_url) && <span style={{ fontSize: '1.5rem', color: '#94a3b8' }}>👤</span>}
                </div>
                <div>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '1.05rem', color: '#1e293b' }}>{agenteAsignado ? agenteAsignado.nombre : 'Agente Autorizado'}</h4>
                  {agenteAsignado?.telefono && (
                    <p style={{ margin: '0 0 5px 0', fontSize: '0.82rem', color: '#64748b' }}>WhatsApp: {agenteAsignado.telefono}</p>
                  )}
                  {agenteAsignado?.email && (
                    <p style={{ margin: '0 0 5px 0', fontSize: '0.82rem', color: '#64748b' }}>Email: {agenteAsignado.email}</p>
                  )}
                  <Link to="/propiedades" style={{ color: '#dc2626', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600 }}>Ver anuncios</Link>
                </div>
              </div>

              <form className="agent-contact-form" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }} onSubmit={handleContactSubmit}>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  style={{ padding: '12px 15px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                  value={contactForm.nombre}
                  onChange={handleContactChange}
                  required
                />
                <input
                  type="tel"
                  name="telefono"
                  placeholder="Teléfono"
                  style={{ padding: '12px 15px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                  value={contactForm.telefono}
                  onChange={handleContactChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Correo"
                  style={{ padding: '12px 15px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                  value={contactForm.email}
                  onChange={handleContactChange}
                  required
                />
                <textarea
                  placeholder={`Hola, me interesa agendar una visita para la propiedad con ID ${propiedad.id}`}
                  rows="4"
                  name="mensaje"
                  style={{ padding: '12px 15px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.9rem', resize: 'none', outline: 'none' }}
                  value={contactForm.mensaje}
                  onChange={handleContactChange}
                ></textarea>
                
                <select
                  style={{ padding: '12px 15px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.9rem', backgroundColor: '#fff', color: '#64748b', outline: 'none' }}
                  name="rol"
                  value={contactForm.rol}
                  onChange={handleContactChange}
                >
                  <option value="">Soy un(a)...</option>
                  <option value="comprador">Comprador interesado</option>
                  <option value="colega">Colega Inmobiliario</option>
                </select>

                {contactSuccess && (
                  <p style={{ fontSize: '0.85rem', color: '#15803d', margin: '0' }}>{contactSuccess}</p>
                )}
                {contactError && (
                  <p style={{ fontSize: '0.85rem', color: '#b91c1c', margin: '0' }}>{contactError}</p>
                )}

                <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '5px 0', lineHeight: 1.4 }}>
                  Al enviar el formulario, estoy de acuerdo con los <Link to="/sobre-nosotros" style={{ color: '#dc2626', textDecoration: 'none' }}>Términos de uso</Link>.
                </p>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '14px', borderRadius: '4px', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '1rem', marginTop: '5px', width: '100%', boxSizing: 'border-box' }}
                  disabled={contactLoading}
                >
                  {contactLoading ? 'Enviando...' : 'Enviar mensaje'}
                </button>

                {contactChannels && (contactChannels.whatsappUrl || contactChannels.emailUrl) && (
                  <div style={{ marginTop: '8px', display: 'grid', gap: '10px' }}>
                    <p style={{ margin: 0, fontSize: '0.83rem', color: '#475569' }}>
                      Elegí cómo contactar a {contactChannels.agenteNombre}:
                    </p>

                    {contactChannels.whatsappUrl && (
                      <a
                        href={contactChannels.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          textDecoration: 'none',
                          textAlign: 'center',
                          padding: '12px',
                          borderRadius: '4px',
                          fontWeight: 700,
                          backgroundColor: '#25d366',
                          color: '#ffffff'
                        }}
                      >
                        Contactar por WhatsApp
                      </a>
                    )}

                    {contactChannels.emailUrl && (
                      <a
                        href={contactChannels.emailUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          textDecoration: 'none',
                          textAlign: 'center',
                          padding: '12px',
                          borderRadius: '4px',
                          fontWeight: 700,
                          backgroundColor: '#1d4ed8',
                          color: '#ffffff'
                        }}
                      >
                        Contactar por Email
                      </a>
                    )}
                  </div>
                )}
              </form>
            </div>
          </div>

        </div>
        
      </div>

      {isLightboxOpen && currentImgs.length > 0 && (
        <div
          onClick={closeLightbox}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.92)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              border: 'none',
              borderRadius: '999px',
              width: '40px',
              height: '40px',
              fontSize: '1.4rem',
              fontWeight: 700,
              color: '#0f172a',
              backgroundColor: '#ffffff',
              cursor: 'pointer'
            }}
          >
            ×
          </button>

          {currentImgs.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToPreviousImage();
              }}
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                border: 'none',
                width: '44px',
                height: '44px',
                borderRadius: '999px',
                fontSize: '1.4rem',
                backgroundColor: 'rgba(255,255,255,0.92)',
                color: '#0f172a',
                cursor: 'pointer'
              }}
            >
              ‹
            </button>
          )}

          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: 'min(1200px, 95vw)',
              maxHeight: '85vh',
              width: '100%',
              textAlign: 'center'
            }}
          >
            <img
              src={currentImgs[lightboxIndex]?.url}
              alt={`Foto ${lightboxIndex + 1} de ${currentImgs.length}`}
              style={{
                maxWidth: '100%',
                maxHeight: '78vh',
                borderRadius: '10px',
                objectFit: 'contain',
                boxShadow: '0 18px 40px rgba(0,0,0,0.45)'
              }}
            />
            <div style={{ color: '#f8fafc', marginTop: '10px', fontWeight: 600, letterSpacing: '0.2px' }}>
              {lightboxIndex + 1} / {currentImgs.length}
            </div>
          </div>

          {currentImgs.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToNextImage();
              }}
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                border: 'none',
                width: '44px',
                height: '44px',
                borderRadius: '999px',
                fontSize: '1.4rem',
                backgroundColor: 'rgba(255,255,255,0.92)',
                color: '#0f172a',
                cursor: 'pointer'
              }}
            >
              ›
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PropiedadDetalle;
