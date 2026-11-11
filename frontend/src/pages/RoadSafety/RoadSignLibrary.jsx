import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Filter, ShieldCheck, AlertCircle } from 'lucide-react';
import { ROAD_SIGNS } from '../../data/portalData';

export function RoadSignLibrary() {
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = ROAD_SIGNS.filter(sign => {
    const matchesCat = category === 'all' || sign.category === category;
    const matchesSearch = !search ||
      sign.name.toLowerCase().includes(search.toLowerCase()) ||
      sign.meaning.toLowerCase().includes(search.toLowerCase()) ||
      sign.id.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <Link to="/road-safety" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <ArrowLeft size={15} /> Back to Gaming Centre
        </Link>
        <span className="badge badge-warning" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
          🛑 Reference: Official Indian Road Signs Catalogue
        </span>
      </div>

      <div className="portal-page-header">
        <span className="badge badge-teal" style={{ marginBottom: '0.4rem' }}>IRC & MVA Standardized</span>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          Indian Standard Traffic Signs Reference
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '800px', lineHeight: 1.5 }}>
          Authorized road signs categorized in accordance with the Motor Vehicles Act, 1988 (First Schedule) and Indian Roads Congress (IRC:67) guidelines.
        </p>
      </div>

      {/* Search & Tabs */}
      <div className="card" style={{ padding: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {['all', 'Mandatory', 'Cautionary', 'Informatory'].map(cat => (
            <button
              key={cat}
              type="button"
              className={`btn btn-sm ${category === cat ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setCategory(cat)}
            >
              {cat === 'all' ? `All Signs (${ROAD_SIGNS.length})` : cat}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', minWidth: '240px', flex: 1, maxWidth: '360px' }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search sign by name or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.2rem' }}
          />
        </div>
      </div>

      {/* Grid of Signs */}
      <div className="grid-3" style={{ gap: '1.5rem' }}>
        {filtered.map(sign => (
          <div
            key={sign.id}
            className="card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderTop: `4px solid ${sign.category === 'Mandatory' ? 'var(--transport-red)' : sign.category === 'Cautionary' ? 'var(--accent-gold)' : 'var(--primary-teal)'}`,
              padding: '1.75rem'
            }}
          >
            <div>
              {/* Graphic Representation */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f8fafc',
                borderRadius: '8px',
                padding: '1.5rem',
                marginBottom: '1.25rem',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: sign.shape === 'Octagon' ? '20%' : sign.shape === 'Triangle' ? '12px' : sign.shape === 'Rectangle' ? '6px' : '50%',
                  border: `5px solid ${sign.color === 'Blue' ? '#1d4ed8' : '#dc2626'}`,
                  background: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '2rem' }}>{sign.icon}</span>
                  <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#dc2626', textTransform: 'uppercase' }}>
                    {sign.shape}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span className={`badge ${sign.category === 'Mandatory' ? 'badge-error' : sign.category === 'Cautionary' ? 'badge-warning' : 'badge-teal'}`} style={{ fontSize: '0.68rem' }}>
                  {sign.category}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                  {sign.id.toUpperCase()}
                </span>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.45rem' }}>
                {sign.name}
              </h3>

              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.85rem' }}>
                {sign.meaning}
              </p>
            </div>

            {sign.fine && (
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', fontSize: '0.75rem', color: 'var(--transport-red)', fontWeight: 700 }}>
                ⚖️ Violation Fine: {sign.fine}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
