const rawApiUrl = process.env.REACT_APP_API_URL;

// Evita dobles barras al concatenar rutas y deja fallback local en desarrollo.
const API_URL = (rawApiUrl && rawApiUrl.trim())
	? rawApiUrl.replace(/\/$/, '')
	: 'http://localhost:4000';

export default API_URL;
