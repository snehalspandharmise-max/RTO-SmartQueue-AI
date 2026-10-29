import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  Monitor, 
  Activity, 
  Clock, 
  Users, 
  RefreshCw, 
  CheckCircle, 
  PauseCircle, 
  PowerOff, 
  AlertCircle 
} from 'lucide-react';

export function AdminCountersPage() {
  const [counters, setCounters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchCounters = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get('/admin/counters');
      setCounters(data.counters || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch counters');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounters();
  }, []);

  const handleUpdateStatus = async (counterId, newStatus) => {
    try {
      setUpdatingId(counterId);
      await api.patch(`/admin/counters/${counterId}`, { status: newStatus });
      await fetchCounters();
    } catch (err) {
      alert('Failed to update counter: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--navy-900)' }}>
            Counter & Workstation Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Monitor physical service desks, authorized service capabilities, and operational statuses.
          </p>
        </div>

        <button onClick={fetchCounters} className="btn btn-secondary btn-sm">
          <RefreshCw size={14} /> Refresh Counters
        </button>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="card state-box">
          <div className="spinner"></div>
          <p>Loading counter workstation statuses...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {counters.map((counter) => {
            const isUpdating = updatingId === counter.id;
            return (
              <div key={counter.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div className="card-header" style={{ marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Monitor size={20} color="var(--primary)" />
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy-900)' }}>
                        {counter.counter_label}
                      </h3>
                    </div>

                    <span className={`badge ${
                      counter.status === 'active' ? 'badge-success' :
                      counter.status === 'busy' ? 'badge-primary' :
                      counter.status === 'paused' ? 'badge-warning' : 'badge-danger'
                    }`}>
                      {counter.status}
                    </span>
                  </div>

                  {/* Serving Information */}
                  <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.825rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Currently Serving:</span>
                      <strong>
                        {counter.currentAppointment?.queue_token || counter.current_appointment_id ? (
                          <span style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>Active Ticket</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>Idle / Waiting for Next</span>
                        )}
                      </strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Queue Backlog for Counter:</span>
                      <strong style={{ color: counter.waitingQueueCount > 3 ? 'var(--danger)' : 'var(--navy-900)' }}>
                        {counter.waitingQueueCount} citizen(s) waiting
                      </strong>
                    </div>
                  </div>

                  {/* Authorized Services */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
                      Certified Services Handled:
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {counter.supportedServices?.map((s) => (
                        <span key={s.id} className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                          {s.name} ({s.service_code})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Status Toggle Actions */}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => handleUpdateStatus(counter.id, 'active')}
                    disabled={isUpdating || counter.status === 'active'}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, fontSize: '0.75rem' }}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(counter.id, 'busy')}
                    disabled={isUpdating || counter.status === 'busy'}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, fontSize: '0.75rem' }}
                  >
                    Busy
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(counter.id, 'paused')}
                    disabled={isUpdating || counter.status === 'paused'}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, fontSize: '0.75rem' }}
                  >
                    Pause
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(counter.id, 'offline')}
                    disabled={isUpdating || counter.status === 'offline'}
                    className="btn btn-danger btn-sm"
                    style={{ flex: 1, fontSize: '0.75rem' }}
                  >
                    Offline
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
