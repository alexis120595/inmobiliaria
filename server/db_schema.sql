-- Tabla de usuarios/agentes
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(30),
    foto_url TEXT,
    password_hash TEXT NOT NULL,
    rol VARCHAR(20) DEFAULT 'agente',
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de propiedades
CREATE TABLE propiedades (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    tipo_propiedad VARCHAR(50) NOT NULL,
    operacion VARCHAR(20) NOT NULL,
    direccion VARCHAR(200),
    localidad VARCHAR(100),
    provincia VARCHAR(100),
    pais VARCHAR(100),
    precio NUMERIC(15,2),
    moneda VARCHAR(10) DEFAULT 'USD',
    superficie_cubierta NUMERIC(10,2),
    superficie_total NUMERIC(10,2),
    dormitorios INT,
    banos INT,
    ambientes INT,
    plantas INT,
    garaje INT,
    antiguedad INT,
    condicion VARCHAR(50),
    agente_id INT REFERENCES usuarios(id),
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'activa'
);

-- Tabla de características
CREATE TABLE caracteristicas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL
);

-- Relación propiedad-característica
CREATE TABLE propiedad_caracteristica (
    id SERIAL PRIMARY KEY,
    propiedad_id INT REFERENCES propiedades(id) ON DELETE CASCADE,
    caracteristica_id INT REFERENCES caracteristicas(id) ON DELETE CASCADE
);

-- Tabla de imágenes
CREATE TABLE imagenes (
    id SERIAL PRIMARY KEY,
    propiedad_id INT REFERENCES propiedades(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    descripcion TEXT,
    orden INT
);

-- Tabla de contactos/interesados
CREATE TABLE contactos (
    id SERIAL PRIMARY KEY,
    propiedad_id INT REFERENCES propiedades(id) ON DELETE SET NULL,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(30),
    email VARCHAR(100),
    mensaje TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
