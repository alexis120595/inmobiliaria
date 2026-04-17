
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PublicRoutes from './public/PublicRoutes';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Deshabilitado en modo demo front-only */}
        <Route path="/admin/*" element={<Navigate to="/" replace />} />
        
        {/* Rutas de la web pública */}
        <Route path="/*" element={<PublicRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
