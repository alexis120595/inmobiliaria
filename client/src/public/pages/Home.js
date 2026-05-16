import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [ubicacion, setUbicacion] = useState('');
  const [tipo, setTipo] = useState('');
  const [operacion, setOperacion] = useState('');

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
      <section className="hero-section" style={{ backgroundImage: "url('/assets/luxury_villa_hero.png')" }}>
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
      </section>

      {/* Buscador de Propiedades Superpuesto */}
      <div className="home-search-container">
        <form className="home-search-form" onSubmit={handleSearch}>
          <div className="search-field">
            <label>Ubicación</label>
            <input
              type="text"
              placeholder="Ej. Ciudad, Zona..."
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
            />
          </div>
          <div className="search-field">
            <label>Tipo de Inmueble</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="">Todos los tipos</option>
              <option value="casa">Casa</option>
              <option value="departamento">Departamento</option>
              <option value="terreno">Terreno</option>
            </select>
          </div>
          <div className="search-field">
            <label>Operación</label>
            <select value={operacion} onChange={(e) => setOperacion(e.target.value)}>
              <option value="">Todas</option>
              <option value="venta">Comprar</option>
              <option value="alquiler">Alquilar</option>
            </select>
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
          <article className="blog-card">
            <div className="blog-img-placeholder" style={{ background: 'linear-gradient(45deg, #10b981, #059669)'}}></div>
            <div className="blog-content">
              <span className="blog-date">12 Abr, 2026</span>
              <h3 className="blog-title">Tendencias del mercado inmobiliario para este año</h3>
              <p className="blog-excerpt">Descubre cuáles son las zonas con mayor crecimiento y plusvalía en la ciudad para tu próxima gran inversión.</p>
              <span className="read-more">Leer Más →</span>
            </div>
          </article>
          
          <article className="blog-card">
            <div className="blog-img-placeholder" style={{ background: 'linear-gradient(45deg, #f59e0b, #d97706)'}}></div>
            <div className="blog-content">
              <span className="blog-date">05 Abr, 2026</span>
              <h3 className="blog-title">5 consejos antes de comprar tu primera casa</h3>
              <p className="blog-excerpt">Una guía esencial paso a paso para evitar errores comunes y asegurar tu inversión a largo plazo.</p>
              <span className="read-more">Leer Más →</span>
            </div>
          </article>
          
          <article className="blog-card">
            <div className="blog-img-placeholder" style={{ background: 'linear-gradient(45deg, #4f46e5, #4338ca)'}}></div>
            <div className="blog-content">
              <span className="blog-date">28 Mar, 2026</span>
              <h3 className="blog-title">¿Es buen momento para invertir en bienes raíces?</h3>
              <p className="blog-excerpt">Un exhaustivo análisis profundo sobre las tasas de interés actuales y sus proyecciones a futuro.</p>
              <span className="read-more">Leer Más →</span>
            </div>
          </article>
        </div>
      </section>

      {/* Servicios Section */}
      <section className="services-section">
        <div className="services-header text-center">
          <h2 className="services-title">SERVICIOS</h2>
          <p className="services-subtitle">Desde Inmobiliaria Premium te asesoramos. Accedé y descargá toda la información que necesites</p>
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
