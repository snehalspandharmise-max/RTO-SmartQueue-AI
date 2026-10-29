import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../src/features/auth/AuthContext';
import { App } from '../src/App';

// Mock global fetch for API calls
beforeEach(() => {
  global.fetch = vi.fn().mockImplementation((url) => {
    if (url.includes('/offices')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ offices: [{ id: '1', office_name: 'Mumbai Central RTO', office_code: 'MH-01' }] })
      });
    }
    if (url.includes('/services')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ services: [{ id: '1', name: 'Driving Licence', service_code: 'DL', estimated_duration_minutes: 15 }] })
      });
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({})
    });
  });
});

describe('RTO SmartQueue AI — Frontend Component Suite', () => {
  it('Renders public landing page with official brand identity and academic disclaimer', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    );

    // Verify Brand Title appears on page
    const brandElements = screen.getAllByText(/RTO SmartQueue/i);
    expect(brandElements.length).toBeGreaterThan(0);

    // Verify Academic Disclaimer Banner
    expect(screen.getByText(/Academic Demonstration System/i)).toBeInTheDocument();

    // Verify Call To Actions
    expect(screen.getByText(/Book an Appointment/i)).toBeInTheDocument();
    expect(screen.getByText(/Track Live Queue/i)).toBeInTheDocument();

    // Verify Mathematical formulation explanation
    expect(screen.getByText(/Verifiable, Explainable Wait-Time Engine/i)).toBeInTheDocument();
  });
});
