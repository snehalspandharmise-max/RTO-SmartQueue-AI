import React from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  ShieldCheck,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Users,
  FileText,
  Car,
  AlertCircle,
  BarChart3,
  ExternalLink,
  Award,
  Gamepad2,
  Smartphone,
  Phone,
  Search,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ANNOUNCEMENTS, DRIVING_LICENCE_SERVICES, VEHICLE_SERVICES } from '../data/portalData';

export function LandingPage() {
  const { user, demoLogin } = useAuth();
  const { t } = useLanguage();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', paddingBottom: '3rem' }}>
      
      {/* SECTION 1: HERO CITIZEN BANNER */}
      <section style={{
        background: 'linear-gradient(135deg, var(--navy-900) 0%, var(--navy-800) 60%, var(--primary-teal) 100%)',
        color: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        padding: '3.5rem 2rem',
        boxShadow: 'var(--shadow-md)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle decorative background watermark */}
        <div style={{ position: 'absolute', right: '-40px', bottom: '-40px', opacity: 0.06, pointerEvents: 'none' }}>
          <Car size={360} />
        </div>

        <div style={{ maxWidth: '880px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          
          {/* Portal Tag */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.35rem 0.9rem', borderRadius: '9999px', fontSize: '0.78rem', color: '#f8fafc', fontWeight: 600, marginBottom: '1.25rem' }}>
            <span style={{ color: 'var(--accent-gold)' }}>★</span>
            <span>Maharashtra Citizen Transport Services • Regional Transport Offices</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.1rem, 4.5vw, 3.2rem)', fontWeight: 800, color: '#ffffff', lineHeight: 1.15, letterSpacing: '-0.025em', marginBottom: '1.25rem' }}>
            Maharashtra Motor Vehicle Services & <span style={{ color: 'var(--accent-gold)' }}>SmartQueue AI</span>
          </h1>

          <p style={{ fontSize: '1.1rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '2.25rem', maxWidth: '780px', margin: '0 auto 2.25rem' }}>
            An integrated citizen transport portal combining official Sarathi & Vahan service navigation, 
            verifiable mathematical queue optimization ($M/M/c$), and an interactive Road Safety Learning & Gaming Centre.
          </p>

          {/* Primary Action Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            <Link
              to="/book"
              className="btn btn-lg"
              style={{
                background: '#167C80',
                color: '#ffffff',
                fontWeight: 700,
                border: 'none',
                boxShadow: '0 4px 14px rgba(22,124,128,0.4)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              Book an Appointment <ArrowRight size={18} />
            </Link>
            <Link
              to="/queue"
              className="btn btn-secondary btn-lg"
              style={{
                background: '#ffffff',
                color: 'var(--navy-900)',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Clock size={18} color="var(--primary-teal)" /> Track Live Queue
            </Link>
            <Link
              to="/road-safety"
              className="btn btn-lg"
              style={{
                background: 'var(--transport-red)',
                color: '#ffffff',
                fontWeight: 700,
                border: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Gamepad2 size={18} /> Play & Learn Road Safety
            </Link>
          </div>

        </div>
      </section>

      {/* SECTION 2: LATEST ADVISORIES & ANNOUNCEMENTS */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <span className="badge badge-error" style={{ marginBottom: '0.3rem' }}>Notice Board</span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy-900)' }}>
              Latest Transport Department Advisories
            </h2>
          </div>
          <Link to="/announcements" className="btn btn-secondary btn-sm">
            View All Advisories →
          </Link>
        </div>

        <div className="grid-3">
          {ANNOUNCEMENTS.slice(0, 3).map((item) => (
            <div key={item.id} className="card" style={{ borderLeft: `4px solid ${item.priority === 'urgent' ? 'var(--transport-red)' : 'var(--accent-gold)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className={`badge ${item.priority === 'urgent' ? 'badge-error' : 'badge-warning'}`} style={{ fontSize: '0.68rem' }}>
                  {item.category}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.date}</span>
              </div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.45rem', lineHeight: 1.35 }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.85rem' }}>
                {item.summary}
              </p>
              <Link to="/announcements" style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--primary-teal)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                Read full advisory & compliance details →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: CITIZEN SERVICE HUBS (SARATHI & VAHAN) */}
      <section>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 2rem' }}>
          <span className="badge badge-teal" style={{ marginBottom: '0.4rem' }}>Dual Service Portals</span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy-900)', letterSpacing: '-0.02em' }}>
            Sarathi (Licence) & Vahan (Vehicle) Services
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Comprehensive directory of 33+ services across Maharashtra Motor Vehicles Department.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
          
          {/* Sarathi Card */}
          <div className="card" style={{ borderTop: '4px solid var(--accent-gold)', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <span className="badge badge-warning" style={{ fontSize: '0.72rem', marginBottom: '0.4rem' }}>
                  Sarathi 4.0 Integration
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                  Driving Licence Services
                </h3>
              </div>
              <div style={{ background: '#fdf6ea', padding: '0.6rem', borderRadius: '8px', color: 'var(--accent-gold)' }}>
                <FileText size={26} />
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Learner's licence, permanent driving licence, driving test appointments, conductor licences, renewals, and international driving permits.
            </p>
            <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '6px', marginBottom: '1.25rem' }}>
              <strong style={{ fontSize: '0.78rem', color: 'var(--navy-800)', display: 'block', marginBottom: '0.4rem' }}>
                Featured Services (16 Total):
              </strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {DRIVING_LICENCE_SERVICES.slice(0, 4).map(s => (
                  <span key={s.id} className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                    {s.title}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link to="/services/driving-licence" className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                Explore 16 DL Services
              </Link>
              <a href="https://sarathi.parivahan.gov.in" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                Sarathi Portal <ExternalLink size={13} />
              </a>
            </div>
          </div>

          {/* Vahan Card */}
          <div className="card" style={{ borderTop: '4px solid var(--primary-teal)', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <span className="badge badge-teal" style={{ fontSize: '0.72rem', marginBottom: '0.4rem' }}>
                  Vahan 4.0 Integration
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                  Vehicle & RC Services
                </h3>
              </div>
              <div style={{ background: '#f0fdf4', padding: '0.6rem', borderRadius: '8px', color: 'var(--primary-teal)' }}>
                <Car size={26} />
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              New vehicle registration, RC transfer of ownership, hypothecation termination, NOC, commercial vehicle fitness certification, and tax payments.
            </p>
            <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '6px', marginBottom: '1.25rem' }}>
              <strong style={{ fontSize: '0.78rem', color: 'var(--navy-800)', display: 'block', marginBottom: '0.4rem' }}>
                Featured Services (17 Total):
              </strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {VEHICLE_SERVICES.slice(0, 4).map(s => (
                  <span key={s.id} className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                    {s.title}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link to="/services/vehicle" className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                Explore 17 Vehicle Services
              </Link>
              <a href="https://vahan.parivahan.gov.in" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                Vahan Portal <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: SMARTQUEUE AI & MATHEMATICAL WAIT ENGINE */}
      <section>
        <div className="card" style={{ background: 'linear-gradient(135deg, var(--navy-900) 0%, var(--navy-800) 100%)', color: '#ffffff', padding: '2.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
            <div>
              <div className="badge badge-primary" style={{ marginBottom: '1rem', background: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd', borderColor: '#3b82f6' }}>
                Queueing Theory Innovation
              </div>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '1rem', color: '#ffffff' }}>
                Verifiable, Explainable Wait-Time Engine
              </h2>
              <p style={{ fontSize: '0.92rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Unlike opaque AI predictions, RTO SmartQueue AI uses an explainable mathematical formulation derived from multi-server queueing theory ($M/M/c$).
              </p>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.85rem', color: '#e2e8f0', padding: 0 }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  <CheckCircle2 size={18} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Multi-Counter Workload Allocation:</strong> Calculates real-time service rates ($\mu$) and queue intensity across active certified counters.
                  </div>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  <CheckCircle2 size={18} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Dynamically Weighted Prior:</strong> Blends configured durations with historical sample observations using exponential decay smoothing.
                  </div>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  <CheckCircle2 size={18} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Confidence Bounds:</strong> Generates lower and upper estimates based on empirical variance and token backlog.
                  </div>
                </li>
              </ul>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: 'var(--radius-md)', padding: '1.5rem', fontFamily: 'var(--font-mono)' }}>
              <div style={{ color: 'var(--accent-gold)', fontSize: '0.75rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
                $M/M/c$ Queuing Formulation
              </div>
              <div style={{ fontSize: '0.85rem', color: '#38bdf8', lineHeight: 1.8 }}>
                D_eff(s) = α·D_hist + (1-α)·D_base<br />
                W_residual = Σ max(0, D_eff - elapsed_j)<br />
                W_backlog = Σ D_eff(s_i)<br />
                W_pred = [(W_residual + W_backlog) / c_active] · β_congestion
              </div>
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '0.76rem', color: '#cbd5e1' }}>
                Confidence Interval: [L, U] = W_pred · (1 ± δ)
              </div>
              <div style={{ marginTop: '1.25rem' }}>
                <Link to="/book" className="btn btn-sm" style={{ background: 'var(--accent-gold)', color: 'var(--navy-900)', fontWeight: 700, width: '100%', textAlign: 'center' }}>
                  Try Wait Predictor in Slot Booking →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: ROAD SAFETY & GAMING CENTRE TEASER */}
      <section style={{
        background: 'linear-gradient(135deg, #fdf6ea 0%, #fff7ed 100%)',
        border: '2px solid var(--accent-gold)',
        borderRadius: 'var(--radius-lg)',
        padding: '2.5rem 2rem'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--transport-red)', color: '#ffffff', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              <Gamepad2 size={14} /> Interactive Learning & Gaming
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.75rem' }}>
              Master Traffic Rules & Earn Your Road Safety Certificate
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--navy-800)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Prepare for your Learner's Licence (LL) test and cultivate responsible driving habits through 7 gamified interactive challenges.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <span className="badge badge-neutral" style={{ background: '#ffffff' }}>🚦 Signal Master</span>
              <span className="badge badge-neutral" style={{ background: '#ffffff' }}>🛑 Road Sign Challenge</span>
              <span className="badge badge-neutral" style={{ background: '#ffffff' }}>⚠️ Hazard Hunter</span>
              <span className="badge badge-neutral" style={{ background: '#ffffff' }}>🚗 2D Canvas Driving Sim</span>
              <span className="badge badge-neutral" style={{ background: '#ffffff' }}>📝 LL Practice Exam</span>
            </div>
            <Link to="/road-safety" className="btn btn-lg" style={{ background: 'var(--transport-red)', color: '#ffffff', fontWeight: 700, border: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={18} /> Enter Road Safety Gaming Centre →
            </Link>
          </div>

          <div style={{ background: '#ffffff', padding: '1.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #fed7aa', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={18} color="var(--accent-gold)" /> Road Safety Achievement Certificate
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
              Complete the Learner's Licence Test or Road Safety Championship to generate a downloadable, cryptographically verifiable Road Safety Achievement Certificate.
            </p>
            <div style={{ border: '2px dashed #fed7aa', borderRadius: '6px', padding: '1rem', background: '#fffbeb', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--navy-900)', display: 'block' }}>
                MAHARASHTRA ROAD SAFETY PLEDGE
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', margin: '0.35rem 0' }}>
                "I pledge to follow all traffic rules, wear seatbelts/helmets, and protect pedestrians."
              </span>
              <Link to="/road-safety" className="btn btn-secondary btn-sm" style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
                Take the Test & Claim Certificate
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: MAHARASHTRA RTO OFFICES SHOWCASE */}
      <section>
        <div className="card" style={{ padding: '2rem 2.5rem', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
                Statewide Network
              </span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                Official Regional Transport Offices
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Verified against the Maharashtra Motor Vehicle Department regional directory (<a href="https://transport.maharashtra.gov.in/1184/Regional-Offices" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>transport.maharashtra.gov.in</a>).
              </p>
            </div>
            <Link to="/offices" className="btn btn-primary">
              View All 20+ Maharashtra Offices →
            </Link>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
            {[
              { code: 'MH-01', name: 'Mumbai Central (Tardeo)' },
              { code: 'MH-02', name: 'Mumbai West (Andheri)' },
              { code: 'MH-03', name: 'Mumbai East (Wadala)' },
              { code: 'MH-04', name: 'Thane' },
              { code: 'MH-05', name: 'Kalyan' },
              { code: 'MH-12', name: 'Pune' },
              { code: 'MH-14', name: 'Pimpri-Chinchwad' },
              { code: 'MH-15', name: 'Nashik' },
              { code: 'MH-20', name: 'Chh. Sambhajinagar' },
              { code: 'MH-31', name: 'Nagpur City' },
              { code: 'MH-43', name: 'Navi Mumbai' },
              { code: 'MH-46', name: 'Panvel' },
              { code: 'MH-47', name: 'Borivali' },
              { code: 'MH-48', name: 'Vasai' }
            ].map(item => (
              <span
                key={item.code}
                className="badge badge-neutral"
                style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>{item.code}</strong> {item.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: 6-STEP CITIZEN SERVICE JOURNEY */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--navy-900)' }}>
            Transparent 6-Step Citizen Workflow
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            How SmartQueue AI transforms the traditional RTO visit into a frictionless experience.
          </p>
        </div>

        <div className="grid-3" style={{ gap: '1.25rem' }}>
          {[
            { step: '1', title: 'Choose RTO Service', desc: 'Select driving licence or vehicle registration category with document checklist.' },
            { step: '2', title: 'Select Regional Office', desc: 'Pick your jurisdictional RTO office code (MH-01 to MH-50).' },
            { step: '3', title: 'Pick Recommended Slot', desc: 'View AI-recommended Lowest Wait, Balanced, or Convenient time slots.' },
            { step: '4', title: 'Get Digital Queue Pass', desc: 'Receive your instant QR token with timestamp and counter eligibility.' },
            { step: '5', title: 'Live Tracker & Alerts', desc: 'Monitor queue progress and customers ahead on your mobile browser.' },
            { step: '6', title: 'Counter Fast-Track', desc: 'Approach your assigned counter when called with zero waiting anxiety.' },
          ].map((s) => (
            <div key={s.step} className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--primary-teal)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.9rem',
                flexShrink: 0
              }}>
                {s.step}
              </div>
              <div>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.25rem' }}>{s.title}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
