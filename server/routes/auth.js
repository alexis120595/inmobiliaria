const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  return secret && secret.trim() ? secret : null;
};

const buildAuthResponse = (usuario, token) => ({
  token,
  usuario: {
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol,
    foto_url: usuario.foto_url
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const jwtSecret = getJwtSecret();
    if (!jwtSecret) {
      return res.status(500).json({ error: 'Configuracion incompleta del servidor: falta JWT_SECRET.' });
    }

    const { nombre, email, password, telefono } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Nombre, email y contraseña son obligatorios.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres.' });
    }

    const emailNormalizado = String(email).trim().toLowerCase();
    const usuarioExistente = await Usuario.findOne({ where: { email: emailNormalizado } });
    if (usuarioExistente) {
      return res.status(409).json({ error: 'Ya existe una cuenta con ese email.' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const usuario = await Usuario.create({
      nombre: String(nombre).trim(),
      email: emailNormalizado,
      telefono: telefono ? String(telefono).trim() : null,
      password_hash,
      rol: 'usuario'
    });

    const token = jwt.sign(
      {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      },
      jwtSecret,
      { expiresIn: '24h' }
    );

    res.status(201).json(buildAuthResponse(usuario, token));
  } catch (err) {
    res.status(500).json({ error: 'Error del servidor: ' + err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const jwtSecret = getJwtSecret();
    if (!jwtSecret) {
      return res.status(500).json({ error: 'Configuracion incompleta del servidor: falta JWT_SECRET.' });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios.' });
    }

    const emailNormalizado = String(email).trim().toLowerCase();

    // Buscar usuario por email
    const usuario = await Usuario.findOne({ where: { email: emailNormalizado } });
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }

    // Verificar contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }

    // Generar JWT
    const token = jwt.sign(
      { 
        id: usuario.id, 
        nombre: usuario.nombre, 
        email: usuario.email, 
        rol: usuario.rol 
      },
      jwtSecret,
      { expiresIn: '24h' }
    );

    res.json(buildAuthResponse(usuario, token));
  } catch (err) {
    res.status(500).json({ error: 'Error del servidor: ' + err.message });
  }
});

// GET /api/auth/me — obtener datos del usuario logueado
router.get('/me', async (req, res) => {
  try {
    const jwtSecret = getJwtSecret();
    if (!jwtSecret) {
      return res.status(500).json({ error: 'Configuracion incompleta del servidor: falta JWT_SECRET.' });
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No autenticado.' });
    }

    const decoded = jwt.verify(token, jwtSecret);
    const usuario = await Usuario.findByPk(decoded.id, {
      attributes: { exclude: ['password_hash'] }
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    res.json(usuario);
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido.' });
  }
});

module.exports = router;
