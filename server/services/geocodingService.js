/**
 * Servicio de Geocodificación usando Nominatim (OpenStreetMap)
 * Convierte direcciones de texto en coordenadas geográficas (lat/lng)
 * API gratuita, sin necesidad de API key
 */

const https = require('https');

const makeRequest = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'InmobiliariaApp/1.0',
        'Accept-Language': 'es'
      }
    }, (res) => {
      if (res.statusCode !== 200) {
        return resolve(null);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', reject);
  });
};

const geocodeAddress = async (direccion, localidad, provincia, pais) => {
  try {
    const partes = [direccion, localidad, provincia, pais].filter(Boolean);
    if (partes.length === 0) return null;

    const query = partes.join(', ');
    const encodedQuery = encodeURIComponent(query);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&limit=1&countrycodes=ar`;

    const data = await makeRequest(url);

    if (data && data.length > 0) {
      return {
        latitud: parseFloat(data[0].lat),
        longitud: parseFloat(data[0].lon)
      };
    }

    if (direccion) {
      const queryFallback = [localidad, provincia, pais].filter(Boolean).join(', ');
      if (queryFallback) {
        const encodedFallback = encodeURIComponent(queryFallback);
        const fallbackUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedFallback}&limit=1&countrycodes=ar`;

        const fallbackData = await makeRequest(fallbackUrl);
        if (fallbackData && fallbackData.length > 0) {
          return {
            latitud: parseFloat(fallbackData[0].lat),
            longitud: parseFloat(fallbackData[0].lon)
          };
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
