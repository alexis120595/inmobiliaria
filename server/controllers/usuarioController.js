const { Usuario } = require('../models');
const bcrypt = require('bcryptjs');

exports.getAll = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({ attributes: { exclude: ['password_hash'] } });
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, { attributes: { exclude: ['password_hash'] } });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    let bodyData = req.body;
    if (req.file) {
      bodyData.foto_url = req.file.path;
    }
    // Hashear password si viene en el body
    if (bodyData.password_hash && !bodyData.password_hash.startsWith('$2')) {
      bodyData.password_hash = await bcrypt.hash(bodyData.password_hash, 10);
    }
    const usuario = await Usuario.create(bodyData);
    res.status(201).json(usuario);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    let bodyData = req.body;
    if (req.file) {
      bodyData.foto_url = req.file.path;
    }
    // Hashear password si viene en el body y no está ya hasheada
    if (bodyData.password_hash && !bodyData.password_hash.startsWith('$2')) {
      bodyData.password_hash = await bcrypt.hash(bodyData.password_hash, 10);
    }
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    await usuario.update(bodyData);
    res.json(usuario);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    await usuario.destroy();
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
