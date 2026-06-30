import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DEPARTAMENTOS_MENDOZA } from '../data/departamentosMendoza';
import DepartamentoSelect from '../components/DepartamentoSelect';
import API_URL from '../../config';
import { PROPERTY_TYPE_OPTIONS, getCanonicalPropertyType } from '../../shared/propertyTypes';

const OPCIONES_OPERACION = [
  { value: 'venta', label: 'Comprar' },
  { value: 'alquiler', label: 'Alquilar' }
];

const HERO_SLIDES = [
  { src: '/assets/home_banner_1.jpeg', alt: 'Fachada de la inmobiliaria', position: 'center top' },
  { src: '/assets/home_banner_2.jpeg', alt: 'Recepcion de la inmobiliaria', position: 'center top' },
  { src: '/assets/home_banner_3.jpeg', alt: 'Mostrador de atencion', position: 'center' },
  { src: '/assets/home_banner_4.jpeg', alt: 'Oficina de trabajo', position: 'center' },
  { src: '/assets/home_banner_5.jpeg', alt: 'Espacio interior de atencion', position: 'center' }
];

const CATEGORY_CARDS = [
  {
    key: 'lote / terreno',
    nombre: 'TERRENOS',
    link: '/propiedades?tipo=terreno',
    fallbackImage: '/assets/category_terrenos.png',
    alt: 'Terrenos'
  },
  {
    key: 'departamento',
    nombre: 'DEPARTAMENTOS',
    link: '/propiedades?tipo=departamento',
    fallbackImage: '/assets/category_departamentos.png',
    alt: 'Departamentos'
  },
  {
    key: 'casa',
    nombre: 'CASAS',
    link: '/propiedades?tipo=casa',
    fallbackImage: '/assets/category_casas.png',
    alt: 'Casas'
  }
];

const getImageUrl = (img) => {
  if (!img) return '';
  if (typeof img === 'string') return img;
  return img.url || img.secure_url || img.imagen_url || img.path || '';
};

const getPortadaUrl = (imagenes) => {
  if (!Array.isArray(imagenes) || imagenes.length === 0) return '';

  const ordenadas = [...imagenes].sort((a, b) => {
    const ordenA = Number.isFinite(Number(a?.orden)) ? Number(a.orden) : Number.MAX_SAFE_INTEGER;
    const ordenB = Number.isFinite(Number(b?.orden)) ? Number(b.orden) : Number.MAX_SAFE_INTEGER;
    if (ordenA !== ordenB) return ordenA - ordenB;
    const idA = Number.isFinite(Number(a?.id)) ? Number(a.id) : Number.MAX_SAFE_INTEGER;
    const idB = Number.isFinite(Number(b?.id)) ? Number(b.id) : Number.MAX_SAFE_INTEGER;
    return idA - idB;
  });

  return getImageUrl(ordenadas[0]);
};

const getPropertyTimestamp = (propiedad) => {
  const source = propiedad?.fecha_publicacion || propiedad?.createdAt || propiedad?.updatedAt;
  const ts = source ? new Date(source).getTime() : NaN;
  return Number.isNaN(ts) ? 0 : ts;
};

const Home = () => {
  const navigate = useNavigate();
  const [heroIndex, setHeroIndex] = useState(0);
  const [ubicacion, setUbicacion] = useState('');
  const [tipo, setTipo] = useState('');
  const [operacion, setOperacion] = useState('');
  const [selectedFlyer, setSelectedFlyer] = useState(null);
  const [categoryImages, setCategoryImages] = useState(() => (
    CATEGORY_CARDS.reduce((acc, card) => {
      acc[card.key] = card.fallbackImage;
      return acc;
    }, {})
  ));

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchCategoryCovers = async () => {
      try {
        const response = await fetch(`${API_URL}/api/propiedades`, { signal: controller.signal });
        if (!response.ok) return;

        const propiedades = await response.json();
        if (!Array.isArray(propiedades)) return;

        const nextImages = CATEGORY_CARDS.reduce((acc, card) => {
          const candidatas = propiedades
            .filter((p) => getCanonicalPropertyType(p?.tipo_propiedad) === card.key)
            .sort((a, b) => getPropertyTimestamp(b) - getPropertyTimestamp(a));

          const portada = candidatas.length > 0 ? getPortadaUrl(candidatas[0].imagenes) : '';
          acc[card.key] = portada || card.fallbackImage;
          return acc;
        }, {});

        setCategoryImages(nextImages);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('No se pudieron cargar las portadas dinámicas de categorías:', error);
        }
      }
    };

    fetchCategoryCovers();

    return () => controller.abort();
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
      <section
        className="hero-section"
        style={{
          backgroundImage: `url('${HERO_SLIDES[heroIndex].src}')`,
          backgroundPosition: HERO_SLIDES[heroIndex].position || 'center',
          backgroundSize: 'cover',
          backgroundColor: '#111827'
        }}
      >
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
          {CATEGORY_CARDS.map((card) => (
            <div className="category-card" key={card.key}>
              <Link to={card.link} className="category-img-link">
                <img src={categoryImages[card.key] || card.fallbackImage} alt={card.alt} className="category-img" />
              </Link>
              <h3 className="category-name">{card.nombre}</h3>
              <div className="category-divider"></div>
              <Link to={card.link} className="category-link">Ver Todos</Link>
            </div>
          ))}
        </div>
      </section>

      {/* Blog Section */}
      <section className="blog-section">
        <div className="section-header text-center">
          <h2 className="section-title">Últimas Noticias</h2>
          <p className="section-subtitle">Mantente informado sobre el mercado y tendencias</p>
        </div>
        <div className="blog-grid">
          <article className="blog-card" style={{ cursor: 'pointer' }} onClick={() => setSelectedFlyer('/assets/news_alquiler_completo_julio_2026.png')}>
            <div className="blog-img-container">
              <img src="/assets/news_alquiler_completo_julio_2026.png" alt="Actualización Alquileres Julio 2026" className="news-flyer-img" />
              <div className="blog-zoom-overlay">🔍 Ampliar</div>
            </div>
            <div className="blog-content">
              <span className="blog-date">Julio 2026</span>
              <h3 className="blog-title">Actualización Alquileres Completo</h3>
              <p className="blog-excerpt">Informe integral del Colegio de Corredores Públicos Inmobiliarios de Mendoza con índices trimestrales, cuatrimestrales, semestrales y anuales.</p>
              <span className="read-more">Ver Completo →</span>
            </div>
          </article>
          
          <article className="blog-card" style={{ cursor: 'pointer' }} onClick={() => setSelectedFlyer('/assets/news_alquiler_icl_julio_2026.png')}>
            <div className="blog-img-container">
              <img src="/assets/news_alquiler_icl_julio_2026.png" alt="ICL BCRA Julio 2026" className="news-flyer-img" />
              <div className="blog-zoom-overlay">🔍 Ampliar</div>
            </div>
            <div className="blog-content">
              <span className="blog-date">Julio 2026</span>
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
