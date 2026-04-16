import React, { useState } from 'react';

const SobreNosotros = () => {
  const [openSection, setOpenSection] = useState('hoy');

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="about-page">
      {/* About Hero Section */}
      <section className="about-hero" style={{ backgroundImage: "url('/assets/about_team_hero.png')" }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Nuestra Historia y Equipo</h1>
          <p className="hero-subtitle">Conoce a las personas dedicadas a encontrar el lugar perfecto para ti.</p>
        </div>
      </section>

      <div className="page-container pt-0">
        
        {/* Accordions Section */}
        <div className="about-accordions">
          <div className={`accordion-item ${openSection === 'hoy' ? 'active' : ''}`}>
            <div className="accordion-header" onClick={() => toggleSection('hoy')}>
              <h3>Nuestra Empresa Hoy</h3>
              <span className="accordion-icon">{openSection === 'hoy' ? '−' : '+'}</span>
            </div>
            <div className="accordion-body" style={{ display: openSection === 'hoy' ? 'block' : 'none' }}>
              <p>
                Somos una de las agencias inmobiliarias líderes con más de una década de experiencia conectando a las personas con su hogar ideal. Hoy en día, operamos con un equipo diverso de agentes, consultores y expertos en el mercado de bienes raíces que trabajan de la mano con tecnología de vanguardia para brindar resultados excepcionales.
              </p>
            </div>
          </div>

          <div className={`accordion-item ${openSection === 'objetivo' ? 'active' : ''}`}>
            <div className="accordion-header" onClick={() => toggleSection('objetivo')}>
              <h3>Nuestro Objetivo</h3>
              <span className="accordion-icon">{openSection === 'objetivo' ? '−' : '+'}</span>
            </div>
            <div className="accordion-body" style={{ display: openSection === 'objetivo' ? 'block' : 'none' }}>
              <p>
                Nuestra meta es transformar el modelo tradicional de bienes raíces, enfocándonos en un enfoque basado 100% en la transparencia y centrado enteramente en las necesidades reales y los sueños de cada uno de nuestros clientes, garantizando siempre la máxima seguridad y confort en cada operación.
              </p>
            </div>
          </div>

          <div className={`accordion-item ${openSection === 'origen' ? 'active' : ''}`}>
            <div className="accordion-header" onClick={() => toggleSection('origen')}>
              <h3>Origen</h3>
              <span className="accordion-icon">{openSection === 'origen' ? '−' : '+'}</span>
            </div>
            <div className="accordion-body" style={{ display: openSection === 'origen' ? 'block' : 'none' }}>
              <p>
                Inmobiliaria Premium nació del sueño y visión de un pequeño grupo de agentes locales apasionados por el buen servicio. Desde una modesta oficina inicial, fuimos creciendo sostenidamente gracias a las continuas recomendaciones de clientes satisfechos que valoraron nuestra atención familiar y profesional a la vez.
              </p>
            </div>
          </div>
        </div>

        {/* Blog Section */}
        <section className="blog-section mt-5">
          <div className="section-header text-center">
            <h2 className="section-title">Últimas Noticias</h2>
            <p className="section-subtitle">Lo más nuevo y relevante del sector inmobiliario</p>
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
      </div>
    </div>
  );
};

export default SobreNosotros;
