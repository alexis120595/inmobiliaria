import React from 'react';
import './WhatsAppButton.css';

const WhatsAppButton = () => {
  // Número de la empresa. Reemplaza con el número real de la inmobiliaria
  const phoneNumber = "5491100000000"; 
  const message = "Hola! Estoy interesado en obtener más información.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a 
      href={whatsappUrl} 
      className="whatsapp-float-btn" 
      target="_blank" 
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
    >
      <svg
        width="35"
        height="35"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12.031 2C6.495 2 2 6.495 2 12.031c0 1.764.45 3.491 1.306 5.01L2 22l5.127-1.282A9.972 9.972 0 0 0 12.031 22c5.536 0 10.031-4.495 10.031-10.031S17.567 2 12.031 2zm5.556 14.542c-.237.669-1.371 1.288-1.895 1.35-.494.057-1.144.135-3.666-.91-3.047-1.263-5.017-4.408-5.166-4.606-.15-.198-1.233-1.64-1.233-3.129 0-1.488.767-2.228 1.042-2.525.275-.297.599-.371.8-.371.198 0 .396.002.571.01.18.008.42-.073.659.502.249.6 1.066 2.607 1.161 2.796.095.189.155.409.02.633-.135.224-.205.361-.41.599-.205.238-.43.518-.615.719-.205.224-.42.467-.184.872.235.405 1.048 1.731 2.247 2.802 1.547 1.382 2.836 1.808 3.251 2.012.415.204.659.171.908-.109.25-.28 1.077-1.253 1.365-1.684.288-.43.576-.361.956-.221.38.14 2.415 1.138 2.83 1.346.415.208.692.312.792.485.1.173.1.996-.137 1.665z" />
      </svg>
    </a>
  );
};

export default WhatsAppButton;
