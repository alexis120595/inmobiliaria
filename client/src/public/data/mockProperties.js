const mockProperties = [
  {
    id: 1,
    titulo: 'Casa moderna con jardin y pileta',
    descripcion:
      'Casa de estilo contemporaneo en barrio residencial. Cuenta con ambientes amplios, gran iluminacion natural y galeria con parrilla.',
    direccion: 'Av. del Sol 2450',
    localidad: 'Rosario',
    provincia: 'Santa Fe',
    pais: 'Argentina',
    tipo_propiedad: 'casa',
    operacion: 'venta',
    moneda: 'USD',
    precio: 185000,
    superficie_total: 320,
    superficie_cubierta: 180,
    dormitorios: 3,
    banos: 2,
    plantas: 2,
    ambientes: 6,
    garaje: 2,
    orientacion: 'Noreste',
    condicion: 'Excelente',
    antiguedad: 4,
    fecha_publicacion: '2026-04-12',
    Usuario: {
      id: 11,
      nombre: 'Carla Fernandez',
      foto_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60'
    },
    imagenes: [
      { id: 101, url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=60' },
      { id: 102, url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop&q=60' },
      { id: 103, url: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&auto=format&fit=crop&q=60' }
    ],
    Caracteristicas: [
      { id: 201, nombre: 'Piscina' },
      { id: 202, nombre: 'Parrilla' },
      { id: 203, nombre: 'Jardin' }
    ]
  },
  {
    id: 2,
    titulo: 'Departamento centrico con balcon',
    descripcion:
      'Departamento de dos dormitorios en zona centrica, ideal para vivienda o inversion. Edificio con amenities y seguridad.',
    direccion: 'Calle Mitre 980',
    localidad: 'Cordoba',
    provincia: 'Cordoba',
    pais: 'Argentina',
    tipo_propiedad: 'departamento',
    operacion: 'alquiler',
    moneda: 'ARS',
    precio: 890000,
    superficie_total: 95,
    superficie_cubierta: 82,
    dormitorios: 2,
    banos: 2,
    plantas: 1,
    ambientes: 4,
    garaje: 1,
    orientacion: 'Este',
    condicion: 'Muy buena',
    antiguedad: 7,
    fecha_publicacion: '2026-04-10',
    Usuario: {
      id: 12,
      nombre: 'Martin Quiroga',
      foto_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60'
    },
    imagenes: [
      { id: 104, url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&auto=format&fit=crop&q=60' },
      { id: 105, url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&auto=format&fit=crop&q=60' },
      { id: 106, url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&auto=format&fit=crop&q=60' }
    ],
    Caracteristicas: [
      { id: 204, nombre: 'Balcon' },
      { id: 205, nombre: 'SUM' },
      { id: 206, nombre: 'Seguridad 24 hs' }
    ]
  },
  {
    id: 3,
    titulo: 'Terreno en esquina para desarrollo',
    descripcion:
      'Lote en excelente ubicacion y gran proyeccion comercial. Ideal para desarrollo de viviendas o proyecto mixto.',
    direccion: 'Ruta 9 km 14',
    localidad: 'Pilar',
    provincia: 'Buenos Aires',
    pais: 'Argentina',
    tipo_propiedad: 'terreno',
    operacion: 'venta',
    moneda: 'USD',
    precio: 73000,
    superficie_total: 540,
    superficie_cubierta: 0,
    dormitorios: 0,
    banos: 0,
    plantas: 0,
    ambientes: 0,
    garaje: 0,
    orientacion: 'Norte',
    condicion: 'A estrenar',
    antiguedad: 0,
    fecha_publicacion: '2026-04-08',
    Usuario: {
      id: 13,
      nombre: 'Laura Gomez',
      foto_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60'
    },
    imagenes: [
      { id: 107, url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=60' },
      { id: 108, url: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1200&auto=format&fit=crop&q=60' }
    ],
    Caracteristicas: [
      { id: 207, nombre: 'Esquina' },
      { id: 208, nombre: 'Servicios disponibles' }
    ]
  }
];

export default mockProperties;
