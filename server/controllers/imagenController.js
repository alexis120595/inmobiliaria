const { Imagen, Propiedad } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const imagenes = await Imagen.findAll({ include: [{ model: Propiedad }] });
    res.json(imagenes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const imagen = await Imagen.findByPk(req.params.id, { include: [{ model: Propiedad }] });
    if (!imagen) return res.status(404).json({ error: 'Imagen no encontrada' });
    res.json(imagen);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      // Si se recibe un array, crear varias imágenes
      const imagenes = await Imagen.bulkCreate(req.body);
      res.status(201).json(imagenes);
    } else {
      // Si se recibe un solo objeto, crear una imagen
      const imagen = await Imagen.create(req.body);
      res.status(201).json(imagen);
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const imagen = await Imagen.findByPk(req.params.id);
    if (!imagen) return res.status(404).json({ error: 'Imagen no encontrada' });
    await imagen.update(req.body);
    res.json(imagen);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const imagen = await Imagen.findByPk(req.params.id);
    if (!imagen) return res.status(404).json({ error: 'Imagen no encontrada' });
    await imagen.destroy();
    res.json({ message: 'Imagen eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
