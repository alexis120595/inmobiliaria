/**
 * Script de migración para geocodificar propiedades existentes
 * Recorre todas las propiedades sin coordenadas y les asigna lat/lng
 * 
 * Ejecutar: node seeders/geocodeMigration.js
 */

const sequelize = require('../config/database');
const { Propiedad } = require('../models');
const { geocodeAddress } = require('../services/geocodingService');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const migrarCoordenadas = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida.');

    // Sincronizar modelo para crear columnas si no existen
    await sequelize.sync({ alter: true });
    console.log('✅ Columnas latitud/longitud sincronizadas.');

    // Obtener propiedades sin coordenadas
    const propiedades = await Propiedad.findAll({
      where: {
        latitud: null
      }
    });

    console.log(`\n📍 Propiedades sin coordenadas: ${propiedades.length}`);

    if (propiedades.length === 0) {
      console.log('✅ Todas las propiedades ya tienen coordenadas.');
      process.exit(0);
    }

    let exitosas = 0;
    let fallidas = 0;

    for (const prop of propiedades) {
      const nombreCompleto = `${prop.titulo} (ID: ${prop.id})`;
      console.log(`\n🔍 Geocodificando: ${nombreCompleto}`);
      console.log(`   Dirección: ${[prop.direccion, prop.localidad, prop.provincia, prop.pais].filter(Boolean).join(', ')}`);

      const coords = await geocodeAddress(
        prop.direccion,
        prop.localidad,
        prop.provincia,
        prop.pais
      );

      if (coords) {
        await prop.update({
          latitud: coords.latitud,
          longitud: coords.longitud
        });
        console.log(`   ✅ Coordenadas: ${coords.latitud}, ${coords.longitud}`);
        exitosas++;
      } else {
        console.log(`   ⚠️ No se encontraron coordenadas`);
        fallidas++;
      }

      // Esperar 1.1 segundos entre solicitudes (Nominatim pide max 1 req/segundo)
      await sleep(1100);
    }

    console.log(`\n${'='.repeat(50)}`);
    console.log(`📊 Resultados de la migración:`);
    console.log(`   ✅ Exitosas: ${exitosas}`);
    console.log(`   ⚠️ Sin resultados: ${fallidas}`);
    console.log(`   📝 Total procesadas: ${propiedades.length}`);
    console.log(`${'='.repeat(50)}\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error en la migración:', error);
    process.exit(1);
  }
};

migrarCoordenadas();
