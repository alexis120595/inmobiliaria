
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PublicRoutes from './public/PublicRoutes';
import AdminRoutes from './admin/AdminRoutes'; // Importamos panel de admin
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas de Administración */}
        <Route path="/admin/*" element={<AdminRoutes />} />
        
        {/* Rutas de la web pública */}
        <Route path="/*" element={<PublicRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
