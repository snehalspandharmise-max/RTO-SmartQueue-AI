import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export function CitizenLayout() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content" style={{ padding: '2rem 0' }}>
        <div className="container">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
