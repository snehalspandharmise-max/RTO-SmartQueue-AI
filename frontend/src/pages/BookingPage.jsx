import React from 'react';
import { BookingWizard } from '../features/appointments/BookingWizard';

export function BookingPage() {
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--navy-900)', letterSpacing: '-0.02em' }}>
          Schedule RTO Appointment
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Select your service, compare slots using AI queue estimates, and receive a guaranteed token.
        </p>
      </div>

      <BookingWizard />
    </div>
  );
}
