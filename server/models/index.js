const Usuario = require('./Usuario');
const Propiedad = require('./Propiedad');
const Caracteristica = require('./Caracteristica');
const PropiedadCaracteristica = require('./PropiedadCaracteristica');
const Imagen = require('./Imagen');
const Contacto = require('./Contacto');

// Relaciones
Usuario.hasMany(Propiedad, { foreignKey: 'agente_id' });
Propiedad.belongsTo(Usuario, { foreignKey: 'agente_id' });

Propiedad.belongsToMany(Caracteristica, {
  through: PropiedadCaracteristica,
  foreignKey: 'propiedad_id',
  otherKey: 'caracteristica_id',
});
Caracteristica.belongsToMany(Propiedad, {
  through: PropiedadCaracteristica,
  foreignKey: 'caracteristica_id',
  otherKey: 'propiedad_id',
});

Propiedad.hasMany(Imagen, { foreignKey: 'propiedad_id', as: 'imagenes' });
Imagen.belongsTo(Propiedad, { foreignKey: 'propiedad_id' });

Propiedad.hasMany(Contacto, { foreignKey: 'propiedad_id', as: 'contactos' });
Contacto.belongsTo(Propiedad, { foreignKey: 'propiedad_id' });

module.exports = {
  Usuario,
  Propiedad,
  Caracteristica,
  PropiedadCaracteristica,
  Imagen,
  Contacto,
};
