import React from 'react';
import { Shield, BookOpen, Award, CheckCircle2, Building2, Users, FileText, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AboutDepartmentPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', paddingBottom: '3rem' }}>
      
      {/* Page Header */}
      <div className="portal-page-header">
        <span className="badge badge-teal" style={{ marginBottom: '0.5rem' }}>Maharashtra Motor Vehicle Department</span>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
          About the Motor Vehicles Department (Transport Commissionerate)
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '800px', lineHeight: 1.6 }}>
          Established under the Motor Vehicles Act, 1988, the Motor Vehicles Department of Maharashtra is tasked with citizen driver licensing, vehicle registration, road safety enforcement, and passenger transit regulation.
        </p>
      </div>

      {/* Project Scope Notice */}
      <div className="gov-card" style={{ borderLeft: '4px solid var(--primary-teal)', background: '#f0fdf4' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <Shield size={28} color="var(--primary-teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.35rem' }}>
              About RTO SmartQueue AI
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--navy-800)', lineHeight: 1.5, margin: 0 }}>
              This portal demonstrates how smart mathematical queuing algorithms, modern web architectures, and interactive public education systems can modernize state transport services. It is an independent citizen-services project and does not replace or represent the official administrative office of the Transport Commissioner.
            </p>
          </div>
        </div>
      </div>

      {/* Vision & Mission */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        <div className="card" style={{ borderTop: '4px solid var(--primary-teal)', padding: '2rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: '#f0fdf4', color: 'var(--primary-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Building2 size={24} />
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.75rem' }}>
            Department Vision
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            To deliver prompt, transparent, and technology-driven citizen mobility services while spearheading proactive road safety initiatives to significantly reduce traffic accidents and fatalities across the state of Maharashtra.
          </p>
        </div>

        <div className="card" style={{ borderTop: '4px solid var(--accent-gold)', padding: '2rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: '#fef3c7', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Shield size={24} />
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.75rem' }}>
            Core Missions
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={16} color="var(--primary-teal)" /> High-integrity driver testing and licensing
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={16} color="var(--primary-teal)" /> Rigorous commercial vehicle fitness checks
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={16} color="var(--primary-teal)" /> Transparent motor vehicle tax collection
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={16} color="var(--primary-teal)" /> 100% computerized queue management and service delivery
            </li>
          </ul>
        </div>
      </div>

      {/* Organizational Hierarchy */}
      <div className="card" style={{ padding: '2.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '1.5rem' }}>
          Administrative Hierarchy & Regional Structure
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '8px', borderLeft: '3px solid var(--navy-800)' }}>
            <strong style={{ fontSize: '0.9rem', color: 'var(--navy-900)', display: 'block', marginBottom: '0.25rem' }}>
              Transport Commissionerate
            </strong>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
              Headquarters: Mumbai
            </span>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
              Formulates statewide transport policies, monitors revenue collection, and coordinates state-level road safety task forces.
            </p>
          </div>

          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '8px', borderLeft: '3px solid var(--primary-teal)' }}>
            <strong style={{ fontSize: '0.9rem', color: 'var(--navy-900)', display: 'block', marginBottom: '0.25rem' }}>
              Regional Transport Offices (RTO)
            </strong>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
              Headed by Regional Transport Officers
            </span>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
              Execute licensing, registration, driving track evaluations, and enforcement across primary districts (e.g. MH-01, MH-12, MH-31).
            </p>
          </div>

          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '8px', borderLeft: '3px solid var(--accent-gold)' }}>
            <strong style={{ fontSize: '0.9rem', color: 'var(--navy-900)', display: 'block', marginBottom: '0.25rem' }}>
              Deputy RTOs & Sub-Offices
            </strong>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
              Jurisdictional Sub-Divisions
            </span>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
              Deliver localized citizen services to reduce transit burden on regional district headquarters.
            </p>
          </div>
        </div>
      </div>

      {/* Citizen's Charter Commitments */}
      <div className="card" style={{ padding: '2.5rem', background: '#fdf6ea', border: '1px solid #fed7aa' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '1rem' }}>
          Citizen Charter Service Standards
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--navy-800)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          Under the Maharashtra Right to Public Services Act (RTSA), citizen transport transactions are bound by strict statutory delivery timelines:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '6px', border: '1px solid #fde68a' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Learner's Licence Approval</span>
            <strong style={{ display: 'block', fontSize: '1.1rem', color: 'var(--navy-900)', marginTop: '0.25rem' }}>Same Day (Instant)</strong>
          </div>
          <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '6px', border: '1px solid #fde68a' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Driving Licence Dispatch</span>
            <strong style={{ display: 'block', fontSize: '1.1rem', color: 'var(--navy-900)', marginTop: '0.25rem' }}>7 Working Days</strong>
          </div>
          <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '6px', border: '1px solid #fde68a' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Vehicle Ownership Transfer</span>
            <strong style={{ display: 'block', fontSize: '1.1rem', color: 'var(--navy-900)', marginTop: '0.25rem' }}>14 Working Days</strong>
          </div>
          <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '6px', border: '1px solid #fde68a' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No Objection Certificate (NOC)</span>
            <strong style={{ display: 'block', fontSize: '1.1rem', color: 'var(--navy-900)', marginTop: '0.25rem' }}>30 Working Days</strong>
          </div>
        </div>
      </div>

      {/* Official Links */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <a href="https://transport.maharashtra.gov.in" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
          Official Maharashtra Transport Portal <ExternalLink size={14} />
        </a>
        <Link to="/offices" className="btn btn-primary">
          Browse Maharashtra RTO Directory →
        </Link>
      </div>

    </div>
  );
}
