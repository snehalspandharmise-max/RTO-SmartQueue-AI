import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';

export function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: 'Feedback', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate feedback submission or dispatch to API
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', subject: 'Feedback', message: '' });
    }, 500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingBottom: '3rem' }}>
      
      {/* Header */}
      <div className="portal-page-header">
        <span className="badge badge-teal" style={{ marginBottom: '0.4rem' }}>Citizen Support & Contact</span>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          Contact Us & Citizen Grievance Portal
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '800px', lineHeight: 1.5 }}>
          Reach out to the Maharashtra Motor Vehicles Department, access 24x7 toll-free helpline numbers, or submit feedback regarding your RTO visit.
        </p>
      </div>

      {/* Helplines Grid */}
      <div className="grid-3" style={{ gap: '1.5rem' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--accent-gold)' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
            Toll-Free Citizen Helpline
          </span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy-900)', margin: '0.35rem 0' }}>
            1800-22-0110
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
            Operates 10:00 AM – 6:00 PM on all official Maharashtra government working days.
          </p>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--transport-red)' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
            National Highway Emergency
          </span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy-900)', margin: '0.35rem 0' }}>
            1033
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
            24x7 Emergency assistance for road accidents, breakdowns, and towing on National Highways.
          </p>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--primary-teal)' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
            Unified Emergency Response
          </span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy-900)', margin: '0.35rem 0' }}>
            112
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
            All-India Emergency Number (Police, Fire, and Emergency Medical Services).
          </p>
        </div>
      </div>

      {/* Main Content: Office Location + Grievance Form */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        
        {/* Department Headquarters Address */}
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '1.25rem' }}>
            Transport Commissionerate Headquarters
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <MapPin size={20} color="var(--primary-teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.85rem', color: 'var(--navy-800)', lineHeight: 1.5 }}>
                <strong>Office of the Transport Commissioner</strong><br />
                Administrative Building, 5th Floor,<br />
                Near Dr. Ambedkar Garden, Government Colony,<br />
                Bandra (East), Mumbai, Maharashtra 400051.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Mail size={20} color="var(--primary-teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.85rem', color: 'var(--navy-800)' }}>
                <strong>Official Email:</strong><br />
                commr.transport@maharashtra.gov.in
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '0.5rem' }}>
              <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.4rem' }}>
                Online Grievance Redressal (Aaple Sarkar)
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                Citizens can lodge formal complaints or appeal delayed services via Maharashtra Government's Aaple Sarkar portal.
              </p>
              <a
                href="https://grievances.maharashtra.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                Aaple Sarkar Portal <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>

        {/* Citizen Feedback Form */}
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
            SmartQueue Feedback & Inquiries
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Have a suggestion regarding our queue prediction algorithm or RTO services? Let us know below.
          </p>

          {submitted ? (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
              <CheckCircle2 size={36} color="var(--success)" style={{ margin: '0 auto 0.75rem' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.25rem' }}>
                Thank You for Your Feedback!
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0 }}>
                Your message has been received. Thank you for your feedback.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="btn btn-secondary btn-sm"
                style={{ marginTop: '1rem' }}
              >
                Submit Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Full Name</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="Citizen Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Email Address</label>
                  <input
                    type="email"
                    required
                    className="form-control"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="98XXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Topic</label>
                <select
                  className="form-control"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                >
                  <option value="Feedback">Queue Experience Feedback</option>
                  <option value="Inquiry">RTO Service Inquiry</option>
                  <option value="Bug">Technical Issue / Bug Report</option>
                  <option value="Appointment">Appointment &amp; Booking Query</option>
                </select>
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Message</label>
                <textarea
                  required
                  rows={4}
                  className="form-control"
                  placeholder="Describe your suggestion or feedback..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Send size={15} /> Submit Feedback
              </button>
            </form>
          )}
        </div>
      </div>

    </div>
  );
}
