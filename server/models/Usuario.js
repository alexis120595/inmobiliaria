const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  nombre: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  telefono: { type: DataTypes.STRING },
  foto_url: { type: DataTypes.TEXT },
  password_hash: { type: DataTypes.TEXT, allowNull: false },
  rol: { type: DataTypes.STRING, defaultValue: 'usuario' },
}, {
  tableName: 'usuarios',
  timestamps: true,
  createdAt: 'creado_en',
  updatedAt: false
});

module.exports = Usuario;
