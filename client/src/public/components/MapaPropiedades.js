import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

// Fix para el ícono de marcador de Leaflet que no se muestra en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Ícono personalizado para las chinchetas de propiedades
const propertyIcon = new L.DivIcon({
  className: 'custom-property-marker',
  html: `<div class="marker-pin"><span>🏠</span></div>`,
  iconSize: [40, 48],
  iconAnchor: [20, 48],
  popupAnchor: [0, -48],
});

// Componente para ajustar el mapa a los bounds de los marcadores
const FitBounds = ({ propiedades }) => {
  const map = useMap();

  React.useEffect(() => {
    const conCoordenadas = propiedades.filter(p => p.latitud && p.longitud);
    if (conCoordenadas.length === 0) return;

    if (conCoordenadas.length === 1) {
      map.setView([conCoordenadas[0].latitud, conCoordenadas[0].longitud], 14);
    } else {
      const bounds = L.latLngBounds(
        conCoordenadas.map(p => [parseFloat(p.latitud), parseFloat(p.longitud)])
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [propiedades, map]);

  return null;
};

const MapaPropiedades = ({ propiedades, height = '450px' }) => {
  // Filtrar propiedades que tienen coordenadas
  const propiedadesConMapa = useMemo(() =>
    propiedades.filter(p => p.latitud && p.longitud),
    [propiedades]
  );

  // Centro por defecto: Mendoza, Argentina
  const defaultCenter = [-32.8895, -68.8458];
  const defaultZoom = 10;

  // Calcular centro basado en las propiedades
  const center = useMemo(() => {
    if (propiedadesConMapa.length === 0) return defaultCenter;
    const avgLat = propiedadesConMapa.reduce((sum, p) => sum + parseFloat(p.latitud), 0) / propiedadesConMapa.length;
    const avgLng = propiedadesConMapa.reduce((sum, p) => sum + parseFloat(p.longitud), 0) / propiedadesConMapa.length;
    return [avgLat, avgLng];
  }, [propiedadesConMapa]);

  if (propiedadesConMapa.length === 0) {
    return (
      <div className="mapa-empty-state" id="mapa-propiedades-empty">
        <div className="mapa-empty-icon">🗺️</div>
        <h3>Sin ubicaciones disponibles</h3>
        <p>Las propiedades filtradas no tienen coordenadas de ubicación asignadas.</p>
      </div>
    );
  }

  return (
    <div className="mapa-container" id="mapa-propiedades" style={{ height }}>
      <MapContainer
        center={center}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%', borderRadius: '12px' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <FitBounds propiedades={propiedadesConMapa} />

        {propiedadesConMapa.map((prop) => (
          <Marker
            key={prop.id}
            position={[parseFloat(prop.latitud), parseFloat(prop.longitud)]}
            icon={propertyIcon}
          >
            <Popup className="custom-popup" maxWidth={280} minWidth={240}>
              <div className="popup-content">
                {/* Imagen de la propiedad */}
                <div className="popup-image">
                  {prop.imagenes && prop.imagenes.length > 0 ? (
                    <img src={prop.imagenes[0].url} alt={prop.titulo} />
                  ) : (
                    <div className="popup-no-image">
                      <span>🏠</span>
                    </div>
                  )}
                  <div className="popup-badge">
                    {prop.operacion ? prop.operacion.toUpperCase() : 'VENTA'}
                  </div>
                </div>

                {/* Info de la propiedad */}
                <div className="popup-info">
                  <h4 className="popup-title">{prop.titulo}</h4>
                  <p className="popup-location">
                    📍 {[prop.localidad, prop.provincia].filter(Boolean).join(', ')}
                  </p>
                  <div className="popup-price">
                    {prop.moneda || 'U$D'} {prop.precio ? Number(prop.precio).toLocaleString('es-AR') : 'Consultar'}
                  </div>

                  {/* Datos rápidos */}
                  <div className="popup-features">
                    {prop.dormitorios > 0 && <span>🛏️ {prop.dormitorios}</span>}
                    {prop.banos > 0 && <span>🚿 {prop.banos}</span>}
                    {prop.superficie_total > 0 && <span>📐 {prop.superficie_total}m²</span>}
                  </div>

                  <Link to={`/propiedades/${prop.id}`} className="popup-btn">
                    Ver detalle →
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Badge de cantidad */}
      <div className="mapa-count-badge">
        📍 {propiedadesConMapa.length} {propiedadesConMapa.length === 1 ? 'propiedad' : 'propiedades'} en el mapa
      </div>
    </div>
  );
};

export default MapaPropiedades;
