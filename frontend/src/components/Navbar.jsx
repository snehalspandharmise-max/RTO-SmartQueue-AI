import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Shield,
  Layers,
  Phone,
  Volume2,
  Eye,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  LogOut,
  User,
  AlertCircle,
  Gamepad2,
  FileText,
  Clock,
  Car
} from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { NotificationDropdown } from './NotificationDropdown';
import { ANNOUNCEMENTS } from '../data/portalData';

export function Navbar() {
  const { user, logout, demoLogin } = useAuth();
  const { lang, setLang, fontSize, changeFontSize, highContrast, setHighContrast, t } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { label: t('navHome'), path: '/' },
    { label: t('navAbout'), path: '/about' },
    {
      label: t('navServices'),
      path: '/services',
      children: [
        { label: 'All Citizen Services', path: '/services' },
        { label: t('navDrivingLicence') + ' (Sarathi)', path: '/services/driving-licence' },
        { label: t('navVehicleServices') + ' (Vahan)', path: '/services/vehicle' },
      ]
    },
    { label: t('navRtoOffices'), path: '/offices' },
    {
      label: t('navSmartQueue'),
      path: '/book',
      children: [
        { label: 'Book Appointment Slot', path: '/book' },
        { label: 'Live Queue Status & Pass', path: '/queue' },
      ]
    },
    {
      label: t('navRoadSafety'),
      path: '/road-safety',
      badge: 'Interactive'
    },
    { label: t('navAnnouncements'), path: '/announcements' },
    { label: t('navMobileApps'), path: '/mobile-apps' },
    { label: t('navContact'), path: '/contact' }
  ];

  return (
    <header className="gov-header" style={{ position: 'sticky', top: 0, zIndex: 100, background: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      {/* 1. TOP CITIZEN & ACCESSIBILITY BAR */}
      <div className="gov-topbar" style={{ background: 'var(--navy-900)', color: '#ffffff', fontSize: '0.78rem', borderBottom: '2px solid var(--accent-gold)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem 1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          
          {/* Department Identification & Emergency */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 600, letterSpacing: '0.02em', color: '#f8fafc' }}>
              {t('deptName')} | {t('subDept')}
            </span>
            <span style={{ color: 'var(--navy-300)' }}>•</span>
            <a href="tel:1800220110" style={{ color: 'var(--accent-gold)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none', fontWeight: 600 }}>
              <Phone size={13} /> {t('emergencyHelpline')}: 1800-22-0110
            </a>
          </div>

          {/* Accessibility Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {/* Font Resize */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', background: 'rgba(255,255,255,0.1)', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
              <span style={{ fontSize: '0.68rem', color: '#cbd5e1', marginRight: '0.2rem' }}>A11y:</span>
              <button
                type="button"
                onClick={() => changeFontSize('sm')}
                style={{ background: fontSize === 'sm' ? 'var(--primary-teal)' : 'transparent', color: '#fff', border: 'none', padding: '0 0.3rem', fontSize: '0.7rem', cursor: 'pointer', borderRadius: '2px' }}
                title="Decrease Text Size"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => changeFontSize('md')}
                style={{ background: fontSize === 'md' ? 'var(--primary-teal)' : 'transparent', color: '#fff', border: 'none', padding: '0 0.3rem', fontSize: '0.78rem', cursor: 'pointer', borderRadius: '2px' }}
                title="Reset Text Size"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => changeFontSize('lg')}
                style={{ background: fontSize === 'lg' ? 'var(--primary-teal)' : 'transparent', color: '#fff', border: 'none', padding: '0 0.3rem', fontSize: '0.85rem', cursor: 'pointer', borderRadius: '2px' }}
                title="Increase Text Size"
              >
                A+
              </button>
            </div>

            {/* High Contrast Toggle */}
            <button
              type="button"
              onClick={() => setHighContrast(!highContrast)}
              style={{
                background: highContrast ? '#ffffff' : 'rgba(255,255,255,0.1)',
                color: highContrast ? '#000000' : '#ffffff',
                border: 'none',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.7rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
              title="Toggle High Contrast Mode"
            >
              <Eye size={12} /> {t('highContrast')}
            </button>

            {/* Language Switcher */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
              <button
                type="button"
                onClick={() => setLang('en')}
                style={{
                  background: lang === 'en' ? 'var(--accent-gold)' : 'transparent',
                  color: lang === 'en' ? 'var(--navy-900)' : '#cbd5e1',
                  border: 'none',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '3px',
                  fontWeight: lang === 'en' ? 700 : 500,
                  fontSize: '0.72rem',
                  cursor: 'pointer'
                }}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLang('mr')}
                style={{
                  background: lang === 'mr' ? 'var(--accent-gold)' : 'transparent',
                  color: lang === 'mr' ? 'var(--navy-900)' : '#cbd5e1',
                  border: 'none',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '3px',
                  fontWeight: lang === 'mr' ? 700 : 500,
                  fontSize: '0.72rem',
                  cursor: 'pointer'
                }}
              >
                मराठी
              </button>
              <button
                type="button"
                onClick={() => setLang('hi')}
                style={{
                  background: lang === 'hi' ? 'var(--accent-gold)' : 'transparent',
                  color: lang === 'hi' ? 'var(--navy-900)' : '#cbd5e1',
                  border: 'none',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '3px',
                  fontWeight: lang === 'hi' ? 700 : 500,
                  fontSize: '0.72rem',
                  cursor: 'pointer'
                }}
              >
                हिंदी
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ANNOUNCEMENT ADVISORY TICKER */}
      <div className="gov-ticker" style={{ background: '#fdf6ea', borderBottom: '1px solid #fed7aa', padding: '0.25rem 0', fontSize: '0.78rem' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
          <span style={{
            background: 'var(--transport-red)',
            color: '#fff',
            padding: '0.15rem 0.45rem',
            borderRadius: '3px',
            fontWeight: 700,
            fontSize: '0.68rem',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            flexShrink: 0
          }}>
            <AlertCircle size={12} /> {t('announcementsTicker')}
          </span>
          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--navy-800)', fontWeight: 500 }}>
            {ANNOUNCEMENTS.slice(0, 3).map((a, idx) => (
              <span key={a.id} style={{ marginRight: '1.5rem' }}>
                <Link to="/announcements" style={{ color: 'inherit', textDecoration: 'none' }}>
                  <strong>[{a.category}]</strong> {a.title}
                </Link>
                {idx < 2 && <span style={{ marginLeft: '1.5rem', color: '#cbd5e1' }}>|</span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3. MAIN PORTAL LOGO BAR */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid var(--border)', padding: '0.65rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          
          {/* Official Seal / Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', textDecoration: 'none' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--navy-800) 0%, var(--primary-teal) 100%)',
              border: '2px solid var(--accent-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 2px 6px rgba(20,45,78,0.18)',
              flexShrink: 0
            }}>
              <Car size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--navy-900)', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                  RTO SmartQueue <span style={{ color: 'var(--primary-teal)', fontWeight: 700 }}>AI</span>
                </span>
                <span className="badge badge-teal" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', textTransform: 'uppercase' }}>
                  Maharashtra
                </span>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block' }}>
                {t('portalTitle')}
              </span>
            </div>
          </Link>

          {/* Quick Viva Demo Shortcuts + Auth Buttons */}
          <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {!user ? (
              <>
                <button
                  type="button"
                  onClick={() => demoLogin('citizen')}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.76rem', padding: '0.35rem 0.7rem' }}
                  title="Instant Citizen Login"
                >
                  👤 {t('demoCitizen')}
                </button>
                <button
                  type="button"
                  onClick={() => demoLogin('admin')}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.76rem', padding: '0.35rem 0.7rem' }}
                  title="Instant Admin Login"
                >
                  👑 {t('demoAdmin')}
                </button>
                <Link to="/login" className="btn btn-primary btn-sm" style={{ fontSize: '0.78rem' }}>
                  {t('login')}
                </Link>
                <Link to="/register" className="btn btn-outline btn-sm" style={{ fontSize: '0.78rem' }}>
                  {t('register')}
                </Link>
              </>
            ) : user.role === 'admin' ? (
              <>
                <Link to="/admin" className={`btn btn-sm ${isActive('/admin') ? 'btn-primary' : 'btn-secondary'}`}>
                  <Shield size={14} /> Admin Portal
                </Link>
                <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>Admin: {user.full_name?.split(' ')[0]}</span>
                <button onClick={logout} className="btn btn-secondary btn-sm" title="Log Out">
                  <LogOut size={14} />
                </button>
              </>
            ) : (
              <>
                <Link to="/dashboard" className={`btn btn-sm ${isActive('/dashboard') ? 'btn-primary' : 'btn-secondary'}`}>
                  <User size={14} /> {t('dashboard')}
                </Link>
                <NotificationDropdown />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--navy-800)' }}>
                  {user.full_name?.split(' ')[0]}
                </span>
                <button onClick={logout} className="btn btn-secondary btn-sm" title="Log Out">
                  <LogOut size={14} />
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            className="mobile-only"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ background: 'transparent', border: '1px solid var(--border)', padding: '0.4rem', borderRadius: '6px', color: 'var(--navy-800)', cursor: 'pointer' }}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* 4. MAIN NAVIGATION LINKS (MAHARASHTRA GOVERNMENT STYLE) */}
      <nav style={{ background: 'var(--navy-800)', borderBottom: '1px solid var(--navy-900)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            {navLinks.map((item) => (
              <div
                key={item.path}
                style={{ position: 'relative' }}
                onMouseEnter={() => item.children && setActiveDropdown(item.path)}
                onMouseLeave={() => item.children && setActiveDropdown(null)}
              >
                <Link
                  to={item.path}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.75rem 0.9rem',
                    fontSize: '0.83rem',
                    fontWeight: isActive(item.path) ? 700 : 500,
                    color: isActive(item.path) ? '#ffffff' : '#e2e8f0',
                    borderBottom: isActive(item.path) ? '3px solid var(--accent-gold)' : '3px solid transparent',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {item.label}
                  {item.badge && (
                    <span style={{
                      background: 'var(--transport-red)',
                      color: '#ffffff',
                      fontSize: '0.6rem',
                      padding: '0.1rem 0.35rem',
                      borderRadius: '4px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em'
                    }}>
                      {item.badge}
                    </span>
                  )}
                  {item.children && <ChevronDown size={13} style={{ opacity: 0.8 }} />}
                </Link>

                {/* Dropdown Menu */}
                {item.children && activeDropdown === item.path && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    background: '#ffffff',
                    border: '1px solid var(--border)',
                    borderRadius: '0 0 6px 6px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    minWidth: '220px',
                    zIndex: 200,
                    padding: '0.35rem 0'
                  }}>
                    {item.children.map((sub) => (
                      <Link
                        key={sub.path}
                        to={sub.path}
                        style={{
                          display: 'block',
                          padding: '0.55rem 1rem',
                          fontSize: '0.82rem',
                          color: 'var(--navy-800)',
                          textDecoration: 'none',
                          fontWeight: 500,
                          borderBottom: '1px solid #f1f5f9'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = 'var(--primary-teal)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--navy-800)'; }}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick CTA on the right */}
          <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0' }}>
            <Link
              to="/book"
              className="btn btn-sm"
              style={{
                background: 'var(--accent-gold)',
                color: 'var(--navy-900)',
                fontWeight: 700,
                fontSize: '0.78rem',
                border: 'none',
                padding: '0.4rem 0.85rem'
              }}
            >
              📅 {t('btnBook')}
            </Link>
            <Link
              to="/queue"
              className="btn btn-sm"
              style={{
                background: 'var(--primary-teal)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.78rem',
                border: 'none',
                padding: '0.4rem 0.85rem'
              }}
            >
              ⏱️ Live Status
            </Link>
          </div>
        </div>

        {/* 5. MOBILE ACCORDION MENU */}
        {mobileMenuOpen && (
          <div className="mobile-only" style={{ background: 'var(--navy-900)', padding: '1rem', borderTop: '1px solid var(--navy-700)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {navLinks.map((item) => (
                <div key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      display: 'block',
                      padding: '0.55rem 0.5rem',
                      color: isActive(item.path) ? 'var(--accent-gold)' : '#ffffff',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      borderBottom: '1px solid rgba(255,255,255,0.06)'
                    }}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div style={{ paddingLeft: '1rem', background: 'rgba(0,0,0,0.15)' }}>
                      {item.children.map((sub) => (
                        <Link
                          key={sub.path}
                          to={sub.path}
                          onClick={() => setMobileMenuOpen(false)}
                          style={{
                            display: 'block',
                            padding: '0.45rem 0.5rem',
                            color: '#cbd5e1',
                            textDecoration: 'none',
                            fontSize: '0.82rem'
                          }}
                        >
                          ↳ {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Mobile Auth & Demo Controls */}
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.15)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {!user ? (
                  <>
                    <button
                      type="button"
                      onClick={() => { demoLogin('citizen'); setMobileMenuOpen(false); }}
                      className="btn btn-secondary btn-sm"
                    >
                      👤 {t('demoCitizen')}
                    </button>
                    <button
                      type="button"
                      onClick={() => { demoLogin('admin'); setMobileMenuOpen(false); }}
                      className="btn btn-secondary btn-sm"
                    >
                      👑 {t('demoAdmin')}
                    </button>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary btn-sm">
                      {t('login')}
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => setMobileMenuOpen(false)} className="btn btn-primary btn-sm">
                      {user.role === 'admin' ? 'Admin Portal' : t('dashboard')}
                    </Link>
                    <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="btn btn-secondary btn-sm">
                      <LogOut size={14} /> Log Out
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
