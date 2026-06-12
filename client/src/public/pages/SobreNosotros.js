import React, { useState, useEffect } from 'react';

const carouselSlides = [
  { src: '/assets/home_banner_1.jpeg', alt: 'Fachada de la inmobiliaria', label: 'Nuestra Fachada', contain: false },
  { src: '/assets/home_banner_2.jpeg', alt: 'Recepcion de la inmobiliaria', label: 'Recepcion', contain: false },
  { src: '/assets/home_banner_3.jpeg', alt: 'Mostrador de atencion', label: 'Atencion Personalizada', contain: false },
  { src: '/assets/home_banner_4.jpeg', alt: 'Oficina de trabajo', label: 'Oficina', contain: false },
  { src: '/assets/home_banner_5.jpeg', alt: 'Espacio interior de atencion', label: 'Nuestro Espacio', contain: false },
];

const SobreNosotros = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

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
      <section className="about-hero about-hero-nosotros">
        <img className="about-hero-nosotros-image" src="/assets/about_fachada.jpg" alt="Frente del edificio de la inmobiliaria" />
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Nuestra Historia y Equipo</h1>
          <p className="hero-subtitle">Conoce a las personas dedicadas a encontrar el lugar perfecto para ti.</p>
        </div>
      </section>

      <div className="page-container pt-0">
        
        {/* Company Information Section */}
        <div className="about-accordions">
          <div className="accordion-item active">
            <div className="accordion-header">
              <h3>Origen</h3>
            </div>
            <div className="accordion-body" style={{ display: 'block' }}>
              <p>
                Como una empresa familiar comprometida con la excelencia, Mariana Fernandez Servicio Inmobiliario inició su camino en Luján de Cuyo, una zona estratégica de gran desarrollo residencial y barrios privados. Nuestro crecimiento sostenido y prestigio actual son el reflejo de la confianza de los clientes, quienes nos recomiendan día a día por el buen trato, la honestidad y el compromiso brindados, demostrando que es posible combinar la calidez familiar con la máxima seriedad profesional.
              </p>
            </div>
          </div>

          <div className="accordion-item active">
            <div className="accordion-header">
              <h3>Nuestra Empresa</h3>
            </div>
            <div className="accordion-body" style={{ display: 'block' }}>
              <p>
                Con más de una década de trayectoria, nos enorgullece ser una empresa familiar que ha crecido hasta convertirse en un referente de confianza en el mercado. El corazón de nuestra agencia sigue siendo la atención personalizada, impulsada hoy por un equipo profesional que utiliza nuevas metodologías de trabajo para que cada cliente se sienta acompañado, seguro y en familia en la búsqueda de su hogar ideal.
              </p>
            </div>
          </div>

          <div className="accordion-item active">
            <div className="accordion-header">
              <h3>Nuestro Objetivo</h3>
            </div>
            <div className="accordion-body" style={{ display: 'block' }}>
              <p>
                Para nosotros, cada cliente es único, por eso nos centramos en tus proyectos y en los sueños de tu familia, cuidando de vos y de tu patrimonio. Nos enfocamos en escucharte de verdad, poniendo tus necesidades reales en el centro de todo lo que hacemos. Trabajamos con total honestidad para tu tranquilidad y seguridad de estar en buenas manos durante cada paso del camino hacia tu nuevo hogar.
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
