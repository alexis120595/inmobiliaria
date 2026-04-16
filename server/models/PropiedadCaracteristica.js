const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PropiedadCaracteristica = sequelize.define('PropiedadCaracteristica', {}, {
  tableName: 'propiedad_caracteristica',
  timestamps: false
});

module.exports = PropiedadCaracteristica;
