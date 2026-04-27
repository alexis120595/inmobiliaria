import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

const PublicLayout = () => {
  return (
    <div className="public-layout">
      <Navbar />
      <main className="public-main-content">
        <Outlet />
      </main>
      <WhatsAppButton />
      <Footer />
    </div>
  );
};

export default PublicLayout;
