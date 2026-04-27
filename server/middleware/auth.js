const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. No se proporcionó token.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido o expirado.' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && (req.user.rol === 'admin' || req.user.rol === 'agente')) {
    next();
  } else {
    return res.status(403).json({ error: 'No tienes permisos de administrador.' });
  }
};

module.exports = { verifyToken, isAdmin };
