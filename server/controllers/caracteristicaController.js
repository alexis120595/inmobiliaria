const { Caracteristica } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const caracteristicas = await Caracteristica.findAll();
    res.json(caracteristicas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const caracteristica = await Caracteristica.findByPk(req.params.id);
    if (!caracteristica) return res.status(404).json({ error: 'Característica no encontrada' });
    res.json(caracteristica);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const caracteristica = await Caracteristica.create(req.body);
    res.status(201).json(caracteristica);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const caracteristica = await Caracteristica.findByPk(req.params.id);
    if (!caracteristica) return res.status(404).json({ error: 'Característica no encontrada' });
    await caracteristica.update(req.body);
    res.json(caracteristica);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const caracteristica = await Caracteristica.findByPk(req.params.id);
    if (!caracteristica) return res.status(404).json({ error: 'Característica no encontrada' });
    await caracteristica.destroy();
    res.json({ message: 'Característica eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
