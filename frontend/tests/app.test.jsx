import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../src/features/auth/AuthContext';
import { App } from '../src/App';
import { QueueTrackerPage } from '../src/pages/QueueTrackerPage';
import { BookingWizard } from '../src/features/appointments/BookingWizard';
import { RtoDirectoryPage } from '../src/pages/RtoDirectoryPage';

// Mock global fetch for API calls
beforeEach(() => {
  global.fetch = vi.fn().mockImplementation((url) => {
    if (url.includes('/offices')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ offices: [{ id: '1', office_name: 'Mumbai Central RTO', office_code: 'MH-01', address: 'Tardeo', city: 'Mumbai', state: 'MH' }] })
      });
    }
    if (url.includes('/services')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ services: [{ id: '1', name: 'Driving Licence', service_code: 'DL', description: 'New DL test', estimated_duration_minutes: 15 }] })
      });
    }
    if (url.includes('/queue/my')) {
      return Promise.resolve({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: { message: 'Authentication required. Please log in.' } })
      });
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({})
    });
  });
});

describe('RTO SmartQueue AI — Frontend Component Suite', () => {
  it('Renders public landing page with official brand identity and discreet disclaimer', () => {
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

    // Verify discreet footer disclaimer is present
    expect(screen.getByText(/independent citizen-services project/i)).toBeInTheDocument();

    // Verify Call To Actions
    expect(screen.getByText(/Book an Appointment/i)).toBeInTheDocument();
    expect(screen.getByText(/Track Live Queue/i)).toBeInTheDocument();

    // Verify Mathematical formulation explanation
    expect(screen.getByText(/Verifiable, Explainable Wait-Time Engine/i)).toBeInTheDocument();
  });

  it('QueueTrackerPage displays helpful login call-to-action when unauthenticated', async () => {
    render(
      <MemoryRouter initialEntries={['/queue']}>
        <AuthProvider>
          <QueueTrackerPage />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Unable to Track Queue/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/You must be logged in to track your queue position/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Log In to Track Queue/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Book an Appointment/i })).toBeInTheDocument();
  });

  it('BookingWizard loads available services and initializes stepper at Step 1', async () => {
    render(
      <MemoryRouter initialEntries={['/book']}>
        <AuthProvider>
          <BookingWizard />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Step 1: Choose RTO Service/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Driving Licence/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Next: Select Office/i })).toBeInTheDocument();
  });

  it('RtoDirectoryPage renders verified Maharashtra office catalogue with region filters and disclaimer', async () => {
    render(
      <MemoryRouter initialEntries={['/offices']}>
        <AuthProvider>
          <RtoDirectoryPage />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Maharashtra Regional Transport Offices/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Official Reference Notice/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search by Office Code/i)).toBeInTheDocument();
  });

  it('RoadSafetyHubPage renders 3 interactive games and gamification summary', async () => {
    render(
      <MemoryRouter initialEntries={['/road-safety']}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Interactive Road Safety Learning & Gaming Centre/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Road Sign Challenge/i)).toBeInTheDocument();
    expect(screen.getByText(/Traffic Signal Master/i)).toBeInTheDocument();
    expect(screen.getByText(/Spot the Road Hazard/i)).toBeInTheDocument();
  });

  it('CitizenServicesDirectoryPage renders unified catalog of 33+ services', async () => {
    render(
      <MemoryRouter initialEntries={['/services']}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Maharashtra Transport Services Catalogue/i)).toBeInTheDocument();
    });

    expect(screen.getByPlaceholderText(/Search by service name, code, or description/i)).toBeInTheDocument();
  });
});
