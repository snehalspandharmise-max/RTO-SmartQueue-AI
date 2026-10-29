import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Layers, Calendar, Clock, User, Shield, LogOut, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';
import { NotificationDropdown } from './NotificationDropdown';

export function Navbar() {
  const { user, logout, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{ background: '#ffffff', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 50 }}>
      {/* Top Academic Disclaimer Pill */}
      <div className="disclaimer-banner">
        <span>🎓 <strong>Academic Demonstration System</strong> — Third-Year Computer Engineering Viva Capstone. Not an official government portal.</span>
      </div>

      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px' }}>
        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg, #1d4ed8, #0f172a)', padding: '0.45rem', borderRadius: '8px', color: '#ffffff', display: 'flex' }}>
            <Layers size={22} />
          </div>
          <div>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--navy-900)', letterSpacing: '-0.02em', display: 'block', lineHeight: 1.1 }}>
              RTO SmartQueue <span style={{ color: 'var(--primary)', fontWeight: 700 }}>AI</span>
            </span>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
              Queue Optimization Platform
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {!user ? (
            <>
              <Link to="/" style={{ fontSize: '0.9rem', fontWeight: 500, color: isActive('/') ? 'var(--primary)' : 'var(--navy-700)' }}>Home</Link>
              <Link to="/book" style={{ fontSize: '0.9rem', fontWeight: 500, color: isActive('/book') ? 'var(--primary)' : 'var(--navy-700)' }}>Book Slot</Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem' }}>
                <button onClick={() => demoLogin('citizen')} className="btn btn-secondary btn-sm" title="Instant Citizen Login for Viva">
                  👤 Demo Citizen
                </button>
                <button onClick={() => demoLogin('admin')} className="btn btn-secondary btn-sm" title="Instant Admin Login for Viva">
                  👑 Demo Admin
                </button>
                <Link to="/login" className="btn btn-primary btn-sm">Sign In</Link>
              </div>
            </>
          ) : user.role === 'admin' ? (
            /* Admin Navigation */
            <>
              <Link to="/admin" className={`btn btn-sm ${isActive('/admin') ? 'btn-primary' : 'btn-secondary'}`}>
                <Shield size={15} /> Dashboard
              </Link>
              <Link to="/admin/appointments" className={`btn btn-sm ${isActive('/admin/appointments') ? 'btn-primary' : 'btn-secondary'}`}>
                Appointments
              </Link>
              <Link to="/admin/counters" className={`btn btn-sm ${isActive('/admin/counters') ? 'btn-primary' : 'btn-secondary'}`}>
                Counters
              </Link>
              <Link to="/admin/insights" className={`btn btn-sm ${isActive('/admin/insights') ? 'btn-primary' : 'btn-secondary'}`}>
                Insights & Optimizer
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '0.5rem' }}>
                <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>Administrator</span>
                <button onClick={logout} className="btn btn-secondary btn-sm" title="Logout">
                  <LogOut size={15} />
                </button>
              </div>
            </>
          ) : (
            /* Citizen Navigation */
            <>
              <Link to="/dashboard" style={{ fontSize: '0.9rem', fontWeight: 500, color: isActive('/dashboard') ? 'var(--primary)' : 'var(--navy-700)' }}>
                Dashboard
              </Link>
              <Link to="/book" style={{ fontSize: '0.9rem', fontWeight: 500, color: isActive('/book') ? 'var(--primary)' : 'var(--navy-700)' }}>
                Book Appointment
              </Link>
              <Link to="/queue" style={{ fontSize: '0.9rem', fontWeight: 500, color: isActive('/queue') ? 'var(--primary)' : 'var(--navy-700)' }}>
                Live Queue
              </Link>
              <NotificationDropdown />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginLeft: '0.25rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy-800)' }}>
                  {user.full_name?.split(' ')[0]}
                </span>
                <button onClick={logout} className="btn btn-secondary btn-sm" title="Logout">
                  <LogOut size={15} />
                </button>
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
