const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');
const models = require('./models');

const app = express();
app.use(cors());
app.use(express.json());


// Rutas
app.use('/api/propiedades', require('./routes/propiedades'));
app.use('/api/contactos', require('./routes/contactos'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/imagenes', require('./routes/imagenes'));
app.use('/api/caracteristicas', require('./routes/caracteristicas'));
// app.use('/api/auth', require('./routes/auth'));


// Test conexión y sincronización de modelos
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a PostgreSQL exitosa');
    return sequelize.sync();
  })
  .then(() => console.log('Modelos sincronizados correctamente'))
  .catch(err => console.error('Error de conexión o sincronización:', err));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en puerto ${PORT}`);
});
