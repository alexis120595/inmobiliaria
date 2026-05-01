import API_URL from '../../config';
import React, { useEffect, useState } from 'react';
import DashboardCard from '../components/DashboardCard';
import { useAuth } from '../context/AuthContext';

const API = `${API_URL}/api`;

const Dashboard = () => {
  const { getAuthHeaders } = useAuth();
  const [stats, setStats] = useState({
    propiedades: 0,
    agentes: 0,
    imagenes: 0,
    caracteristicas: 0,
    contactos: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [prop, ag, img, car, con] = await Promise.all([
          fetch(`${API}/propiedades`).then(r => r.json()),
          fetch(`${API}/usuarios`, { headers: getAuthHeaders() }).then(r => r.json()),
          fetch(`${API}/imagenes`).then(r => r.json()),
          fetch(`${API}/caracteristicas`).then(r => r.json()),
          fetch(`${API}/contactos`, { headers: getAuthHeaders() }).then(r => r.json()),
        ]);
        setStats({
          propiedades: prop.length,
          agentes: ag.filter(u => u.rol === 'agente').length,
          imagenes: img.length,
          caracteristicas: car.length,
          contactos: con.length
        });
      } catch (e) {
        // Manejo simple de error
      }
    };
    fetchStats();
  }, [getAuthHeaders]);

  return (
    <div>
      <h1 className="page-title">Panel de Administrador</h1>
      <div className="grid grid-cols-4 dashboard-grid">
        <DashboardCard title="Propiedades" value={stats.propiedades} icon="🏠" color="var(--primary-color)" />
        <DashboardCard title="Agentes" value={stats.agentes} icon="🧑‍💼" color="var(--secondary-color)" />
        <DashboardCard title="Imágenes" value={stats.imagenes} icon="🖼️" color="var(--warning-color)" />
        <DashboardCard title="Características" value={stats.caracteristicas} icon="⭐" color="var(--danger-color)" />
        <DashboardCard title="Contactos" value={stats.contactos} icon="✉️" color="var(--primary-hover)" />
      </div>
    </div>
  );
};

export default Dashboard;
