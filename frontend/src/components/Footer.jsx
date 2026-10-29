import React from 'react';
import { ShieldCheck, BookOpen, Cpu } from 'lucide-react';

export function Footer() {
  return (
    <footer style={{ background: '#ffffff', borderTop: '1px solid var(--border)', marginTop: '4rem', padding: '2.5rem 0 1.5rem' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.6rem' }}>
              RTO SmartQueue AI
            </h4>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Citizen-focused predictive queue estimation and workload balancing system for Regional Transport Offices.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.6rem' }}>
              Academic Scope & Viva
            </h4>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Final Year Computer Engineering Capstone Project. Incorporates mathematical queueing modeling ($M/M/c$), multi-objective slot recommendations, and role-based access control.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.6rem' }}>
              Technology Stack
            </h4>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              React 18 • Vite • Express.js REST API • Supabase PostgreSQL & Auth • Recharts • Lucide Icons.
            </p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <p>© 2026 RTO SmartQueue AI — Academic Demonstration Project. Not an official government portal.</p>
          <p>Built with verifiable mathematical algorithms & explainable wait factors.</p>
        </div>
      </div>
    </footer>
  );
}
