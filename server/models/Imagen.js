const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Imagen = sequelize.define('Imagen', {
  url: { type: DataTypes.TEXT, allowNull: false },
  descripcion: { type: DataTypes.TEXT },
  orden: { type: DataTypes.INTEGER },
}, {
  tableName: 'imagenes',
  timestamps: false
});

module.exports = Imagen;
