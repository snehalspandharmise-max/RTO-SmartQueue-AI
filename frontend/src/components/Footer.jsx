import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ExternalLink, Phone, Heart, BookOpen, Layers, Award } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer style={{ background: 'var(--navy-900)', color: '#ffffff', marginTop: '4rem', borderTop: '4px solid var(--accent-gold)' }}>
      {/* 1. TOP SAFETY BANNER */}
      <div style={{ background: 'var(--navy-800)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0.85rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ background: 'var(--transport-red)', color: '#ffffff', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
              Safety First
            </span>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f8fafc' }}>
              "सडक सुरक्षा, जीवन रक्षा" — Always wear a helmet and seat belt. Never drink and drive.
            </span>
          </div>
          <Link
            to="/road-safety"
            style={{
              color: 'var(--accent-gold)',
              fontSize: '0.82rem',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            🎮 {t('btnPlayGames')} →
          </Link>
        </div>
      </div>

      {/* 2. MAIN FOOTER NAVIGATION (4 COLUMNS) */}
      <div className="container" style={{ padding: '3.5rem 1rem 2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
          
          {/* Column 1: System Identification */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ background: 'var(--primary-teal)', padding: '0.4rem', borderRadius: '6px', color: '#ffffff', display: 'flex' }}>
                <Layers size={20} />
              </div>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
                RTO SmartQueue <span style={{ color: 'var(--accent-gold)' }}>AI</span>
              </span>
            </div>
            <p style={{ fontSize: '0.825rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '1rem' }}>
              Intelligent multi-server queue prediction and citizen appointment orchestration platform for Regional Transport Offices across Maharashtra.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.06)', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', color: '#cbd5e1' }}>
              <Award size={16} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
              <span>Maharashtra Citizen Transport Platform</span>
            </div>
          </div>

          {/* Column 2: Official Government Portals (Strictly Disclaimed) */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem', borderBottom: '2px solid var(--accent-gold)', display: 'inline-block', paddingBottom: '0.25rem' }}>
              Official Portals
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.825rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <a href="https://transport.maharashtra.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: '#cbd5e1', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  Maharashtra Motor Vehicle Dept <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://sarathi.parivahan.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: '#cbd5e1', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  Sarathi Parivahan (Driving Licence) <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://vahan.parivahan.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: '#cbd5e1', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  Vahan Parivahan (Vehicle Registration) <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://morth.nic.in" target="_blank" rel="noopener noreferrer" style={{ color: '#cbd5e1', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  MoRTH India <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://www.digilocker.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: '#cbd5e1', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  DigiLocker Digital Documents <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Citizen Services & Modules */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem', borderBottom: '2px solid var(--primary-teal)', display: 'inline-block', paddingBottom: '0.25rem' }}>
              Citizen Modules
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.825rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <Link to="/services/driving-licence" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
                  Driving Licence Directory (16 Services)
                </Link>
              </li>
              <li>
                <Link to="/services/vehicle" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
                  Vehicle & RC Directory (17 Services)
                </Link>
              </li>
              <li>
                <Link to="/offices" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
                  Maharashtra RTO Directory (20+ Offices)
                </Link>
              </li>
              <li>
                <Link to="/book" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
                  SmartQueue Appointment Booking
                </Link>
              </li>
              <li>
                <Link to="/queue" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
                  Live Queue Tracker & Digital Pass
                </Link>
              </li>
              <li>
                <Link to="/road-safety" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
                  Road Safety Learning &amp; Games
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Helplines & Assistance */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem', borderBottom: '2px solid var(--transport-red)', display: 'inline-block', paddingBottom: '0.25rem' }}>
              Emergency Helplines
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.825rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.6rem 0.8rem', borderRadius: '6px' }}>
                <span style={{ display: 'block', color: '#94a3b8', fontSize: '0.72rem' }}>Maharashtra RTO Citizen Helpline</span>
                <strong style={{ color: 'var(--accent-gold)', fontSize: '0.95rem' }}>1800-22-0110</strong> (Toll Free)
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.6rem 0.8rem', borderRadius: '6px' }}>
                <span style={{ display: 'block', color: '#94a3b8', fontSize: '0.72rem' }}>National Highway Accident Helpline</span>
                <strong style={{ color: '#ffffff', fontSize: '0.95rem' }}>1033</strong> (24x7)
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.6rem 0.8rem', borderRadius: '6px' }}>
                <span style={{ display: 'block', color: '#94a3b8', fontSize: '0.72rem' }}>National Unified Emergency Number</span>
                <strong style={{ color: '#ffffff', fontSize: '0.95rem' }}>112</strong> (Police/Fire/Medical)
              </div>
            </div>
          </div>
        </div>

        {/* 3. DISCREET DISCLAIMER */}
        <p style={{ fontSize: '0.72rem', color: '#64748b', textAlign: 'center', lineHeight: 1.5, marginBottom: '1.5rem' }}>
          RTO SmartQueue AI is an independent citizen-services project and is not an official Maharashtra Government website. Official government transactions must be completed through authorized government portals.
        </p>

        {/* 4. COPYRIGHT & ATTRIBUTION BAR */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.76rem',
          color: '#94a3b8'
        }}>
          <div>
            © 2026 RTO SmartQueue AI. Built with React, Vite, Node/Express &amp; Supabase PostgreSQL.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/about" style={{ color: '#cbd5e1', textDecoration: 'none' }}>About</Link>
            <Link to="/services" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Service Catalog</Link>
            <Link to="/contact" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Contact &amp; Grievances</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
