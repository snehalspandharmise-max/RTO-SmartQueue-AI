import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CitizenLayout } from './layouts/CitizenLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { RoleGuard } from './features/auth/RoleGuard';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { BookingPage } from './pages/BookingPage';
import { QueueTrackerPage } from './pages/QueueTrackerPage';
import { AppointmentDetailsPage } from './pages/AppointmentDetailsPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminAppointmentsPage } from './pages/admin/AdminAppointmentsPage';
import { AdminCountersPage } from './pages/admin/AdminCountersPage';
import { AdminInsightsPage } from './pages/admin/AdminInsightsPage';

export function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<CitizenLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="book" element={<BookingPage />} />
        <Route path="queue" element={<QueueTrackerPage />} />

        {/* Protected Citizen Pages */}
        <Route
          path="dashboard"
          element={
            <RoleGuard>
              <CitizenDashboard />
            </RoleGuard>
          }
        />
        <Route
          path="appointments/:id"
          element={
            <RoleGuard>
              <AppointmentDetailsPage />
            </RoleGuard>
          }
        />
      </Route>

      {/* Protected Admin Pages */}
      <Route
        path="/admin"
        element={
          <RoleGuard requiredRole="admin">
            <AdminLayout />
          </RoleGuard>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="appointments" element={<AdminAppointmentsPage />} />
        <Route path="counters" element={<AdminCountersPage />} />
        <Route path="insights" element={<AdminInsightsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
