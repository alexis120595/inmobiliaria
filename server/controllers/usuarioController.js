const { Usuario } = require('../models');
const bcrypt = require('bcryptjs');

const normalizeText = (value) => (typeof value === 'string' ? value.trim() : value);

const validateAgentContact = (payload) => {
  const rol = normalizeText(payload.rol);
  if (rol !== 'agente') return null;

  const email = normalizeText(payload.email);
  const telefono = normalizeText(payload.telefono);

  if (!email) {
    return 'Para crear o editar un agente, el email es obligatorio.';
  }

  if (!telefono) {
    return 'Para crear o editar un agente, el teléfono es obligatorio.';
  }

  return null;
};

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

    bodyData.nombre = normalizeText(bodyData.nombre);
    bodyData.email = normalizeText(bodyData.email);
    bodyData.telefono = normalizeText(bodyData.telefono);
    bodyData.rol = normalizeText(bodyData.rol);

    const validationError = validateAgentContact(bodyData);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

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
    console.error('Error al crear usuario/agente:', err);
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    let bodyData = req.body;

    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    bodyData.nombre = normalizeText(bodyData.nombre);
    bodyData.email = normalizeText(bodyData.email);
    bodyData.telefono = normalizeText(bodyData.telefono);

    const effectivePayload = {
      rol: bodyData.rol !== undefined ? normalizeText(bodyData.rol) : usuario.rol,
      email: bodyData.email !== undefined ? bodyData.email : usuario.email,
      telefono: bodyData.telefono !== undefined ? bodyData.telefono : usuario.telefono
    };

    const validationError = validateAgentContact(effectivePayload);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    if (req.file) {
      bodyData.foto_url = req.file.path;
    }
    // Hashear password si viene en el body y no está ya hasheada
    if (bodyData.password_hash && !bodyData.password_hash.startsWith('$2')) {
      bodyData.password_hash = await bcrypt.hash(bodyData.password_hash, 10);
    }

    if (bodyData.rol !== undefined) {
      bodyData.rol = normalizeText(bodyData.rol);
    }

    await usuario.update(bodyData);
    res.json(usuario);
  } catch (err) {
    console.error('Error al actualizar usuario/agente:', err);
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
