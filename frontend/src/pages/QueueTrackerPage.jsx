import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../features/auth/AuthContext';
import { 
  Clock, 
  Users, 
  Layers, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  ShieldCheck, 
  Activity, 
  Sparkles,
  Wifi,
  WifiOff,
  QrCode
} from 'lucide-react';
import { subscribeToAppointment, isRealtimeAvailable } from '../services/supabaseClient';
import { DigitalQueuePass } from '../components/DigitalQueuePass';

export function QueueTrackerPage() {
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get('id');
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const fetchTrackerData = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setRefreshing(true);
      setError(null);

      let url = '/queue/my';
      if (appointmentId) {
        url = `/queue/${appointmentId}`;
      }

      const data = await api.get(url);
      setQueueData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch queue updates');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [appointmentId]);

  useEffect(() => {
    // Don't fetch until auth state is determined; avoids spurious 401 on unauthenticated load
    if (!authLoading) {
      fetchTrackerData();
    }
  }, [fetchTrackerData, authLoading]);

  // Controlled polling every 12 seconds if enabled
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchTrackerData(true);
    }, 12000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchTrackerData]);

  // Supabase Realtime subscription for instant token updates
  useEffect(() => {
    if (!queueData?.appointment?.id) return;
    const sub = subscribeToAppointment(queueData.appointment.id, () => {
      fetchTrackerData(true);
    });
    return () => {
      if (sub?.unsubscribe) sub.unsubscribe();
    };
  }, [queueData?.appointment?.id, fetchTrackerData]);

  const handleSelfCheckIn = async () => {
    if (!queueData?.appointment?.id) return;
    try {
      setCheckingIn(true);
      await api.patch(`/appointments/${queueData.appointment.id}/checkin`);
      await fetchTrackerData();
    } catch (err) {
      alert('Check-in failed: ' + err.message);
    } finally {
      setCheckingIn(false);
    }
  };

  if (loading) {
    return (
      <div className="card state-box">
        <div className="spinner"></div>
        <p>Connecting to Real-time Queue Tracking Engine...</p>
      </div>
    );
  }

  if (error) {
    // If the error is a 401 / authentication-related, show a helpful login prompt
    const isAuthError = error.toLowerCase().includes('authentication') || error.includes('401') || error.toLowerCase().includes('unauthorized');
    return (
      <div className="card state-box">
        <AlertCircle size={42} style={{ color: 'var(--danger)', margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.25rem', color: 'var(--navy-900)', marginBottom: '0.5rem' }}>Unable to Track Queue</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          {isAuthError ? 'You must be logged in to track your queue position.' : error}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {isAuthError ? (
            <Link to="/login" className="btn btn-primary">Log In to Track Queue</Link>
          ) : (
            <button onClick={() => fetchTrackerData()} className="btn btn-primary">
              <RefreshCw size={16} /> Try Again
            </button>
          )}
          <Link to="/book" className="btn btn-secondary">Book an Appointment</Link>
        </div>
      </div>
    );
  }

  if (queueData?.hasActiveQueue === false || !queueData?.appointment) {
    return (
      <div className="card state-box">
        <Clock size={42} style={{ color: '#94a3b8', margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.25rem', color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
          No Active Queue Ticket Found
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
          You do not have an active queue ticket waiting for service right now.
        </p>
        <Link to="/book" className="btn btn-primary">
          Book an Appointment
        </Link>
      </div>
    );
  }

  const { appointment, prediction, activeCountersCount, queueAhead } = queueData;
  const isNowServing = appointment.status === 'in_progress';

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header with Auto-refresh Toggle */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
            Live Queue Tracker
          </span>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--navy-900)' }}>
            {appointment.service?.name}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            {appointment.office?.office_name} • Ref: <strong>{appointment.booking_reference}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {isRealtimeAvailable ? (
            <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
              <Wifi size={12} /> Supabase Realtime Active
            </span>
          ) : (
            <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
              <Activity size={12} /> Live Sync (12s Active)
            </span>
          )}
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.825rem', color: 'var(--navy-800)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            Auto-refresh
          </label>
          <button
            onClick={() => fetchTrackerData()}
            disabled={refreshing}
            className="btn btn-secondary btn-sm"
            title="Refresh now"
          >
            <RefreshCw size={14} className={refreshing ? 'spin' : ''} />
            {refreshing ? 'Syncing...' : 'Sync'}
          </button>
        </div>
      </div>

      {/* Hero Token Display Box */}
      <div className="token-display-box">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.9 }}>
            Your Token Number
          </span>
          <span className={`badge ${
            isNowServing ? 'badge-success' : 
            appointment.status === 'waiting' ? 'badge-warning' : 'badge-neutral'
          }`}>
            {appointment.status.replace('_', ' ')}
          </span>
        </div>

        <div className="token-number">
          {appointment.queue_token}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
          <button
            type="button"
            onClick={() => setShowPass(true)}
            className="btn btn-secondary btn-sm"
            style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.4)', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <QrCode size={15} /> View & Print Digital QR Pass
          </button>
        </div>

        <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>
          {isNowServing ? (
            <span style={{ color: '#86efac', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Sparkles size={20} /> Please proceed to {appointment.counter?.counter_label || 'Assigned Counter'}
            </span>
          ) : appointment.status === 'completed' ? (
            <span style={{ color: '#86efac' }}>Service Completed</span>
          ) : (
            <span>Estimated Wait: <strong>~{prediction?.estimatedWaitMinutes} minutes</strong></span>
          )}
        </div>
      </div>

      {/* Check-In Action Banner (if Booked but not yet checked in) */}
      {appointment.status === 'booked' && (
        <div className="card" style={{ background: '#f0fdf4', borderColor: '#bbf7d0', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#166534', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={18} /> Ready to join the active queue?
            </h3>
            <p style={{ fontSize: '0.825rem', color: '#15803d', marginTop: '0.2rem' }}>
              Please click Self Check-In upon physical arrival at {appointment.office?.office_name}.
            </p>
          </div>
          <button onClick={handleSelfCheckIn} disabled={checkingIn} className="btn btn-success">
            {checkingIn ? 'Checking in...' : 'Self Check-In (I Have Arrived)'}
          </button>
        </div>
      )}

      {/* 3 Metric Cards */}
      <div className="grid-3">
        <div className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
          <Users size={24} color="var(--primary)" style={{ margin: '0 auto 0.4rem' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>People Ahead in Queue</span>
          <strong style={{ fontSize: '1.75rem', color: 'var(--navy-900)' }}>{queueAhead}</strong>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
          <Activity size={24} color="var(--teal)" style={{ margin: '0 auto 0.4rem' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Active Certified Counters</span>
          <strong style={{ fontSize: '1.75rem', color: 'var(--teal)' }}>{activeCountersCount}</strong>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
          <Clock size={24} color="var(--amber)" style={{ margin: '0 auto 0.4rem' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Confidence Range</span>
          <strong style={{ fontSize: '1.25rem', color: 'var(--navy-900)', marginTop: '0.25rem', display: 'block' }}>
            {prediction?.lowerBoundMinutes || 0} - {prediction?.upperBoundMinutes || 0} min
          </strong>
        </div>
      </div>

      {/* Explainable Delay Factors Breakdown Card */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <Info size={18} color="var(--primary)" /> Explainable Wait-Time Calculation
          </h2>
          <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
            Model: {prediction?.confidenceLabel}
          </span>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--navy-900)', marginBottom: '1.25rem', fontWeight: 500, lineHeight: 1.5 }}>
          {prediction?.explanation}
        </p>

        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--navy-700)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
            Algorithmic Factors Evaluated
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', fontSize: '0.825rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Queue Backlog Ahead:</span>
              <strong style={{ display: 'block' }}>{prediction?.factorsUsed?.queueAhead ?? queueAhead} citizen(s)</strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)' }}>Effective Service Duration:</span>
              <strong style={{ display: 'block' }}>~{prediction?.factorsUsed?.effectiveDurationMinutes || 15} minutes</strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)' }}>Active Handling Counters:</span>
              <strong style={{ display: 'block' }}>{activeCountersCount} counter(s)</strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)' }}>Data Basis:</span>
              <strong style={{ display: 'block', color: 'var(--primary)' }}>{prediction?.dataBasis || 'Configured Baseline'}</strong>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span>Last calculation timestamp: {new Date(prediction?.calculationTimestamp || Date.now()).toLocaleTimeString()}</span>
            <span style={{ fontStyle: 'italic' }}>Confidential: No other citizens' personal data is exposed.</span>
          </div>
          <p style={{ background: '#f1f5f9', padding: '0.5rem 0.75rem', borderRadius: '4px', color: '#475569', margin: 0 }}>
            📌 <strong>Distinction:</strong> Wait durations are application-computed mathematical estimates based on current backlog and service baseline. Counter calls and dispatches represent verified live operational actions.
          </p>
        </div>
      </div>

      {showPass && (
        <DigitalQueuePass
          appointment={{
            ...appointment,
            token_number: appointment.queue_token,
            office_name: appointment.office?.office_name,
            service_name: appointment.service?.name,
            counter_name: appointment.counter?.counter_label
          }}
          onClose={() => setShowPass(false)}
        />
      )}
    </div>
  );
}
