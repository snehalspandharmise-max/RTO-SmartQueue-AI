import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeft, 
  XCircle, 
  Edit3 
} from 'lucide-react';

export function AppointmentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cancellation state
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  // Rescheduling state
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [newSlotId, setNewSlotId] = useState('');
  const [rescheduling, setRescheduling] = useState(false);

  useEffect(() => {
    async function fetchAppointment() {
      try {
        setLoading(true);
        setError(null);
        const data = await api.get(`/appointments/${id}`);
        setAppointment(data.appointment);
      } catch (err) {
        setError(err.message || 'Failed to retrieve appointment details');
      } finally {
        setLoading(false);
      }
    }
    fetchAppointment();
  }, [id]);

  const handleCancel = async () => {
    try {
      setCancelling(true);
      await api.patch(`/appointments/${id}/cancel`, { reason: cancelReason });
      setShowCancelModal(false);
      // Reload appointment
      const data = await api.get(`/appointments/${id}`);
      setAppointment(data.appointment);
    } catch (err) {
      alert('Cancellation failed: ' + err.message);
    } finally {
      setCancelling(false);
    }
  };

  const openRescheduleModal = async () => {
    if (!appointment) return;
    try {
      setShowRescheduleModal(true);
      const data = await api.get(`/slots?officeId=${appointment.office_id}&serviceId=${appointment.service_id}&date=${appointment.token_date}`);
      const valid = (data.allSlots || []).filter(s => !s.isFull && s.slotId !== appointment.slot_id);
      setAvailableSlots(valid);
      if (valid.length > 0) {
        setNewSlotId(valid[0].slotId);
      }
    } catch (err) {
      alert('Failed to load slots: ' + err.message);
    }
  };

  const handleReschedule = async () => {
    if (!newSlotId) return;
    try {
      setRescheduling(true);
      await api.patch(`/appointments/${id}/reschedule`, { new_slot_id: newSlotId });
      setShowRescheduleModal(false);
      const data = await api.get(`/appointments/${id}`);
      setAppointment(data.appointment);
    } catch (err) {
      alert('Rescheduling failed: ' + err.message);
    } finally {
      setRescheduling(false);
    }
  };

  if (loading) {
    return (
      <div className="card state-box">
        <div className="spinner"></div>
        <p>Loading appointment details...</p>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="card state-box">
        <AlertCircle size={42} style={{ color: 'var(--danger)', margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.25rem', color: 'var(--navy-900)' }}>Appointment Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{error}</p>
        <Link to="/dashboard" className="btn btn-primary">
          <ArrowLeft size={16} /> Return to Dashboard
        </Link>
      </div>
    );
  }

  const isEligibleForChange = appointment.status === 'booked';

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/dashboard" className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <span className={`badge ${
          appointment.status === 'completed' ? 'badge-success' :
          appointment.status === 'cancelled' ? 'badge-danger' :
          appointment.status === 'waiting' ? 'badge-warning' : 'badge-primary'
        }`} style={{ fontSize: '0.8rem', padding: '0.35rem 0.8rem' }}>
          Status: {appointment.status.replace('_', ' ')}
        </span>
      </div>

      <div className="card">
        <div className="card-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Booking Reference
            </span>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--navy-900)', fontFamily: 'var(--font-mono)' }}>
              {appointment.booking_reference}
            </h1>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Assigned Token
            </span>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
              {appointment.queue_token}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', padding: '1.5rem 0' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Target Service</span>
            <strong style={{ fontSize: '1rem', color: 'var(--navy-900)' }}>{appointment.service?.name}</strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>Estimated duration: ~{appointment.service?.estimated_duration_minutes} min</span>
          </div>

          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>RTO Office</span>
            <strong style={{ fontSize: '1rem', color: 'var(--navy-900)' }}>{appointment.office?.office_name}</strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>{appointment.office?.address}</span>
          </div>

          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Date & Slot</span>
            <strong style={{ fontSize: '1rem', color: 'var(--navy-900)' }}>{appointment.token_date}</strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>
              {appointment.slot?.start_time.substring(0, 5)} - {appointment.slot?.end_time.substring(0, 5)}
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Forecasted Wait Time</span>
            <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>
              ~{appointment.predicted_wait_at_checkin || 15} minutes
            </strong>
          </div>
        </div>

        {appointment.notes && (
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--navy-700)', display: 'block', marginBottom: '0.2rem' }}>Notes & Remarks:</span>
            <p style={{ fontSize: '0.85rem', color: 'var(--navy-900)' }}>{appointment.notes}</p>
          </div>
        )}

        {/* Action Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
          <Link to={`/queue?id=${appointment.id}`} className="btn btn-primary">
            <Clock size={16} /> Open Real-Time Queue Tracker
          </Link>

          {isEligibleForChange ? (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={openRescheduleModal} className="btn btn-secondary">
                <Edit3 size={15} /> Reschedule Slot
              </button>
              <button onClick={() => setShowCancelModal(true)} className="btn btn-danger">
                <XCircle size={15} /> Cancel Appointment
              </button>
            </div>
          ) : (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
              This appointment can no longer be rescheduled or cancelled.
            </span>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="modal-backdrop">
          <div className="modal-dialog" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
              Cancel Appointment?
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Are you sure you want to cancel booking <strong>{appointment.booking_reference}</strong>? 
              This will release your reserved slot and revoke Token <strong>{appointment.queue_token}</strong>.
            </p>

            <div className="form-group">
              <label className="form-label" htmlFor="reason">Reason for Cancellation (Optional)</label>
              <input
                id="reason"
                type="text"
                className="form-input"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Schedule conflict"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button onClick={() => setShowCancelModal(false)} className="btn btn-secondary" disabled={cancelling}>
                Keep Appointment
              </button>
              <button onClick={handleCancel} className="btn btn-danger" disabled={cancelling}>
                {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="modal-backdrop">
          <div className="modal-dialog" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
              Reschedule Appointment Slot
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Select a new time slot on {appointment.token_date}. Your booking reference will be preserved.
            </p>

            {availableSlots.length === 0 ? (
              <p style={{ padding: '1rem', background: '#fef2f2', color: '#991b1b', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                No other alternative slots are currently available for this date.
              </p>
            ) : (
              <div className="form-group">
                <label className="form-label" htmlFor="new-slot">Available Alternative Slots</label>
                <select
                  id="new-slot"
                  className="form-select"
                  value={newSlotId}
                  onChange={(e) => setNewSlotId(e.target.value)}
                >
                  {availableSlots.map(s => (
                    <option key={s.slotId} value={s.slotId}>
                      {s.startTime.substring(0, 5)} - {s.endTime.substring(0, 5)} (~{s.predictedWaitMinutes} min wait, {s.remainingCapacity} seats left)
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button onClick={() => setShowRescheduleModal(false)} className="btn btn-secondary" disabled={rescheduling}>
                Close
              </button>
              <button onClick={handleReschedule} className="btn btn-primary" disabled={rescheduling || availableSlots.length === 0}>
                {rescheduling ? 'Rescheduling...' : 'Confirm New Slot'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
