
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminRoutes from './admin/AdminRoutes';
import PublicRoutes from './public/PublicRoutes';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Panel de administrador */}
        <Route path="/admin/*" element={<AdminRoutes />} />
        
        {/* Rutas de la web pública */}
        <Route path="/*" element={<PublicRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
