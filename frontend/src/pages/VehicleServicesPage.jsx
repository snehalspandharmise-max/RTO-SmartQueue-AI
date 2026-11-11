import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, ExternalLink, Calendar, Search } from 'lucide-react';
import { VEHICLE_SERVICES } from '../data/portalData';

export function VehicleServicesPage() {
  const [search, setSearch] = useState('');

  const filtered = VEHICLE_SERVICES.filter(s =>
    !search ||
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingBottom: '3rem' }}>
      
      {/* Header */}
      <div className="portal-page-header">
        <span className="badge badge-teal" style={{ marginBottom: '0.4rem' }}>Vahan Parivahan System</span>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          Vehicle & Registration Services (Vahan)
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '800px', lineHeight: 1.5 }}>
          Official Vahan 4.0 integration for Maharashtra. Browse new vehicle registration, RC transfer of ownership, hypothecation endorsement, NOC issuance, fitness certificates, and road tax payments.
        </p>
      </div>

      {/* Official Vahan Advisory Box */}
      <div className="gov-card" style={{ borderLeft: '4px solid var(--primary-teal)', background: '#f0fdf4' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.25rem' }}>
              Statutory Vehicle Registration Portal (vahan.parivahan.gov.in)
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--navy-800)', margin: 0 }}>
              All statutory vehicle fee collections, road tax calculations, and official RC certificate prints occur via the Ministry of Road Transport and Highways Vahan 4.0 portal.
            </p>
          </div>
          <a
            href="https://vahan.parivahan.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700 }}
          >
            Open Vahan 4.0 <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: '500px' }}>
        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text"
          className="form-control"
          placeholder="Filter 17 vehicle & RC services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingLeft: '2.4rem' }}
        />
      </div>

      {/* Services Grid */}
      <div className="grid-3" style={{ gap: '1.5rem' }}>
        {filtered.map((service) => (
          <div key={service.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '3px solid var(--primary-teal)' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="badge badge-neutral" style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)' }}>
                  {service.id.toUpperCase()}
                </span>
                {service.smartQueueSupported ? (
                  <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>
                    Queue Optimized
                  </span>
                ) : (
                  <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>
                    Online Direct
                  </span>
                )}
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.45rem', lineHeight: 1.3 }}>
                {service.title}
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.85rem' }}>
                {service.description}
              </p>

              {/* Eligibility */}
              {service.eligibility && (
                <div style={{ fontSize: '0.75rem', color: 'var(--navy-800)', marginBottom: '0.65rem' }}>
                  <strong>Eligibility:</strong> {service.eligibility}
                </div>
              )}

              {/* Documents */}
              {service.documents && service.documents.length > 0 && (
                <div style={{ background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '6px', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--navy-800)', display: 'block', marginBottom: '0.3rem' }}>
                    Required Documents:
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                    {service.documents.map((doc, idx) => (
                      <span key={idx} style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', background: '#ffffff', border: '1px solid #e2e8f0', padding: '0.1rem 0.35rem', borderRadius: '3px' }}>
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
              {service.smartQueueSupported ? (
                <Link to="/book" className="btn btn-primary btn-sm" style={{ flex: 1, textAlign: 'center', fontSize: '0.78rem' }}>
                  <Calendar size={13} /> Book Slot
                </Link>
              ) : (
                <span className="btn btn-secondary btn-sm" style={{ flex: 1, textAlign: 'center', fontSize: '0.75rem', opacity: 0.85 }}>
                  Online Direct
                </span>
              )}
              <a
                href={service.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
              >
                Vahan <ExternalLink size={12} />
              </a>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
