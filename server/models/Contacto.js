const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Contacto = sequelize.define('Contacto', {
  nombre: { type: DataTypes.STRING, allowNull: false },
  telefono: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  mensaje: { type: DataTypes.TEXT },
}, {
  tableName: 'contactos',
  timestamps: true,
  createdAt: 'fecha',
  updatedAt: false
});

module.exports = Contacto;
