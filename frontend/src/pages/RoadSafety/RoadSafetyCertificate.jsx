import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, Printer, ArrowLeft, CheckCircle2, ShieldCheck, Download, Share2 } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';

export function RoadSafetyCertificate() {
  const { user } = useAuth();
  const [candidateName, setCandidateName] = useState(user?.full_name || 'Aditya Sharma');
  const [issueDate, setIssueDate] = useState('11 November 2026');
  const [certId, setCertId] = useState('MH-RTO-RS-8834F91C');
  const [score, setScore] = useState(13); // out of 15

  useEffect(() => {
    if (user?.full_name) {
      setCandidateName(user.full_name);
    }
    const savedScore = localStorage.getItem('rto_ll_score');
    if (savedScore) {
      setScore(parseInt(savedScore, 10));
    }
    const today = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    setIssueDate(today);
  }, [user]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
      
      {/* Top Bar with actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }} className="no-print">
        <Link to="/road-safety" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <ArrowLeft size={15} /> Back to Gaming Centre
        </Link>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={handlePrint} className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--navy-900)' }}>
            <Printer size={15} /> Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Candidate Name Customization Banner */}
      <div className="card no-print" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', background: '#f8fafc' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Award size={20} color="var(--accent-gold)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy-900)' }}>
            Customize Candidate Name on Certificate:
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            type="text"
            className="form-control"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            style={{ width: '240px', fontSize: '0.85rem' }}
            placeholder="Candidate Name"
          />
        </div>
      </div>

      {/* ================= CERTIFICATE DOCUMENT CONTAINER ================= */}
      <div
        id="certificate-print-area"
        style={{
          background: '#ffffff',
          border: '12px solid #142D4E',
          outline: '3px solid #E9A23B',
          outlineOffset: '-6px',
          padding: '3.5rem 3rem',
          boxShadow: '0 12px 36px rgba(0,0,0,0.12)',
          position: 'relative',
          textAlign: 'center',
          fontFamily: 'Inter, serif',
          color: '#243447'
        }}
      >
        {/* Corner Ornaments */}
        <div style={{ position: 'absolute', top: '14px', left: '16px', fontSize: '1.2rem', color: '#E9A23B' }}>❖</div>
        <div style={{ position: 'absolute', top: '14px', right: '16px', fontSize: '1.2rem', color: '#E9A23B' }}>❖</div>
        <div style={{ position: 'absolute', bottom: '14px', left: '16px', fontSize: '1.2rem', color: '#E9A23B' }}>❖</div>
        <div style={{ position: 'absolute', bottom: '14px', right: '16px', fontSize: '1.2rem', color: '#E9A23B' }}>❖</div>

        {/* Header Header Seals */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #142D4E 0%, #167C80 100%)',
            border: '2px solid #E9A23B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}>
            <ShieldCheck size={36} />
          </div>
        </div>

        <div style={{ textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: '0.8rem', fontWeight: 700, color: '#167C80', marginBottom: '0.35rem' }}>
          Government of Maharashtra • Motor Vehicles Department
        </div>

        <div style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.72rem', color: '#64748B', marginBottom: '1rem' }}>
          RTO SmartQueue AI — Academic Demonstration Capstone Project
        </div>

        <h1 style={{
          fontSize: 'clamp(1.6rem, 3.2vw, 2.2rem)',
          fontWeight: 900,
          color: '#142D4E',
          letterSpacing: '-0.01em',
          marginBottom: '0.5rem',
          textTransform: 'uppercase',
          borderBottom: '2px solid #E9A23B',
          display: 'inline-block',
          paddingBottom: '0.35rem'
        }}>
          Certificate of Road Safety Proficiency
        </h1>

        <p style={{ fontSize: '0.9rem', color: '#64748B', fontStyle: 'italic', margin: '1.25rem 0 0.5rem' }}>
          This is to certify that
        </p>

        <div style={{
          fontSize: 'clamp(1.75rem, 3.8vw, 2.5rem)',
          fontWeight: 800,
          color: '#142D4E',
          letterSpacing: '-0.02em',
          margin: '0.5rem 0',
          borderBottom: '1px dashed #cbd5e1',
          display: 'inline-block',
          padding: '0 2rem 0.25rem'
        }}>
          {candidateName}
        </div>

        <p style={{ fontSize: '0.92rem', color: '#334155', maxWidth: '640px', margin: '1.25rem auto 2rem', lineHeight: 1.7 }}>
          has successfully demonstrated comprehensive knowledge of the <strong>Motor Vehicles Act, 1988</strong>, 
          mandatory traffic regulatory signs, intersection signal navigation, and defensive driving principles with a certified score of <strong>{score} / 15 ({Math.round((score / 15) * 100)}%)</strong>.
        </p>

        {/* Verification Credentials & Signatures */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '2rem', marginTop: '2rem', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date of Issue</div>
            <strong style={{ fontSize: '0.9rem', color: '#142D4E', display: 'block', marginTop: '0.35rem' }}>{issueDate}</strong>
          </div>

          <div>
            <div style={{
              width: '60px',
              height: '60px',
              margin: '0 auto',
              border: '2px solid #E9A23B',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#E9A23B',
              fontSize: '0.65rem',
              fontWeight: 800,
              textTransform: 'uppercase'
            }}>
              VERIFIED
            </div>
            <span style={{ fontSize: '0.68rem', color: '#64748B', display: 'block', marginTop: '0.25rem', fontFamily: 'monospace' }}>
              {certId}
            </span>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Evaluating Authority</div>
            <strong style={{ fontSize: '0.9rem', color: '#142D4E', display: 'block', marginTop: '0.35rem' }}>
              Academic Viva Evaluation Taskforce
            </strong>
          </div>
        </div>

        {/* Mandatory Academic Disclaimer Bottom Strip */}
        <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px dashed #cbd5e1', fontSize: '0.68rem', color: '#64748B' }}>
          🎓 <strong>Academic Demonstration Only:</strong> This document certifies simulated knowledge evaluation within the RTO SmartQueue AI Capstone. It does not replace a statutory Driving Licence issued under Form 7 by a Regional Transport Authority.
        </div>
      </div>

    </div>
  );
}
