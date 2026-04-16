const { Contacto, Propiedad } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const contactos = await Contacto.findAll({ include: [{ model: Propiedad }] });
    res.json(contactos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const contacto = await Contacto.findByPk(req.params.id, { include: [{ model: Propiedad }] });
    if (!contacto) return res.status(404).json({ error: 'Contacto no encontrado' });
    res.json(contacto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const contacto = await Contacto.create(req.body);
    res.status(201).json(contacto);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const contacto = await Contacto.findByPk(req.params.id);
    if (!contacto) return res.status(404).json({ error: 'Contacto no encontrado' });
    await contacto.update(req.body);
    res.json(contacto);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const contacto = await Contacto.findByPk(req.params.id);
    if (!contacto) return res.status(404).json({ error: 'Contacto no encontrado' });
    await contacto.destroy();
    res.json({ message: 'Contacto eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
