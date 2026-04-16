const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Caracteristica = sequelize.define('Caracteristica', {
  nombre: { type: DataTypes.STRING, allowNull: false, unique: true },
}, {
  tableName: 'caracteristicas',
  timestamps: false
});

module.exports = Caracteristica;
