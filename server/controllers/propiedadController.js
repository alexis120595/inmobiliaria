const { Propiedad, Usuario, Imagen, Caracteristica } = require('../models');

// Obtener todas las propiedades
exports.getAll = async (req, res) => {
  try {
    const propiedades = await Propiedad.findAll({
      include: [
        { model: Usuario, attributes: ['id', 'nombre', 'email', 'telefono', 'foto_url'] },
        { model: Imagen, as: 'imagenes' },
        { model: Caracteristica, through: { attributes: [] } }
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
    let imagenes = req.body.imagenes || [];
    if (!Array.isArray(imagenes)) {
      imagenes = [imagenes];
    }
    
    if (req.files && req.files.length > 0) {
      const uploadedUrls = req.files.map(file => file.path);
      imagenes = [...imagenes, ...uploadedUrls];
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
      ]
    });

    res.status(201).json(propiedadCreada);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Actualizar propiedad
exports.update = async (req, res) => {
  try {
    const { caracteristicas, ...propiedadData } = req.body;
    
    let imagenes = req.body.imagenes || [];
    if (!Array.isArray(imagenes)) {
      imagenes = [imagenes];
    }
    
    if (req.files && req.files.length > 0) {
      const uploadedUrls = req.files.map(file => file.path);
      imagenes = [...imagenes, ...uploadedUrls];
    }

    const propiedad = await Propiedad.findByPk(req.params.id);
    if (!propiedad) return res.status(404).json({ error: 'Propiedad no encontrada' });
    
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
      ]
    });

    res.json(propiedadActualizada);
  } catch (err) {
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
