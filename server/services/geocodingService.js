/**
 * Servicio de Geocodificación usando Nominatim (OpenStreetMap)
 * Convierte direcciones de texto en coordenadas geográficas (lat/lng)
 * API gratuita, sin necesidad de API key
 */

const geocodeAddress = async (direccion, localidad, provincia, pais) => {
  try {
    // Construir la query con los campos disponibles
    const partes = [direccion, localidad, provincia, pais].filter(Boolean);
    if (partes.length === 0) return null;

    const query = partes.join(', ');
    const encodedQuery = encodeURIComponent(query);

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&limit=1&countrycodes=ar`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'InmobiliariaApp/1.0',
        'Accept-Language': 'es'
      }
    });

    if (!response.ok) {
      console.warn(`Geocoding HTTP error: ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (data && data.length > 0) {
      return {
        latitud: parseFloat(data[0].lat),
        longitud: parseFloat(data[0].lon)
      };
    }

    // Si no encontró con la dirección completa, intentar solo con localidad + provincia + país
    if (direccion) {
      const queryFallback = [localidad, provincia, pais].filter(Boolean).join(', ');
      if (queryFallback) {
        const encodedFallback = encodeURIComponent(queryFallback);
        const fallbackUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedFallback}&limit=1&countrycodes=ar`;

        const fallbackResponse = await fetch(fallbackUrl, {
          headers: {
            'User-Agent': 'InmobiliariaApp/1.0',
            'Accept-Language': 'es'
          }
        });

        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          if (fallbackData && fallbackData.length > 0) {
            return {
              latitud: parseFloat(fallbackData[0].lat),
              longitud: parseFloat(fallbackData[0].lon)
            };
          }
        }
      }
    }

    console.warn(`No se encontraron coordenadas para: ${query}`);
    return null;
  } catch (error) {
    console.error('Error en geocodificación:', error.message);
    return null;
  }
};

module.exports = { geocodeAddress };
