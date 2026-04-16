const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Propiedad = sequelize.define('Propiedad', {
  titulo: { type: DataTypes.STRING, allowNull: false },
  descripcion: { type: DataTypes.TEXT },
  tipo_propiedad: { type: DataTypes.STRING, allowNull: false },
  operacion: { type: DataTypes.STRING, allowNull: false },
  direccion: { type: DataTypes.STRING },
  localidad: { type: DataTypes.STRING },
  provincia: { type: DataTypes.STRING },
  pais: { type: DataTypes.STRING },
  precio: { type: DataTypes.DECIMAL(15,2) },
  moneda: { type: DataTypes.STRING, defaultValue: 'USD' },
  superficie_cubierta: { type: DataTypes.DECIMAL(10,2) },
  superficie_total: { type: DataTypes.DECIMAL(10,2) },
  dormitorios: { type: DataTypes.INTEGER },
  banos: { type: DataTypes.INTEGER },
  ambientes: { type: DataTypes.INTEGER },
  plantas: { type: DataTypes.INTEGER },
  garaje: { type: DataTypes.INTEGER },
  antiguedad: { type: DataTypes.INTEGER },
  condicion: { type: DataTypes.STRING },
  estado: { type: DataTypes.STRING, defaultValue: 'activa' },
}, {
  tableName: 'propiedades',
  timestamps: true,
  createdAt: 'fecha_publicacion',
  updatedAt: false
});

module.exports = Propiedad;
