import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const AdminLayout = ({ children }) => (
  <div className="admin-container">
    <Sidebar />
    <div className="admin-main-content">
      <Header />
      <main className="admin-page-content">
        {children}
      </main>
    </div>
  </div>
);

export default AdminLayout;
