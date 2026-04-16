import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => (
  <aside className="sidebar">
    <h2>Admin Panel</h2>
    <nav>
      <ul className="sidebar-nav">
        <li><Link to="/admin" className="sidebar-link">Dashboard</Link></li>
        <li><Link to="/admin/propiedades" className="sidebar-link">Propiedades</Link></li>
        <li><Link to="/admin/agentes" className="sidebar-link">Agentes</Link></li>
        <li><Link to="/admin/imagenes" className="sidebar-link">Imágenes</Link></li>
        <li><Link to="/admin/caracteristicas" className="sidebar-link">Características</Link></li>
        <li><Link to="/admin/contactos" className="sidebar-link">Contactos</Link></li>
      </ul>
    </nav>
  </aside>
);

export default Sidebar;
