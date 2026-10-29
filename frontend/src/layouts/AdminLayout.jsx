import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Shield, LayoutDashboard, Users, MonitorCheck, TrendingUp, RotateCcw, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';

export function AdminLayout() {
  const [resetting, setResetting] = useState(false);
  const [resetNotice, setResetNotice] = useState(null);

  const handleReset = async () => {
    if (!window.confirm('Reset demonstration database to initial seed state? This is useful for replaying your viva demonstration.')) {
      return;
    }
    try {
      setResetting(true);
      const res = await api.post('/admin/reset-database');
      setResetNotice(res.message);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      alert('Failed to reset: ' + err.message);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="app-container" style={{ backgroundColor: '#f8fafc' }}>
      <Navbar />

      {/* Admin Action Sub-Bar */}
      <div style={{ background: '#0f172a', color: '#ffffff', padding: '0.85rem 0', borderBottom: '1px solid #1e293b' }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Shield size={18} style={{ color: '#60a5fa' }} />
            <span style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.01em' }}>
              RTO Operations Administration Console
            </span>
            <span className="badge badge-primary" style={{ fontSize: '0.68rem', backgroundColor: '#1e3a8a', color: '#93c5fd', border: '1px solid #3b82f6' }}>
              Demonstration Mode
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={handleReset}
              disabled={resetting}
              className="btn btn-secondary btn-sm"
              style={{ background: '#1e293b', color: '#f8fafc', borderColor: '#334155' }}
              title="Reset Database to clean demonstration state"
            >
              <RotateCcw size={14} className={resetting ? 'spin' : ''} />
              {resetting ? 'Resetting...' : 'Reset Demo Data'}
            </button>
          </div>
        </div>
      </div>

      {resetNotice && (
        <div style={{ background: '#ecfdf5', borderBottom: '1px solid #a7f3d0', color: '#065f46', padding: '0.5rem 1rem', textAlign: 'center', fontSize: '0.85rem' }}>
          {resetNotice}
        </div>
      )}

      {/* Main Content */}
      <main className="main-content" style={{ padding: '2rem 0' }}>
        <div className="container">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}
