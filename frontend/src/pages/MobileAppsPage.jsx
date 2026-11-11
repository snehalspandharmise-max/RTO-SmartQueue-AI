import React from 'react';
import { Smartphone, Download, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { VERIFIED_MOBILE_APPS } from '../data/portalData';

export function MobileAppsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingBottom: '3rem' }}>
      
      {/* Header */}
      <div className="portal-page-header">
        <span className="badge badge-teal" style={{ marginBottom: '0.4rem' }}>Official Mobile Ecosystem</span>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          Official Citizen Mobile Applications
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '800px', lineHeight: 1.5 }}>
          Authorized Android and iOS smartphone applications developed by NIC and Government of Maharashtra for digital driving licences, vehicle RC sharing, challan payments, and transport services.
        </p>
      </div>

      {/* Advisory Banner */}
      <div className="gov-card" style={{ borderLeft: '4px solid var(--accent-gold)', background: '#fffbeb' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShieldCheck size={24} color="var(--accent-gold)" style={{ flexShrink: 0 }} />
          <div>
            <strong style={{ fontSize: '0.88rem', color: 'var(--navy-900)', display: 'block' }}>
              Legal Validity of Digital Documents
            </strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--navy-800)' }}>
              Under Rule 139 of the Central Motor Vehicles Rules (CMVR), driving licences and vehicle registration certificates presented electronically via mParivahan and DigiLocker are legally equivalent to original physical cards.
            </span>
          </div>
        </div>
      </div>

      {/* Apps Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
        {VERIFIED_MOBILE_APPS.map(app => (
          <div key={app.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, var(--navy-900) 0%, var(--primary-teal) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: 'var(--shadow-sm)',
                  flexShrink: 0
                }}>
                  <Smartphone size={28} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--navy-900)', lineHeight: 1.2 }}>
                    {app.name}
                  </h2>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                    By {app.developer}
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {app.description}
              </p>

              {/* Features */}
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--navy-800)', display: 'block', marginBottom: '0.5rem' }}>
                  Key Capabilities:
                </span>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {app.features.map((feat, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <CheckCircle2 size={14} color="var(--primary-teal)" /> {feat}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <a
              href={app.playStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%' }}
            >
              <Download size={16} /> Get on Google Play <ExternalLink size={14} />
            </a>
          </div>
        ))}
      </div>

    </div>
  );
}
