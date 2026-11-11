import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { 
  Building2, 
  Search, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  ExternalLink, 
  ShieldCheck, 
  Activity, 
  Layers,
  Filter
} from 'lucide-react';
import { MAHARASHTRA_REGIONS } from '../data/maharashtraOffices';

export function RtoDirectoryPage() {
  const navigate = useNavigate();
  const [offices, setOffices] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [onlyLiveQueue, setOnlyLiveQueue] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const [officesRes, servicesRes] = await Promise.all([
          api.get('/offices'),
          api.get('/services')
        ]);
        setOffices(officesRes.offices || []);
        setServices(servicesRes.services || []);
      } catch (err) {
        setError(err.message || 'Failed to load Maharashtra RTO Directory.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filtered offices
  const filteredOffices = useMemo(() => {
    return offices.filter(office => {
      // Region filter
      if (selectedRegion !== 'All Regions' && office.region !== selectedRegion) {
        return false;
      }
      // Live queue filter
      if (onlyLiveQueue && !office.has_live_queue_integration) {
        return false;
      }
      // Search query
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const matchesCode = office.office_code?.toLowerCase().includes(q);
        const matchesName = office.office_name?.toLowerCase().includes(q);
        const matchesCity = office.city?.toLowerCase().includes(q);
        const matchesDistrict = office.district?.toLowerCase().includes(q);
        const matchesAddress = office.address?.toLowerCase().includes(q);
        if (!matchesCode && !matchesName && !matchesCity && !matchesDistrict && !matchesAddress) {
          return false;
        }
      }
      return true;
    });
  }, [offices, selectedRegion, onlyLiveQueue, search]);

  // Group by region if "All Regions" is selected
  const groupedOffices = useMemo(() => {
    if (selectedRegion !== 'All Regions') {
      return { [selectedRegion]: filteredOffices };
    }
    const groups = {};
    filteredOffices.forEach(office => {
      const reg = office.region || 'Other Maharashtra Offices';
      if (!groups[reg]) groups[reg] = [];
      groups[reg].push(office);
    });
    return groups;
  }, [filteredOffices, selectedRegion]);

  const serviceMap = useMemo(() => {
    const map = {};
    services.forEach(s => {
      map[s.service_code] = s.name;
    });
    return map;
  }, [services]);

  const handleBookAtOffice = (officeId) => {
    navigate(`/book?officeId=${officeId}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
      {/* Hero Header */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)', color: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '2.5rem 2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '820px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(4px)', padding: '0.3rem 0.75rem', borderRadius: '9999px', fontSize: '0.78rem', marginBottom: '1rem', fontWeight: 600 }}>
            <Building2 size={14} /> Official Directory & Live Dispatch Network
          </div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.4rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '0.75rem' }}>
            Maharashtra Regional Transport Offices
          </h1>
          <p style={{ fontSize: '1rem', opacity: 0.9, lineHeight: 1.5, marginBottom: '1.25rem' }}>
            Explore verified RTO and Deputy RTO locations across Maharashtra, view supported government services, and connect to smart queue-enabled dispatch centers.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.85rem' }}>
            <div>
              <span style={{ opacity: 0.75, display: 'block', fontSize: '0.75rem' }}>Total Offices Catalogued</span>
              <strong style={{ fontSize: '1.25rem' }}>{offices.length} Locations</strong>
            </div>
            <div>
              <span style={{ opacity: 0.75, display: 'block', fontSize: '0.75rem' }}>Live Queue Integrated</span>
              <strong style={{ fontSize: '1.25rem', color: '#86efac' }}>
                {offices.filter(o => o.has_live_queue_integration).length} Centers Active
              </strong>
            </div>
            <div>
              <span style={{ opacity: 0.75, display: 'block', fontSize: '0.75rem' }}>Reference Standard</span>
              <strong style={{ fontSize: '1rem' }}>transport.maharashtra.gov.in</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Official Directory Disclaimer */}
      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', display: 'flex', alignItems: 'flex-start', gap: '0.85rem', fontSize: '0.85rem', color: '#1e3a8a', lineHeight: 1.5 }}>
        <AlertCircle size={20} style={{ color: '#2563eb', flexShrink: 0, marginTop: '0.1rem' }} />
        <div>
          <strong>Official Reference Notice:</strong> Office codes and names are verified against the official Maharashtra Motor Vehicle Department regional-office directory. The presence of an office in this directory documents official jurisdiction and does not imply that every physical office currently operates live electronic multi-counter tracking. Centers marked <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Online Queue Active</span> are fully connected to our algorithmic wait-time optimization engine.
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search Box */}
          <div style={{ flex: '1 1 280px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search by Office Code (e.g. MH-01, MH-12), City, Area, or District..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Region Dropdown */}
          <div style={{ minWidth: '220px' }}>
            <select
              className="form-select"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              {MAHARASHTRA_REGIONS.map(reg => (
                <option key={reg} value={reg}>{reg}</option>
              ))}
            </select>
          </div>

          {/* Live Queue Filter Toggle */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy-800)' }}>
            <input
              type="checkbox"
              checked={onlyLiveQueue}
              onChange={(e) => setOnlyLiveQueue(e.target.checked)}
            />
            Show Only Live Queue Integrated
          </label>
        </div>

        {/* Quick Region Pill Bar */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
          {MAHARASHTRA_REGIONS.map(reg => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`btn btn-sm ${selectedRegion === reg ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.7rem' }}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Grid Display */}
      {loading ? (
        <div className="card state-box">
          <div className="spinner"></div>
          <p>Loading verified Maharashtra RTO directory...</p>
        </div>
      ) : error ? (
        <div className="card state-box" style={{ color: 'var(--danger)' }}>
          <AlertCircle size={36} style={{ margin: '0 auto 0.75rem' }} />
          <p>{error}</p>
        </div>
      ) : filteredOffices.length === 0 ? (
        <div className="card state-box">
          <Building2 size={36} style={{ color: 'var(--text-muted)', margin: '0 auto 0.75rem' }} />
          <h3 style={{ fontSize: '1.1rem', color: 'var(--navy-900)' }}>No matching RTO offices found</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Try adjusting your search query or selecting "All Regions".
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {Object.entries(groupedOffices).map(([regionName, officeList]) => {
            if (!officeList || officeList.length === 0) return null;
            return (
              <div key={regionName}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '2px solid var(--border)', paddingBottom: '0.5rem' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                    {regionName}
                  </h2>
                  <span className="badge badge-neutral" style={{ fontSize: '0.725rem' }}>
                    {officeList.length} Offices
                  </span>
                </div>

                <div className="grid-2">
                  {officeList.map((office) => {
                    const isLive = office.has_live_queue_integration;
                    const supportedCodes = office.supported_service_codes || ['DL', 'LL', 'VR', 'TO', 'RC'];

                    return (
                      <div
                        key={office.id}
                        className="card"
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          borderTop: isLive ? '3px solid var(--primary)' : '3px solid #cbd5e1',
                          padding: '1.5rem',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.75rem' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                                <span className="badge badge-primary" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700 }}>
                                  {office.office_code}
                                </span>
                                {isLive ? (
                                  <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>
                                    <Activity size={12} /> Online Queue Active
                                  </span>
                                ) : (
                                  <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>
                                    Directory Record
                                  </span>
                                )}
                              </div>
                              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy-900)', lineHeight: 1.3 }}>
                                {office.office_name}
                              </h3>
                            </div>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                              <MapPin size={15} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '0.15rem' }} />
                              <span>{office.address}, {office.city} - {office.pincode} ({office.district} Dist.)</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <Clock size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                              <span>Hours: {office.operating_hours_start?.substring(0, 5)} - {office.operating_hours_end?.substring(0, 5)} (Mon - Fri)</span>
                            </div>
                          </div>

                          {/* Supported Services Badges */}
                          <div style={{ marginBottom: '1.25rem' }}>
                            <span style={{ fontSize: '0.725rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.4rem' }}>
                              Available Service Facilities:
                            </span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                              {supportedCodes.map(code => (
                                <span
                                  key={code}
                                  className="badge badge-neutral"
                                  title={serviceMap[code] || code}
                                  style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
                                >
                                  {code} — {serviceMap[code] || code}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                          <span style={{ fontSize: '0.75rem', color: isLive ? 'var(--teal-text)' : 'var(--text-muted)', fontWeight: 500 }}>
                            {isLive ? '✓ Multi-Counter Live Dispatch' : 'Informational RTO Reference'}
                          </span>
                          <button
                            onClick={() => handleBookAtOffice(office.id)}
                            className={`btn btn-sm ${isLive ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ fontSize: '0.8rem' }}
                          >
                            Book at this Office <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
