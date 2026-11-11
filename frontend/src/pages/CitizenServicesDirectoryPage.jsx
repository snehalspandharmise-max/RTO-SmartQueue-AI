import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, FileText, Car, ExternalLink, Calendar, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';
import { DRIVING_LICENCE_SERVICES, VEHICLE_SERVICES } from '../data/portalData';

export function CitizenServicesDirectoryPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all'); // all, dl, vehicle

  const allServices = useMemo(() => {
    const dl = DRIVING_LICENCE_SERVICES.map(s => ({ ...s, portalType: 'Sarathi (DL)', categoryKey: 'dl' }));
    const veh = VEHICLE_SERVICES.map(s => ({ ...s, portalType: 'Vahan (Vehicle)', categoryKey: 'vehicle' }));
    return [...dl, ...veh];
  }, []);

  const filteredServices = useMemo(() => {
    return allServices.filter(s => {
      const matchesCategory = category === 'all' || s.categoryKey === category;
      const term = search.toLowerCase();
      const matchesSearch = !term ||
        s.title.toLowerCase().includes(term) ||
        s.description.toLowerCase().includes(term) ||
        s.id.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [allServices, category, search]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingBottom: '3rem' }}>
      
      {/* Header */}
      <div className="portal-page-header">
        <span className="badge badge-teal" style={{ marginBottom: '0.4rem' }}>Citizen Services Directory</span>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          Maharashtra Transport Services Catalogue
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '800px', lineHeight: 1.5 }}>
          Unified access to 33+ driving licence (Sarathi) and vehicle registration (Vahan) services across regional transport offices in Maharashtra.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search by service name, code, or description (e.g. learner, transfer, permit)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.4rem' }}
            />
          </div>

          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`btn btn-sm ${category === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setCategory('all')}
            >
              All Services ({allServices.length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${category === 'dl' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setCategory('dl')}
            >
              Driving Licence ({DRIVING_LICENCE_SERVICES.length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${category === 'vehicle' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setCategory('vehicle')}
            >
              Vehicle & RC ({VEHICLE_SERVICES.length})
            </button>
          </div>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Showing <strong>{filteredServices.length}</strong> services matching your criteria</span>
          <span style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>⚡ Services tagged with "SmartQueue Ready" support AI slot booking</span>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid-3" style={{ gap: '1.5rem' }}>
        {filteredServices.map((service) => (
          <div key={service.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: `3px solid ${service.categoryKey === 'dl' ? 'var(--accent-gold)' : 'var(--primary-teal)'}` }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <span className={`badge ${service.categoryKey === 'dl' ? 'badge-warning' : 'badge-teal'}`} style={{ fontSize: '0.68rem' }}>
                  {service.portalType}
                </span>
                {service.smartQueueSupported && (
                  <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>
                    SmartQueue Ready
                  </span>
                )}
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.45rem', lineHeight: 1.3 }}>
                {service.title}
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.85rem' }}>
                {service.description}
              </p>

              {/* Documents Needed */}
              {service.documents && service.documents.length > 0 && (
                <div style={{ background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '6px', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--navy-800)', display: 'block', marginBottom: '0.3rem' }}>
                    Required Documents:
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                    {service.documents.slice(0, 3).map((doc, idx) => (
                      <span key={idx} style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', background: '#ffffff', border: '1px solid #e2e8f0', padding: '0.1rem 0.35rem', borderRadius: '3px' }}>
                        {doc}
                      </span>
                    ))}
                    {service.documents.length > 3 && (
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>+{service.documents.length - 3} more</span>
                    )}
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
                  Walk-in / Online
                </span>
              )}
              
              <a
                href={service.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
                title={`Official Portal for ${service.title}`}
                style={{ fontSize: '0.78rem' }}
              >
                Apply <ExternalLink size={12} />
              </a>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
