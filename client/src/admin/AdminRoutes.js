import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import Propiedades from './pages/Propiedades';
import Agentes from './pages/Agentes';
import Imagenes from './pages/Imagenes';
import Caracteristicas from './pages/Caracteristicas';
import Contactos from './pages/Contactos';

const AdminRoutes = () => (
  <AdminLayout>
    <Routes>
      <Route path="" element={<Dashboard />} />
      <Route path="propiedades" element={<Propiedades />} />
      <Route path="agentes" element={<Agentes />} />
      <Route path="imagenes" element={<Imagenes />} />
      <Route path="caracteristicas" element={<Caracteristicas />} />
      <Route path="contactos" element={<Contactos />} />
    </Routes>
  </AdminLayout>
);

export default AdminRoutes;
