
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicRoutes from './public/PublicRoutes';
import AdminRoutes from './admin/AdminRoutes'; // Importamos panel de admin
import { AuthProvider } from './admin/context/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas de Administración */}
          <Route path="/admin/*" element={<AdminRoutes />} />
          
          {/* Rutas de la web pública */}
          <Route path="/*" element={<PublicRoutes />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
