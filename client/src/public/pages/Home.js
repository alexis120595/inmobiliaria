import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DEPARTAMENTOS_MENDOZA } from '../data/departamentosMendoza';
import DepartamentoSelect from '../components/DepartamentoSelect';
import { PROPERTY_TYPE_OPTIONS } from '../../shared/propertyTypes';

const OPCIONES_OPERACION = [
  { value: 'venta', label: 'Comprar' },
  { value: 'alquiler', label: 'Alquilar' }
];

const HERO_SLIDES = [
    { src: '/assets/mendoza_propiedad_1.jpg', alt: 'Frente de casa premium en Mendoza' },
    { src: '/assets/mendoza_propiedad_2.jpg', alt: 'Jardin y piscina de propiedad en Mendoza' }
];

const Home = () => {
  const navigate = useNavigate();
  const [heroIndex, setHeroIndex] = useState(0);
  const [ubicacion, setUbicacion] = useState('');
  const [tipo, setTipo] = useState('');
  const [operacion, setOperacion] = useState('');
  const [selectedFlyer, setSelectedFlyer] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (ubicacion.trim()) params.set('ubicacion', ubicacion.trim());
    if (tipo) params.set('tipo', tipo);
    if (operacion) params.set('operacion', operacion);
    const queryString = params.toString();
    navigate(queryString ? `/propiedades?${queryString}` : '/propiedades');
  };

  return (
    <div className="home-page">
      {/* Hero Section Full Width */}
      <section className="hero-section" style={{ backgroundImage: `url('${HERO_SLIDES[heroIndex].src}')` }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Encuentra el hogar de tus sueños</h1>
          <p className="hero-subtitle">
            Descubre las mejores propiedades con atención exclusiva y personalizada. 
            Calidad, diseño y ubicación.
          </p>
          <div className="hero-actions" style={{ justifyContent: 'center' }}>
            <Link to="/contacto" className="btn btn-primary hero-cta-btn">Quiero Consultar</Link>
          </div>
        </div>
        <div className="hero-dots" aria-label="Imagenes del banner">
          {HERO_SLIDES.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              className={`hero-dot ${index === heroIndex ? 'active' : ''}`}
              onClick={() => setHeroIndex(index)}
              aria-label={`Ver imagen ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Buscador de Propiedades Superpuesto */}
      <div className="home-search-container">
        <form className="home-search-form" onSubmit={handleSearch}>
          <div className="search-field">
            <label>Departamento</label>
            <DepartamentoSelect
              value={ubicacion}
              onChange={setUbicacion}
              options={DEPARTAMENTOS_MENDOZA}
              emptyLabel="Todas las zonas"
            />
          </div>
          <div className="search-field">
            <label>Tipo de Inmueble</label>
            <DepartamentoSelect
              value={tipo}
              onChange={setTipo}
              options={PROPERTY_TYPE_OPTIONS}
              emptyLabel="Todos los tipos"
            />
          </div>
          <div className="search-field">
            <label>Operación</label>
            <DepartamentoSelect
              value={operacion}
              onChange={setOperacion}
              options={OPCIONES_OPERACION}
              emptyLabel="Todas"
            />
          </div>
          <button type="submit" className="btn-primary search-btn">Buscar Propiedades</button>
        </form>
      </div>

      {/* Categorias Section */}
      <section className="categories-section">
        <div className="categories-grid">
          <div className="category-card">
            <Link to="/propiedades?tipo=terreno" className="category-img-link">
              <img src="/assets/category_terrenos.png" alt="Terrenos" className="category-img" />
            </Link>
            <h3 className="category-name">TERRENOS</h3>
            <div className="category-divider"></div>
            <Link to="/propiedades?tipo=terreno" className="category-link">Ver Todos</Link>
          </div>

          <div className="category-card">
            <Link to="/propiedades?tipo=departamento" className="category-img-link">
              <img src="/assets/category_departamentos.png" alt="Departamentos" className="category-img" />
            </Link>
            <h3 className="category-name">DEPARTAMENTOS</h3>
            <div className="category-divider"></div>
            <Link to="/propiedades?tipo=departamento" className="category-link">Ver Todos</Link>
          </div>

          <div className="category-card">
            <Link to="/propiedades?tipo=casa" className="category-img-link">
              <img src="/assets/category_casas.png" alt="Casas" className="category-img" />
            </Link>
            <h3 className="category-name">CASAS</h3>
            <div className="category-divider"></div>
            <Link to="/propiedades?tipo=casa" className="category-link">Ver Todos</Link>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="blog-section">
        <div className="section-header text-center">
          <h2 className="section-title">Últimas Noticias</h2>
          <p className="section-subtitle">Mantente informado sobre el mercado y tendencias</p>
        </div>
        <div className="blog-grid">
          <article className="blog-card" style={{ cursor: 'pointer' }} onClick={() => setSelectedFlyer('/assets/news_alquiler_completo.jpg')}>
            <div className="blog-img-container">
              <img src="/assets/news_alquiler_completo.jpg" alt="Actualización Alquileres Junio 2026" className="news-flyer-img" />
              <div className="blog-zoom-overlay">🔍 Ampliar</div>
            </div>
            <div className="blog-content">
              <span className="blog-date">Junio 2026</span>
              <h3 className="blog-title">Actualización Alquileres Completo</h3>
              <p className="blog-excerpt">Informe integral del Colegio de Corredores Públicos Inmobiliarios de Mendoza con índices trimestrales, cuatrimestrales, semestrales y anuales.</p>
              <span className="read-more">Ver Completo →</span>
            </div>
          </article>
          
          <article className="blog-card" style={{ cursor: 'pointer' }} onClick={() => setSelectedFlyer('/assets/news_alquiler_icl.jpg')}>
            <div className="blog-img-container">
              <img src="/assets/news_alquiler_icl.jpg" alt="ICL BCRA Junio 2026" className="news-flyer-img" />
              <div className="blog-zoom-overlay">🔍 Ampliar</div>
            </div>
            <div className="blog-content">
              <span className="blog-date">Junio 2026</span>
              <h3 className="blog-title">Índice ICL BCRA</h3>
              <p className="blog-excerpt">Detalle del Índice de Contratos de Locación publicado por el Banco Central para calcular los incrementos en contratos de vivienda.</p>
              <span className="read-more">Ver Tabla →</span>
            </div>
          </article>
          
          <article className="blog-card" style={{ cursor: 'pointer' }} onClick={() => setSelectedFlyer('/assets/news_alquiler_casapropia.jpg')}>
            <div className="blog-img-container">
              <img src="/assets/news_alquiler_casapropia.jpg" alt="Índice Casa Propia Junio 2026" className="news-flyer-img" />
              <div className="blog-zoom-overlay">🔍 Ampliar</div>
            </div>
            <div className="blog-content">
              <span className="blog-date">Junio 2026</span>
              <h3 className="blog-title">Índice Casa Propia</h3>
              <p className="blog-excerpt">Coeficiente de actualización para contratos de locación y créditos bajo la fórmula Casa Propia basados en la variación salarial.</p>
              <span className="read-more">Ver Detalle →</span>
            </div>
          </article>
        </div>
      </section>

      {/* Lightbox / Modal para visualizar los volantes completos */}
      {selectedFlyer && (
        <div className="flyer-modal-overlay" onClick={() => setSelectedFlyer(null)}>
          <div className="flyer-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="flyer-modal-close" onClick={() => setSelectedFlyer(null)}>&times;</button>
            <img src={selectedFlyer} alt="Visualización de volante" className="flyer-modal-img" />
          </div>
        </div>
      )}

      {/* Servicios Section */}
      <section className="services-section">
        <div className="services-header text-center">
          <h2 className="services-title">SERVICIOS</h2>
          <p className="services-subtitle">Desde Mariana Fernandez Servicio Inmobiliario te asesoramos. Accedé y descargá toda la información que necesites</p>
        </div>
        <div className="services-grid">
          <Link to="/contacto?servicio=comprar" className="service-item">
            <div className="service-icon" aria-hidden="true">⌂</div>
            <div className="service-copy">
              <h4>COMPRAR</h4>
              <p>¿Qué debo saber al comprar un inmueble?</p>
            </div>
          </Link>
          <Link to="/contacto?servicio=vender" className="service-item">
            <div className="service-icon" aria-hidden="true">⌂</div>
            <div className="service-copy">
              <h4>VENDER</h4>
              <p>¿Qué debo saber al vender un inmueble?</p>
            </div>
          </Link>

          <Link to="/contacto?servicio=tasaciones" className="service-item">
            <div className="service-icon" aria-hidden="true">⌂</div>
            <div className="service-copy">
              <h4>TASACIONES</h4>
              <p>Documentación, visitas, plano y escritura.</p>
            </div>
          </Link>

          <Link to="/contacto?servicio=alquilar" className="service-item">
            <div className="service-icon" aria-hidden="true">⌂</div>
            <div className="service-copy">
              <h4>ALQUILER</h4>
              <p>Información para inquilinos.</p>
            </div>
          </Link>

          <Link to="/propiedades" className="service-item">
            <div className="service-icon" aria-hidden="true">⌂</div>
            <div className="service-copy">
              <h4>VER TODOS</h4>
            </div>
          </Link>

          <Link to="/contacto?servicio=comprar" className="service-item">
            <div className="service-icon" aria-hidden="true">⌂</div>
            <div className="service-copy">
              <h4>COMPRAR</h4>
              <p>¿Qué debo saber al comprar un inmueble?</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
