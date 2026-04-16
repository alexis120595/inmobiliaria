import React from 'react';

const DashboardCard = ({ title, value, icon, color }) => (
  <div className="card dashboard-card">
    <div className="dashboard-card-icon" style={{ color: color || 'var(--primary-color)' }}>{icon}</div>
    <div className="dashboard-card-content">
      <div className="dashboard-card-value">{value}</div>
      <div className="dashboard-card-title">{title}</div>
    </div>
  </div>
);

export default DashboardCard;
