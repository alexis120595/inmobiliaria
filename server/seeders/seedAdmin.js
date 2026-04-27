const bcrypt = require('bcryptjs');
const { Usuario } = require('../models');

const seedAdmin = async () => {
  try {
    const adminExists = await Usuario.findOne({ where: { email: 'admin@inmobiliaria.com' } });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await Usuario.create({
        nombre: 'Administrador',
        email: 'admin@inmobiliaria.com',
        telefono: '',
        password_hash: hashedPassword,
        rol: 'admin'
      });
      console.log('✅ Usuario admin creado: admin@inmobiliaria.com / admin123');
    }
  } catch (err) {
    console.error('Error al crear usuario admin:', err.message);
  }
};

module.exports = seedAdmin;
