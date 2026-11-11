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
import { RtoDirectoryPage } from './pages/RtoDirectoryPage';

// Portal Expansion Pages
import { AboutDepartmentPage } from './pages/AboutDepartmentPage';
import { CitizenServicesDirectoryPage } from './pages/CitizenServicesDirectoryPage';
import { DrivingLicenceServicesPage } from './pages/DrivingLicenceServicesPage';
import { VehicleServicesPage } from './pages/VehicleServicesPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { MobileAppsPage } from './pages/MobileAppsPage';
import { ContactPage } from './pages/ContactPage';

// Road Safety & Gaming Centre Pages
import { RoadSafetyHubPage } from './pages/RoadSafety/RoadSafetyHubPage';
import { RoadSignChallenge } from './pages/RoadSafety/RoadSignChallenge';
import { TrafficSignalMaster } from './pages/RoadSafety/TrafficSignalMaster';
import { SpotRoadHazard } from './pages/RoadSafety/SpotRoadHazard';
import { SafeDrivingSimulator } from './pages/RoadSafety/SafeDrivingSimulator';
import { RoadSafetyQuiz } from './pages/RoadSafety/RoadSafetyQuiz';
import { LearnerLicenceTest } from './pages/RoadSafety/LearnerLicenceTest';
import { RoadSafetyChampionship } from './pages/RoadSafety/RoadSafetyChampionship';
import { RoadSafetyCertificate } from './pages/RoadSafety/RoadSafetyCertificate';
import { RoadSignLibrary } from './pages/RoadSafety/RoadSignLibrary';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminAppointmentsPage } from './pages/admin/AdminAppointmentsPage';
import { AdminCountersPage } from './pages/admin/AdminCountersPage';
import { AdminInsightsPage } from './pages/admin/AdminInsightsPage';

export function App() {
  return (
    <Routes>
      {/* Public & Citizen Portal Pages */}
      <Route path="/" element={<CitizenLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="book" element={<BookingPage />} />
        <Route path="queue" element={<QueueTrackerPage />} />
        <Route path="offices" element={<RtoDirectoryPage />} />

        {/* Portal Information & Catalogs */}
        <Route path="about" element={<AboutDepartmentPage />} />
        <Route path="services" element={<CitizenServicesDirectoryPage />} />
        <Route path="services/driving-licence" element={<DrivingLicenceServicesPage />} />
        <Route path="services/vehicle" element={<VehicleServicesPage />} />
        <Route path="announcements" element={<AnnouncementsPage />} />
        <Route path="mobile-apps" element={<MobileAppsPage />} />
        <Route path="contact" element={<ContactPage />} />

        {/* Road Safety & Gaming Centre Routes */}
        <Route path="road-safety" element={<RoadSafetyHubPage />} />
        <Route path="road-safety/sign-challenge" element={<RoadSignChallenge />} />
        <Route path="road-safety/signal-master" element={<TrafficSignalMaster />} />
        <Route path="road-safety/spot-hazard" element={<SpotRoadHazard />} />
        <Route path="road-safety/simulator" element={<SafeDrivingSimulator />} />
        <Route path="road-safety/quiz" element={<RoadSafetyQuiz />} />
        <Route path="road-safety/ll-test" element={<LearnerLicenceTest />} />
        <Route path="road-safety/championship" element={<RoadSafetyChampionship />} />
        <Route path="road-safety/certificate" element={<RoadSafetyCertificate />} />
        <Route path="road-safety/signs" element={<RoadSignLibrary />} />

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
