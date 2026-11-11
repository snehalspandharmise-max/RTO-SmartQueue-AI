import React, { useState } from 'react';
import { AlertCircle, Calendar, Tag, Search, Filter, ShieldCheck } from 'lucide-react';
import { ANNOUNCEMENTS } from '../data/portalData';

export function AnnouncementsPage() {
  const [filterCategory, setFilterCategory] = useState('all');
  const [search, setSearch] = useState('');

  const categories = ['all', 'Vehicle Compliance', 'Road Safety', 'Legal Advisory', 'Citizen Service'];

  const filtered = ANNOUNCEMENTS.filter(item => {
    const matchesCat = filterCategory === 'all' || item.category === filterCategory;
    const matchesSearch = !search ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.summary.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingBottom: '3rem' }}>
      
      {/* Header */}
      <div className="portal-page-header">
        <span className="badge badge-error" style={{ marginBottom: '0.4rem' }}>Official Notifications</span>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          Transport Department Advisories & Circulars
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '800px', lineHeight: 1.5 }}>
          Stay updated with official notifications, regulatory compliance deadlines, fee revisions, and citizen circulars issued by the Maharashtra Motor Vehicles Department.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="card" style={{ padding: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              className={`btn btn-sm ${filterCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterCategory(cat)}
            >
              {cat === 'all' ? 'All Advisories' : cat}
            </button>
          ))}
        </div>

        <div style={{ minWidth: '240px', flex: '1', maxWidth: '350px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search notifications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Announcements List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filtered.map(item => (
          <div
            key={item.id}
            className="card"
            style={{
              borderLeft: `5px solid ${item.priority === 'urgent' ? 'var(--transport-red)' : 'var(--accent-gold)'}`,
              padding: '1.75rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span className={`badge ${item.priority === 'urgent' ? 'badge-error' : 'badge-warning'}`}>
                  {item.category}
                </span>
                {item.priority === 'urgent' && (
                  <span className="badge badge-error" style={{ fontSize: '0.68rem', animation: 'pulse 2s infinite' }}>
                    Urgent Compliance
                  </span>
                )}
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <Calendar size={13} /> {item.date}
              </span>
            </div>

            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
              {item.title}
            </h2>

            <p style={{ fontSize: '0.88rem', color: 'var(--navy-800)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
              {item.summary}
            </p>

            <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '6px', fontSize: '0.825rem', color: 'var(--text-secondary)', border: '1px solid #e2e8f0' }}>
              <strong style={{ color: 'var(--navy-900)', display: 'block', marginBottom: '0.25rem' }}>
                Citizen Directive:
              </strong>
              {item.details}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>No advisories match your search criteria.</p>
          </div>
        )}
      </div>

    </div>
  );
}
