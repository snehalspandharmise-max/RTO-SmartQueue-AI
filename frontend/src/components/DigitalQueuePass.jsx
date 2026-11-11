import React from 'react';
import { QrCode, Printer, CheckCircle2, ShieldCheck, X, Car, Calendar, Clock, MapPin, Layers } from 'lucide-react';

export function DigitalQueuePass({ appointment, onClose }) {
  if (!appointment) return null;

  const handlePrint = () => {
    window.print();
  };

  const tokenNumber = appointment.token_number || appointment.token || 'MH-DL-042';
  const officeName = appointment.rto_offices?.office_name || appointment.office_name || 'Mumbai Central RTO (MH-01)';
  const serviceName = appointment.services?.name || appointment.service_name || 'Driving Licence Verification';
  const appointmentDate = appointment.appointment_date || new Date().toISOString().split('T')[0];
  const timeSlot = appointment.time_slot || '10:30 AM - 11:30 AM';
  const citizenName = appointment.citizen_name || appointment.users?.full_name || 'Citizen Applicant';
  const counterAssigned = appointment.counter_name || 'Counter 03 (Biometrics)';

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        maxWidth: '460px',
        width: '100%',
        boxShadow: '0 20px 48px rgba(0,0,0,0.25)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Pass Header */}
        <div style={{
          background: 'linear-gradient(135deg, var(--navy-900) 0%, var(--navy-800) 100%)',
          color: '#ffffff',
          padding: '1.5rem',
          textAlign: 'center',
          position: 'relative'
        }}>
          <button
            type="button"
            onClick={onClose}
            className="no-print"
            style={{
              position: 'absolute',
              top: '14px',
              right: '14px',
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>

          <span className="badge badge-warning" style={{ fontSize: '0.68rem', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            Official Digital Queue Token
          </span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.2rem', color: '#ffffff' }}>
            Maharashtra RTO SmartQueue AI
          </h2>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Contactless Kiosk Check-In Pass
          </span>
        </div>

        {/* Pass Body */}
        <div style={{ padding: '1.75rem' }}>
          {/* Big Token Number Banner */}
          <div style={{
            background: '#f8fafc',
            border: '2px dashed var(--accent-gold)',
            borderRadius: '10px',
            padding: '1rem',
            textAlign: 'center',
            marginBottom: '1.25rem'
          }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
              Assigned Queue Token
            </span>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--navy-900)', letterSpacing: '0.02em', margin: '0.2rem 0' }}>
              {tokenNumber}
            </div>
            <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
              Confirmed & Active in Queue
            </span>
          </div>

          {/* Appointment Meta Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Citizen Name:</span>
              <strong style={{ color: 'var(--navy-900)' }}>{citizenName}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Service:</span>
              <strong style={{ color: 'var(--navy-900)' }}>{serviceName}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>RTO Regional Office:</span>
              <strong style={{ color: 'var(--navy-900)' }}>{officeName}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Date & Slot:</span>
              <strong style={{ color: 'var(--primary-teal)' }}>{appointmentDate} ({timeSlot})</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Dedicated Counter:</span>
              <strong style={{ color: 'var(--transport-red)' }}>{counterAssigned}</strong>
            </div>
          </div>

          {/* SVG Deterministic QR Code Graphic */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '1rem',
            marginBottom: '1.25rem'
          }}>
            {/* SVG Crisp QR Code Representation */}
            <svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="128" height="128" fill="#FFFFFF"/>
              {/* Top-Left Position Square */}
              <rect x="12" y="12" width="32" height="32" rx="4" stroke="#142D4E" strokeWidth="6" fill="none"/>
              <rect x="22" y="22" width="12" height="12" rx="2" fill="#142D4E"/>
              {/* Top-Right Position Square */}
              <rect x="84" y="12" width="32" height="32" rx="4" stroke="#142D4E" strokeWidth="6" fill="none"/>
              <rect x="94" y="22" width="12" height="12" rx="2" fill="#142D4E"/>
              {/* Bottom-Left Position Square */}
              <rect x="12" y="84" width="32" height="32" rx="4" stroke="#142D4E" strokeWidth="6" fill="none"/>
              <rect x="22" y="94" width="12" height="12" rx="2" fill="#142D4E"/>
              {/* Data Blocks */}
              <rect x="54" y="16" width="8" height="16" fill="#167C80"/>
              <rect x="66" y="28" width="10" height="8" fill="#142D4E"/>
              <rect x="54" y="44" width="18" height="8" fill="#142D4E"/>
              <rect x="16" y="54" width="12" height="12" fill="#167C80"/>
              <rect x="36" y="54" width="8" height="18" fill="#142D4E"/>
              <rect x="54" y="60" width="14" height="14" fill="#E9A23B"/>
              <rect x="76" y="54" width="16" height="8" fill="#142D4E"/>
              <rect x="98" y="54" width="16" height="14" fill="#167C80"/>
              <rect x="76" y="76" width="12" height="16" fill="#142D4E"/>
              <rect x="54" y="84" width="14" height="8" fill="#142D4E"/>
              <rect x="54" y="100" width="24" height="12" fill="#167C80"/>
              <rect x="88" y="96" width="26" height="16" fill="#142D4E"/>
            </svg>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontFamily: 'monospace' }}>
              Scan at RTO Entrance Kiosk to Fast-Track Check-In
            </span>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem' }} className="no-print">
            <button
              type="button"
              onClick={handlePrint}
              className="btn btn-primary"
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', background: 'var(--navy-900)' }}
            >
              <Printer size={15} /> Print Pass
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
