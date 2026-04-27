import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
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
        <form className="home-search-form">
          <div className="search-field">
            <label>Ubicación</label>
            <input type="text" placeholder="Ej. Ciudad, Zona..." />
          </div>
          <div className="search-field">
            <label>Tipo de Inmueble</label>
            <select>
              <option value="">Todos los tipos</option>
              <option value="casa">Casa</option>
              <option value="departamento">Departamento</option>
              <option value="terreno">Terreno</option>
            </select>
          </div>
          <div className="search-field">
            <label>Operación</label>
            <select>
              <option value="venta">Comprar</option>
              <option value="alquiler">Alquilar</option>
            </select>
          </div>
          <button type="button" className="btn-primary search-btn">Buscar Propiedades</button>
        </form>
      </div>

      {/* Categorias Section */}
      <section className="categories-section">
        <div className="section-header text-center">
          <h2 className="section-title">Explora por Categoría</h2>
          <p className="section-subtitle">Encuentra exactamente lo que estás buscando</p>
        </div>
        
        <div className="categories-grid">
          <Link to="/propiedades?tipo=casa" className="category-card">
            <div className="category-icon">🏠</div>
            <h3 className="category-name">Casas</h3>
            <span className="category-count">124 Propiedades</span>
          </Link>
          
          <Link to="/propiedades?tipo=departamento" className="category-card">
            <div className="category-icon">🏢</div>
            <h3 className="category-name">Departamentos</h3>
            <span className="category-count">85 Propiedades</span>
          </Link>
          
          <Link to="/propiedades?tipo=terreno" className="category-card">
            <div className="category-icon">🏞️</div>
            <h3 className="category-name">Terrenos</h3>
            <span className="category-count">42 Propiedades</span>
          </Link>
        </div>
        
        <div className="text-center mt-3">
          <Link to="/propiedades" className="btn-primary-outline">Ver Todo</Link>
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
        <div className="section-header text-center">
          <h2 className="section-title">Nuestros Servicios</h2>
          <p className="section-subtitle">Te acompañamos en cada etapa de tu proceso inmobiliario</p>
        </div>
        <div className="services-flex">
          <Link to="/contacto?servicio=comprar" className="service-item">
            <div className="service-icon">🏷️</div>
            <h4>Comprar</h4>
          </Link>
          <Link to="/contacto?servicio=vender" className="service-item">
            <div className="service-icon">🤝</div>
            <h4>Vender</h4>
          </Link>
          <Link to="/contacto?servicio=alquilar" className="service-item">
            <div className="service-icon">🔑</div>
            <h4>Alquilar</h4>
          </Link>
          <Link to="/contacto?servicio=tasaciones" className="service-item">
            <div className="service-icon">📋</div>
            <h4>Tasaciones</h4>
          </Link>
          <Link to="/sobre-nosotros" className="service-item service-all">
            <div className="service-icon">➕</div>
            <h4>Ver Todos</h4>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
