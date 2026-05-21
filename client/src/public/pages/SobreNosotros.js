import React, { useState, useEffect } from 'react';

const carouselSlides = [
  { src: '/assets/about_recepcion.jpg', alt: 'Recepción Mariana Fernández Inmobiliaria', label: 'Nuestra Recepción', contain: false },
  { src: '/assets/about_oficina.jpg', alt: 'Atención Personalizada', label: 'Atención Personalizada', contain: false },
  { src: '/assets/about_cartel.jpg', alt: 'Matrícula Profesional', label: 'Matrícula Profesional — MAT 1488', contain: true },
  { src: '/assets/about_fachada.jpg', alt: 'Fachada Mariana Fernández Servicio Inmobiliario', label: 'Nuestra Oficina', contain: false },
];

const SobreNosotros = () => {
  const [openSection, setOpenSection] = useState('hoy');
  const [currentIndex, setCurrentIndex] = useState(0);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 4500);
    return () => clearInterval(timer);
  }, []);

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

        {/* Carousel Section replacing news/duo/banner */}
        <section className="about-carousel-section mt-5">
          <div className="section-header text-center">
            <h2 className="section-title">Conoce Nuestro Espacio</h2>
            <p className="section-subtitle">Explora nuestras oficinas y entorno de trabajo profesional</p>
          </div>

          <div className="about-main-carousel">
            <button className="carousel-nav-btn prev" onClick={prevSlide} aria-label="Anterior">
              &#10094;
            </button>
            
            <div className="carousel-slides-container">
              {carouselSlides.map((slide, index) => (
                <div
                  key={index}
                  className={`carousel-slide-item ${index === currentIndex ? 'active' : ''} ${slide.contain ? 'contain-mode' : ''}`}
                >
                  <img src={slide.src} alt={slide.alt} />
                  <div className="carousel-slide-overlay">
                    <span className="carousel-slide-label">{slide.label}</span>
                  </div>
                </div>
              ))}
            </div>

            <button className="carousel-nav-btn next" onClick={nextSlide} aria-label="Siguiente">
              &#10095;
            </button>

            <div className="carousel-indicators">
              {carouselSlides.map((_, index) => (
                <button
                  key={index}
                  className={`carousel-indicator-dot ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Ir a imagen ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default SobreNosotros;
