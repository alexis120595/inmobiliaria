import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';

// Páginas
import Home from './pages/Home';
import Propiedades from './pages/Propiedades';
import PropiedadDetalle from './pages/PropiedadDetalle';
import Contacto from './pages/Contacto';
import SobreNosotros from './pages/SobreNosotros';

const PublicRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="propiedades" element={<Propiedades />} />
        <Route path="propiedades/:id" element={<PropiedadDetalle />} />
        <Route path="contacto" element={<Contacto />} />
        <Route path="sobre-nosotros" element={<SobreNosotros />} />
      </Route>
    </Routes>
  );
};

export default PublicRoutes;
