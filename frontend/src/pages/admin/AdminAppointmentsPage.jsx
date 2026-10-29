import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  Search, 
  Filter, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Play, 
  AlertCircle, 
  UserCheck 
} from 'lucide-react';

export function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [counters, setCounters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      if (serviceFilter) params.append('serviceId', serviceFilter);

      const [apptsRes, srvRes, cntRes] = await Promise.all([
        api.get(`/admin/appointments?${params.toString()}`),
        api.get('/services'),
        api.get('/admin/counters')
      ]);

      setAppointments(apptsRes.appointments || []);
      setServices(srvRes.services || []);
      setCounters(cntRes.counters || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter, serviceFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleUpdateStatus = async (appointmentId, newStatus, counterId = null) => {
    try {
      setUpdatingId(appointmentId);
      await api.patch(`/admin/appointments/${appointmentId}/status`, {
        status: newStatus,
        counter_id: counterId
      });
      await fetchData();
    } catch (err) {
      alert('Status transition failed: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--navy-900)' }}>
            Appointments & Queue Dispatch
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Search, filter, and advance citizen queue tokens through the service lifecycle.
          </p>
        </div>

        <button onClick={fetchData} className="btn btn-secondary btn-sm">
          <RefreshCw size={14} /> Refresh List
        </button>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '1rem 1.25rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div style={{ flex: '1 1 220px', position: 'relative' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search by Reference (BK-...) or Token (DL-...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ minWidth: '150px' }}>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="booked">Booked</option>
              <option value="waiting">Waiting in Queue</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="no_show">No Show</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div style={{ minWidth: '160px' }}>
            <select
              className="form-select"
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
            >
              <option value="">All Services</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.service_code})</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary btn-sm">
            <Search size={14} /> Filter
          </button>
        </form>
      </div>

      {/* Appointments Data Table */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        {loading ? (
          <div className="state-box">
            <div className="spinner"></div>
            <p>Loading appointments list...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="state-box">
            <p>No appointments match the selected filter criteria.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Booking Ref</th>
                  <th>Service</th>
                  <th>Office</th>
                  <th>Slot Window</th>
                  <th>Current Status</th>
                  <th>Assigned Counter</th>
                  <th>Operational Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => {
                  const isUpdating = updatingId === appt.id;
                  return (
                    <tr key={appt.id}>
                      <td>
                        <span className="badge badge-primary" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                          {appt.queue_token}
                        </span>
                      </td>
                      <td>
                        <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '0.825rem' }}>{appt.booking_reference}</strong>
                      </td>
                      <td>{appt.service?.name}</td>
                      <td>{appt.office?.office_code}</td>
                      <td>
                        {appt.slot ? `${appt.slot.start_time.substring(0, 5)} - ${appt.slot.end_time.substring(0, 5)}` : 'N/A'}
                      </td>
                      <td>
                        <span className={`badge ${
                          appt.status === 'in_progress' ? 'badge-primary' :
                          appt.status === 'waiting' ? 'badge-warning' :
                          appt.status === 'completed' ? 'badge-success' :
                          appt.status === 'cancelled' || appt.status === 'no_show' ? 'badge-danger' : 'badge-neutral'
                        }`}>
                          {appt.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td>
                        {appt.counter ? (
                          <span style={{ fontSize: '0.825rem', fontWeight: 600 }}>{appt.counter.counter_label}</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Unassigned</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          {/* Advance: waiting -> in_progress */}
                          {appt.status === 'waiting' && (
                            <button
                              onClick={() => handleUpdateStatus(appt.id, 'in_progress')}
                              disabled={isUpdating}
                              className="btn btn-primary btn-sm"
                              style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                            >
                              <Play size={12} /> Call Token
                            </button>
                          )}

                          {/* Advance: in_progress -> completed */}
                          {appt.status === 'in_progress' && (
                            <button
                              onClick={() => handleUpdateStatus(appt.id, 'completed')}
                              disabled={isUpdating}
                              className="btn btn-success btn-sm"
                              style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                            >
                              <CheckCircle2 size={12} /> Complete
                            </button>
                          )}

                          {/* Mark No Show */}
                          {(appt.status === 'waiting' || appt.status === 'in_progress' || appt.status === 'booked') && (
                            <button
                              onClick={() => handleUpdateStatus(appt.id, 'no_show')}
                              disabled={isUpdating}
                              className="btn btn-danger btn-sm"
                              style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                            >
                              <XCircle size={12} /> No-Show
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
