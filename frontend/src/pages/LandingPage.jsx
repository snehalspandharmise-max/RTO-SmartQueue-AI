import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ShieldCheck, Cpu, ArrowRight, CheckCircle2, Users, FileText, Car, AlertCircle, BarChart3 } from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';

export function LandingPage() {
  const { user, demoLogin } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', paddingBottom: '3rem' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '3.5rem 1rem 2rem', maxWidth: '840px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.8rem', color: '#1d4ed8', fontWeight: 600, marginBottom: '1.5rem' }}>
          <Cpu size={14} />
          Predictive Analytics & Counter Workload Optimization
        </div>

        <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', fontWeight: 800, color: 'var(--navy-900)', lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: '1.25rem' }}>
          Eliminate Unpredictable RTO Waiting with <span style={{ color: 'var(--primary)' }}>Smart Queue AI</span>
        </h1>

        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2.25rem' }}>
          A citizen-centric appointment and queue prediction platform designed for Regional Transport Offices. 
          Combines transparent mathematical queue estimations, smart slot recommendations, and administrator-assisted workload balancing.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <Link to="/book" className="btn btn-primary btn-lg" style={{ boxShadow: 'var(--shadow)' }}>
            Book an Appointment <ArrowRight size={18} />
          </Link>
          <Link to="/queue" className="btn btn-secondary btn-lg">
            <Clock size={18} /> Track Live Queue
          </Link>
        </div>

        {/* Viva Quick Launch Box */}
        <div style={{ marginTop: '2.5rem', padding: '1rem', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 'var(--radius-md)', display: 'inline-block' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.5rem' }}>
            ⚡ External Viva One-Click Quick Launch:
          </span>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button onClick={() => demoLogin('citizen')} className="btn btn-secondary btn-sm">
              👤 Login as Demo Citizen
            </button>
            <button onClick={() => demoLogin('admin')} className="btn btn-secondary btn-sm">
              👑 Login as Administrator
            </button>
          </div>
        </div>
      </section>

      {/* 3-Step Simple Process */}
      <section className="container">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--navy-900)' }}>
            How SmartQueue Works
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Transparent 3-step citizen journey from booking to counter service.
          </p>
        </div>

        <div className="grid-3">
          <div className="card">
            <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: '#eff6ff', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', fontWeight: 700 }}>
              1
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Select Service & Date</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Choose your RTO office, target service, and preferred date with real-time slot availability.
            </p>
          </div>

          <div className="card" style={{ borderTop: '3px solid var(--primary)' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: '#eff6ff', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', fontWeight: 700 }}>
              2
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Smart Wait Recommendations</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Evaluate slots categorized by <strong>Lowest Wait</strong>, <strong>Balanced</strong>, and <strong>Most Convenient</strong> based on our mathematical queue model.
            </p>
          </div>

          <div className="card">
            <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: '#eff6ff', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', fontWeight: 700 }}>
              3
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Live Token Tracking</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Receive a verified queue token, monitor customers ahead, and view explainable delay factors in real-time.
            </p>
          </div>
        </div>
      </section>

      {/* Differentiating Feature: Predictive Wait Engine */}
      <section className="container">
        <div className="card" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#ffffff', padding: '2.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
            <div>
              <div className="badge badge-primary" style={{ marginBottom: '1rem', background: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd', borderColor: '#3b82f6' }}>
                Core Academic Innovation
              </div>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 700, lineHeight: 1.25, marginBottom: '1rem', color: '#ffffff' }}>
                Verifiable, Explainable Wait-Time Engine
              </h2>
              <p style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Unlike opaque AI predictions, RTO SmartQueue AI uses an explainable mathematical formulation derived from multi-server queueing theory ($M/M/c$).
              </p>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: '#e2e8f0' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="#38bdf8" /> <strong>Multi-Counter Workload Allocation:</strong> Considers active certified counters per service.
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="#38bdf8" /> <strong>Dynamically Weighted Prior:</strong> Blends configured durations with historical sample observations.
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="#38bdf8" /> <strong>Confidence Bounds:</strong> Generates lower and upper estimates based on empirical variance.
                </li>
              </ul>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 'var(--radius-md)', padding: '1.5rem', fontFamily: 'var(--font-mono)' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Mathematical Formulation
              </div>
              <div style={{ fontSize: '0.85rem', color: '#38bdf8', lineHeight: 1.7 }}>
                D_eff(s) = α·D_hist + (1-α)·D_base<br />
                W_residual = Σ max(0, D_eff - elapsed_j)<br />
                W_backlog = Σ D_eff(s_i)<br />
                W_pred = [(W_residual + W_backlog) / c_active] · β_congestion
              </div>
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '0.75rem', color: '#cbd5e1' }}>
                Confidence Interval: [L, U] = W_pred · (1 ± δ)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="container">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--navy-900)' }}>
            Supported Demonstration Services
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Configurable processing times and appointment capacities stored in PostgreSQL.
          </p>
        </div>

        <div className="grid-3">
          <div className="card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <FileText size={18} color="var(--primary)" /> Driving Licence (DL)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Permanent driving licence biometrics, document verification, and practical tests.
            </p>
            <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>Baseline: ~15 mins</span>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <FileText size={18} color="var(--primary)" /> Learner's Licence (LL)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Online learner licence approval, road rules knowledge test, and issuance.
            </p>
            <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>Baseline: ~10 mins</span>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Car size={18} color="var(--primary)" /> Vehicle Registration (VR)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              New vehicle registration, chassis verification, and smart card assignment.
            </p>
            <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>Baseline: ~25 mins</span>
          </div>
        </div>
      </section>
    </div>
  );
}
