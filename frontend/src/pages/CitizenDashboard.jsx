import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../features/auth/AuthContext';
import { Clock, Calendar, CheckCircle2, AlertCircle, ArrowRight, RefreshCw, XCircle, FileText } from 'lucide-react';

export function CitizenDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkingIn, setCheckingIn] = useState(false);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get('/appointments/my');
      setAppointments(data.appointments || []);
    } catch (err) {
      setError(err.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Find most relevant active appointment
  const activeAppt = appointments.find(a => 
    ['waiting', 'in_progress', 'checked_in', 'booked'].includes(a.status)
  );

  const pastAppts = appointments.filter(a => a.id !== activeAppt?.id);

  const handleSelfCheckIn = async (appointmentId) => {
    try {
      setCheckingIn(true);
      await api.patch(`/appointments/${appointmentId}/checkin`);
      await fetchAppointments();
    } catch (err) {
      alert('Check-in failed: ' + err.message);
    } finally {
      setCheckingIn(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome Banner */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--navy-900)', letterSpacing: '-0.02em' }}>
            Welcome, {user?.full_name}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Track your live RTO appointment queue status and service history.
          </p>
        </div>

        <Link to="/book" className="btn btn-primary">
          <Calendar size={16} /> Book New Appointment
        </Link>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Active Appointment Hero Card */}
      {loading ? (
        <div className="card state-box">
          <div className="spinner"></div>
          <p>Retrieving your appointment and queue data...</p>
        </div>
      ) : activeAppt ? (
        <div className="card" style={{ borderLeft: '4px solid var(--primary)', position: 'relative' }}>
          <div className="card-header">
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
                Active Appointment
              </span>
              <h2 className="card-title" style={{ fontSize: '1.35rem' }}>
                {activeAppt.service?.name}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {activeAppt.office?.office_name} • Ref: <strong>{activeAppt.booking_reference}</strong>
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Queue Token
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--navy-900)', fontFamily: 'var(--font-mono)' }}>
                {activeAppt.queue_token}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Date & Slot</span>
              <strong style={{ fontSize: '0.9rem', color: 'var(--navy-900)' }}>
                {activeAppt.token_date} ({activeAppt.slot?.start_time.substring(0, 5)} - {activeAppt.slot?.end_time.substring(0, 5)})
              </strong>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Current Status</span>
              <span className={`badge ${
                activeAppt.status === 'in_progress' ? 'badge-success' :
                activeAppt.status === 'waiting' ? 'badge-warning' : 'badge-primary'
              }`}>
                {activeAppt.status.replace('_', ' ')}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Predicted Wait</span>
              <strong style={{ fontSize: '1rem', color: 'var(--primary)' }}>
                {activeAppt.status === 'in_progress' ? 'Now Serving' : `~${activeAppt.predicted_wait_at_checkin || 15} mins`}
              </strong>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {activeAppt.status === 'booked' && (
                <button
                  onClick={() => handleSelfCheckIn(activeAppt.id)}
                  disabled={checkingIn}
                  className="btn btn-success btn-sm"
                >
                  <CheckCircle2 size={16} />
                  {checkingIn ? 'Checking in...' : 'Self Check-In (I Have Arrived)'}
                </button>
              )}
              <Link to={`/appointments/${activeAppt.id}`} className="btn btn-secondary btn-sm">
                View Details & Manage
              </Link>
            </div>

            <Link to={`/queue?id=${activeAppt.id}`} className="btn btn-primary btn-sm">
              <Clock size={16} /> Open Live Queue Tracker <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="card state-box">
          <Calendar size={42} style={{ color: '#94a3b8', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
            No Active Queue Tickets
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
            You do not have any pending appointments for today. Book an appointment now to receive a queue token and AI-powered wait estimates.
          </p>
          <Link to="/book" className="btn btn-primary">
            Schedule an Appointment
          </Link>
        </div>
      )}

      {/* Appointment History Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <FileText size={18} color="var(--primary)" /> Appointment History
          </h2>
          <button onClick={fetchAppointments} className="btn btn-secondary btn-sm" title="Refresh">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {pastAppts.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 1rem', fontSize: '0.875rem' }}>
            No previous appointment records found.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Service</th>
                  <th>Office</th>
                  <th>Date</th>
                  <th>Token</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pastAppts.map((appt) => (
                  <tr key={appt.id}>
                    <td><strong>{appt.booking_reference}</strong></td>
                    <td>{appt.service?.name}</td>
                    <td>{appt.office?.office_name}</td>
                    <td>{appt.token_date}</td>
                    <td><span className="badge badge-neutral" style={{ fontFamily: 'var(--font-mono)' }}>{appt.queue_token}</span></td>
                    <td>
                      <span className={`badge ${
                        appt.status === 'completed' ? 'badge-success' :
                        appt.status === 'cancelled' ? 'badge-danger' :
                        appt.status === 'no_show' ? 'badge-danger' : 'badge-neutral'
                      }`}>
                        {appt.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <Link to={`/appointments/${appt.id}`} className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
