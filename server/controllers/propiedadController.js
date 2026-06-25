const { Propiedad, Usuario, Imagen, Caracteristica } = require('../models');
const { geocodeAddress } = require('../services/geocodingService');

const toArray = (value) => {
  if (value === undefined || value === null || value === '') return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return [value];
};

const parseOrdenImagenes = (rawOrden) => {
  if (!rawOrden) return null;
  try {
    const parsed = typeof rawOrden === 'string' ? JSON.parse(rawOrden) : rawOrden;
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const buildOrderedImages = ({ existingImages = [], uploadedUrls = [], orderTokens = null }) => {
  if (!orderTokens || orderTokens.length === 0) {
    return [...existingImages, ...uploadedUrls];
  }

  const remainingExisting = [...existingImages];
  const remainingUploads = [...uploadedUrls];
  const ordered = [];

  for (const token of orderTokens) {
    if (token === 'nuevo') {
      const nextUpload = remainingUploads.shift();
      if (nextUpload) ordered.push(nextUpload);
      continue;
    }

    if (typeof token === 'string' && token.startsWith('existente::')) {
      const encodedUrl = token.slice('existente::'.length);
      const decodedUrl = decodeURIComponent(encodedUrl);
      const idx = remainingExisting.indexOf(decodedUrl);
      if (idx >= 0) {
        ordered.push(remainingExisting[idx]);
        remainingExisting.splice(idx, 1);
      }
    }
  }

  return [...ordered, ...remainingExisting, ...remainingUploads];
};

// Obtener todas las propiedades
exports.getAll = async (req, res) => {
  try {
    const propiedades = await Propiedad.findAll({
      include: [
        { model: Usuario, attributes: ['id', 'nombre', 'email', 'telefono', 'foto_url'] },
        { model: Imagen, as: 'imagenes' },
        { model: Caracteristica, through: { attributes: [] } }
      ],
      order: [
        [{ model: Imagen, as: 'imagenes' }, 'orden', 'ASC'],
        [{ model: Imagen, as: 'imagenes' }, 'id', 'ASC']
      ]
    });
    res.json(propiedades);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener una propiedad por ID
exports.getById = async (req, res) => {
  try {
    const propiedad = await Propiedad.findByPk(req.params.id, {
      include: [
        { model: Usuario, attributes: ['id', 'nombre', 'email', 'telefono', 'foto_url'] },
        { model: Imagen, as: 'imagenes' },
        { model: Caracteristica, through: { attributes: [] } }
      ],
      order: [
        [{ model: Imagen, as: 'imagenes' }, 'orden', 'ASC'],
        [{ model: Imagen, as: 'imagenes' }, 'id', 'ASC']
      ]
    });
    if (!propiedad) return res.status(404).json({ error: 'Propiedad no encontrada' });
    res.json(propiedad);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear propiedad
exports.create = async (req, res) => {
  try {
    const { caracteristicas, ...propiedadData } = req.body;
    const existingImages = toArray(req.body.imagenes);
    const uploadedUrls = req.files && req.files.length > 0 ? req.files.map(file => file.path) : [];
    const orderTokens = parseOrdenImagenes(req.body.orden_imagenes);
    const imagenes = buildOrderedImages({
      existingImages,
      uploadedUrls,
      orderTokens
    });

    // Sanitizar campos numéricos para evitar errores de casteo en PostgreSQL
    const numericFields = [
      'precio', 'superficie_cubierta', 'superficie_total',
      'dormitorios', 'banos', 'ambientes', 'plantas',
      'garaje', 'antiguedad', 'agente_id', 'latitud', 'longitud'
    ];
    for (const field of numericFields) {
      if (propiedadData[field] === '') {
        propiedadData[field] = null;
      } else if (propiedadData[field] !== undefined && propiedadData[field] !== null) {
        const val = Number(propiedadData[field]);
        propiedadData[field] = isNaN(val) ? null : val;
      }
    }

    // Auto-geocodificar la dirección si no se proporcionaron coordenadas
    if (!propiedadData.latitud || !propiedadData.longitud) {
      const coords = await geocodeAddress(
        propiedadData.direccion,
        propiedadData.localidad,
        propiedadData.provincia,
        propiedadData.pais
      );
      if (coords) {
        propiedadData.latitud = coords.latitud;
        propiedadData.longitud = coords.longitud;
      }
    }

    const propiedad = await Propiedad.create(propiedadData);
    
    if (caracteristicas && Array.isArray(caracteristicas)) {
      await propiedad.setCaracteristicas(caracteristicas);
    }
    
    if (imagenes && imagenes.length > 0) {
      const imagenesArray = imagenes.map((url, index) => ({
        url,
        orden: index + 1,
        propiedad_id: propiedad.id
      }));
      await Imagen.bulkCreate(imagenesArray);
    }

    const propiedadCreada = await Propiedad.findByPk(propiedad.id, {
      include: [
        { model: Usuario, attributes: ['id', 'nombre', 'email', 'telefono', 'foto_url'] },
        { model: Imagen, as: 'imagenes' },
        { model: Caracteristica, through: { attributes: [] } }
      ],
      order: [
        [{ model: Imagen, as: 'imagenes' }, 'orden', 'ASC'],
        [{ model: Imagen, as: 'imagenes' }, 'id', 'ASC']
      ]
    });

    res.status(201).json(propiedadCreada);
  } catch (err) {
    console.error('Error al crear propiedad:', err);
    res.status(400).json({ error: err.message });
  }
};

// Actualizar propiedad
exports.update = async (req, res) => {
  try {
    const { caracteristicas, ...propiedadData } = req.body;

    const existingImages = toArray(req.body.imagenes);
    const uploadedUrls = req.files && req.files.length > 0 ? req.files.map(file => file.path) : [];
    const orderTokens = parseOrdenImagenes(req.body.orden_imagenes);
    const imagenes = buildOrderedImages({
      existingImages,
      uploadedUrls,
      orderTokens
    });

    // Sanitizar campos numéricos para evitar errores de casteo en PostgreSQL
    const numericFields = [
      'precio', 'superficie_cubierta', 'superficie_total',
      'dormitorios', 'banos', 'ambientes', 'plantas',
      'garaje', 'antiguedad', 'agente_id', 'latitud', 'longitud'
    ];
    for (const field of numericFields) {
      if (propiedadData[field] === '') {
        propiedadData[field] = null;
      } else if (propiedadData[field] !== undefined && propiedadData[field] !== null) {
        const val = Number(propiedadData[field]);
        propiedadData[field] = isNaN(val) ? null : val;
      }
    }

    const propiedad = await Propiedad.findByPk(req.params.id);
    if (!propiedad) return res.status(404).json({ error: 'Propiedad no encontrada' });
    
    // Re-geocodificar si cambió la dirección/ubicación
    const cambioUbicacion = 
      propiedadData.direccion !== undefined || 
      propiedadData.localidad !== undefined || 
      propiedadData.provincia !== undefined ||
      propiedadData.pais !== undefined;
    
    if (cambioUbicacion && !propiedadData.latitud) {
      const coords = await geocodeAddress(
        propiedadData.direccion || propiedad.direccion,
        propiedadData.localidad || propiedad.localidad,
        propiedadData.provincia || propiedad.provincia,
        propiedadData.pais || propiedad.pais
      );
      if (coords) {
        propiedadData.latitud = coords.latitud;
        propiedadData.longitud = coords.longitud;
      }
    }

    await propiedad.update(propiedadData);
    
    if (caracteristicas && Array.isArray(caracteristicas)) {
      await propiedad.setCaracteristicas(caracteristicas);
    }
    
    if (imagenes && imagenes.length > 0) {
      await Imagen.destroy({ where: { propiedad_id: propiedad.id } });
      const imagenesArray = imagenes.map((url, index) => ({
        url,
        orden: index + 1,
        propiedad_id: propiedad.id
      }));
      if (imagenesArray.length > 0) {
        await Imagen.bulkCreate(imagenesArray);
      }
    }

    const propiedadActualizada = await Propiedad.findByPk(propiedad.id, {
      include: [
        { model: Usuario, attributes: ['id', 'nombre', 'email', 'telefono', 'foto_url'] },
        { model: Imagen, as: 'imagenes' },
        { model: Caracteristica, through: { attributes: [] } }
      ],
      order: [
        [{ model: Imagen, as: 'imagenes' }, 'orden', 'ASC'],
        [{ model: Imagen, as: 'imagenes' }, 'id', 'ASC']
      ]
    });

    res.json(propiedadActualizada);
  } catch (err) {
    console.error('Error al actualizar propiedad:', err);
    res.status(400).json({ error: err.message });
  }
};

// Eliminar propiedad
exports.remove = async (req, res) => {
  try {
    const propiedad = await Propiedad.findByPk(req.params.id);
    if (!propiedad) return res.status(404).json({ error: 'Propiedad no encontrada' });
    await propiedad.destroy();
    res.json({ message: 'Propiedad eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
