import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../auth/AuthContext';
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  Award, 
  ThumbsUp, 
  AlertCircle 
} from 'lucide-react';

export function BookingWizard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Multi-step progress (1 to 8)
  const [step, setStep] = useState(1);

  // Data fetching
  const [offices, setOffices] = useState([]);
  const [services, setServices] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Wizard selections
  const [selectedService, setSelectedService] = useState(null);
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [preferredWindow, setPreferredWindow] = useState('morning'); // 'morning' | 'afternoon'
  const [notes, setNotes] = useState('');

  // Slots & Recommendations fetched from backend
  const [slotsData, setSlotsData] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Booking completion state
  const [submitting, setSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [bookingError, setBookingError] = useState(null);

  // Load available offices and services on mount
  useEffect(() => {
    async function loadMeta() {
      try {
        setLoadingData(true);
        const [officesRes, servicesRes] = await Promise.all([
          api.get('/offices'),
          api.get('/services')
        ]);
        setOffices(officesRes.offices || []);
        setServices(servicesRes.services || []);

        if (servicesRes.services?.length > 0) {
          setSelectedService(servicesRes.services[0]);
        }
        if (officesRes.offices?.length > 0) {
          setSelectedOffice(officesRes.offices[0]);
        }
      } catch (err) {
        console.error('Failed to load booking metadata:', err.message);
      } finally {
        setLoadingData(false);
      }
    }
    loadMeta();
  }, []);

  // Fetch slot availability and wait-time recommendations whenever office, service, or date changes
  useEffect(() => {
    if (selectedOffice && selectedService && selectedDate) {
      async function fetchSlots() {
        try {
          setLoadingSlots(true);
          const data = await api.get(
            `/slots?officeId=${selectedOffice.id}&serviceId=${selectedService.id}&date=${selectedDate}&preferredWindow=${preferredWindow}`
          );
          setSlotsData(data);
          // Auto-select the balanced recommendation if available
          if (data.recommendations?.balanced?.slot) {
            setSelectedSlot(data.recommendations.balanced.slot);
          } else if (data.allSlots?.length > 0 && !data.allSlots[0].isFull) {
            setSelectedSlot(data.allSlots[0]);
          } else {
            setSelectedSlot(null);
          }
        } catch (err) {
          console.error('Failed to fetch slot predictions:', err.message);
        } finally {
          setLoadingSlots(false);
        }
      }
      fetchSlots();
    }
  }, [selectedOffice, selectedService, selectedDate, preferredWindow]);

  // Handle final submission (Step 7 -> Step 8)
  const handleConfirmBooking = async () => {
    if (!selectedSlot) return;

    try {
      setSubmitting(true);
      setBookingError(null);
      const res = await api.post('/appointments', {
        office_id: selectedOffice.id,
        service_id: selectedService.id,
        slot_id: selectedSlot.slotId || selectedSlot.id,
        notes
      });
      setBookingResult(res);
      setStep(8); // Move to Step 8: Confirmation Page
    } catch (err) {
      setBookingError(err.message || 'Failed to confirm booking. The slot may have filled up.');
    } finally {
      setSubmitting(false);
    }
  };

  const stepsList = [
    'Service',
    'RTO Office',
    'Date',
    'Compare Slots',
    'Smart Recommendations',
    'Review',
    'Confirm',
    'Complete'
  ];

  if (loadingData) {
    return (
      <div className="card state-box">
        <div className="spinner"></div>
        <p>Loading service definitions and RTO offices...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto' }}>
      {/* Wizard Progress Stepper */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', overflowX: 'auto', paddingBottom: '0.75rem' }}>
          {stepsList.map((label, idx) => {
            const stepNum = idx + 1;
            const isCompleted = step > stepNum;
            const isCurrent = step === stepNum;
            return (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: '70px', position: 'relative', zIndex: 2 }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: isCompleted ? 'var(--teal)' : isCurrent ? 'var(--primary)' : '#e2e8f0',
                    color: isCompleted || isCurrent ? '#ffffff' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    marginBottom: '0.35rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isCompleted ? <Check size={16} /> : stepNum}
                </div>
                <span style={{ fontSize: '0.68rem', fontWeight: isCurrent ? 700 : 500, color: isCurrent ? 'var(--navy-900)' : 'var(--text-muted)', textAlign: 'center' }}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {bookingError && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          <span>{bookingError}</span>
        </div>
      )}

      {/* STEP 1: Select Service */}
      {step === 1 && (
        <div className="card">
          <h2 className="card-title" style={{ marginBottom: '0.5rem' }}>
            Step 1: Choose RTO Service
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Select the government service you need to complete at the Regional Transport Office.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {services.map((srv) => {
              const isSelected = selectedService?.id === srv.id;
              return (
                <div
                  key={srv.id}
                  onClick={() => setSelectedService(srv)}
                  style={{
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                    backgroundColor: isSelected ? 'var(--primary-light)' : '#ffffff',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <strong style={{ fontSize: '1rem', color: 'var(--navy-900)' }}>{srv.name}</strong>
                      <span className="badge badge-neutral">{srv.service_code}</span>
                    </div>
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                      {srv.description}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: '110px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Base Duration</span>
                    <strong style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>~{srv.estimated_duration_minutes} mins</strong>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => setStep(2)} className="btn btn-primary" disabled={!selectedService}>
              Next: Select Office <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Select RTO Office */}
      {step === 2 && (
        <div className="card">
          <h2 className="card-title" style={{ marginBottom: '0.5rem' }}>
            Step 2: Select Demonstration RTO Office
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Choose the target office location equipped with our smart multi-counter queue tracking system.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {offices.map((off) => {
              const isSelected = selectedOffice?.id === off.id;
              return (
                <div
                  key={off.id}
                  onClick={() => setSelectedOffice(off)}
                  style={{
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                    backgroundColor: isSelected ? 'var(--primary-light)' : '#ffffff',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MapPin size={18} color="var(--primary)" />
                      <strong style={{ fontSize: '1.05rem', color: 'var(--navy-900)' }}>{off.office_name}</strong>
                      <span className="badge badge-primary">{off.office_code}</span>
                    </div>
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                      {off.address}, {off.city}, {off.state}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-success">Online & Active</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setStep(1)} className="btn btn-secondary">
              <ChevronLeft size={16} /> Back
            </button>
            <button onClick={() => setStep(3)} className="btn btn-primary" disabled={!selectedOffice}>
              Next: Select Date <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Select Date & Time Preference */}
      {step === 3 && (
        <div className="card">
          <h2 className="card-title" style={{ marginBottom: '0.5rem' }}>
            Step 3: Choose Appointment Date & Preferences
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Select your preferred visit date and time window to help our recommendation engine rank the best slots.
          </p>

          <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="appt-date">Visit Date</label>
              <input
                id="appt-date"
                type="date"
                className="form-input"
                value={selectedDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="time-window">Preferred Window</label>
              <select
                id="time-window"
                className="form-select"
                value={preferredWindow}
                onChange={(e) => setPreferredWindow(e.target.value)}
              >
                <option value="morning">Morning (09:00 AM - 01:00 PM)</option>
                <option value="afternoon">Afternoon (01:00 PM - 05:00 PM)</option>
              </select>
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0', fontSize: '0.825rem', color: '#475569' }}>
            💡 <strong>Smart Optimization Note:</strong> In the next step, our mathematical model evaluates all available slots to forecast waiting delays and active counter availability.
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setStep(2)} className="btn btn-secondary">
              <ChevronLeft size={16} /> Back
            </button>
            <button onClick={() => setStep(4)} className="btn btn-primary">
              Next: Compare Slots <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Compare All Slots */}
      {step === 4 && (
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Step 4: Compare Available Slots</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                {selectedOffice?.office_name} • {selectedDate}
              </p>
            </div>
          </div>

          {loadingSlots ? (
            <div className="state-box">
              <div className="spinner"></div>
              <p>Evaluating slot capacities and calculating wait estimations...</p>
            </div>
          ) : !slotsData?.allSlots || slotsData.allSlots.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '2rem' }}>No slots configured for this date.</p>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Slot Window</th>
                    <th>Remaining Capacity</th>
                    <th>Predicted Wait</th>
                    <th>Confidence</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {slotsData.allSlots.map((s) => {
                    const isSelected = selectedSlot?.slotId === s.slotId;
                    return (
                      <tr key={s.slotId} style={{ backgroundColor: isSelected ? '#eff6ff' : 'transparent' }}>
                        <td>
                          <strong>{s.startTime.substring(0, 5)} - {s.endTime.substring(0, 5)}</strong>
                        </td>
                        <td>
                          {s.isFull ? (
                            <span className="badge badge-danger">Fully Booked</span>
                          ) : (
                            <span className="badge badge-success">{s.remainingCapacity} seats left</span>
                          )}
                        </td>
                        <td>
                          <span style={{ color: s.predictedWaitMinutes <= 15 ? 'var(--teal)' : 'var(--amber)', fontWeight: 600 }}>
                            ~{s.predictedWaitMinutes} mins
                          </span>
                          <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'block' }}>
                            [{s.lowerBoundMinutes}-{s.upperBoundMinutes} min range]
                          </span>
                        </td>
                        <td>
                          <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>{s.confidenceLabel}</span>
                        </td>
                        <td>
                          <button
                            type="button"
                            disabled={s.isFull}
                            onClick={() => setSelectedSlot(s)}
                            className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                          >
                            {isSelected ? 'Selected' : 'Choose'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setStep(3)} className="btn btn-secondary">
              <ChevronLeft size={16} /> Back
            </button>
            <button onClick={() => setStep(5)} className="btn btn-primary" disabled={!selectedSlot}>
              Next: View Recommendations <Sparkles size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Smart Slot Recommendations */}
      {step === 5 && (
        <div className="card">
          <div className="card-header">
            <div>
              <div className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
                AI Recommendation Engine
              </div>
              <h2 className="card-title">Step 5: Recommended Appointment Slots</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Our operations research engine evaluated queue backlogs to recommend the top 3 options:
              </p>
            </div>
          </div>

          {slotsData?.recommendations ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              {/* Option A: Lowest Wait */}
              {slotsData.recommendations.lowestWait && (
                <div
                  onClick={() => setSelectedSlot(slotsData.recommendations.lowestWait.slot)}
                  style={{
                    border: selectedSlot?.slotId === slotsData.recommendations.lowestWait.slot.slotId ? '2px solid var(--teal)' : '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    background: selectedSlot?.slotId === slotsData.recommendations.lowestWait.slot.slotId ? 'var(--teal-light)' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>
                      <Zap size={12} /> {slotsData.recommendations.lowestWait.badge}
                    </span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                      {slotsData.recommendations.lowestWait.slot.startTime.substring(0, 5)} - {slotsData.recommendations.lowestWait.slot.endTime.substring(0, 5)}
                    </h3>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--teal)', margin: '0.5rem 0' }}>
                      ~{slotsData.recommendations.lowestWait.slot.predictedWaitMinutes} mins wait
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {slotsData.recommendations.lowestWait.reason}
                    </p>
                  </div>
                  <button className={`btn btn-sm ${selectedSlot?.slotId === slotsData.recommendations.lowestWait.slot.slotId ? 'btn-success' : 'btn-secondary'}`} style={{ marginTop: '1rem', width: '100%' }}>
                    {selectedSlot?.slotId === slotsData.recommendations.lowestWait.slot.slotId ? 'Selected' : 'Pick Lowest Wait'}
                  </button>
                </div>
              )}

              {/* Option B: Balanced */}
              {slotsData.recommendations.balanced && (
                <div
                  onClick={() => setSelectedSlot(slotsData.recommendations.balanced.slot)}
                  style={{
                    border: selectedSlot?.slotId === slotsData.recommendations.balanced.slot.slotId ? '2px solid var(--primary)' : '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    background: selectedSlot?.slotId === slotsData.recommendations.balanced.slot.slotId ? 'var(--primary-light)' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
                      <Award size={12} /> {slotsData.recommendations.balanced.badge}
                    </span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                      {slotsData.recommendations.balanced.slot.startTime.substring(0, 5)} - {slotsData.recommendations.balanced.slot.endTime.substring(0, 5)}
                    </h3>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', margin: '0.5rem 0' }}>
                      ~{slotsData.recommendations.balanced.slot.predictedWaitMinutes} mins wait
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {slotsData.recommendations.balanced.reason}
                    </p>
                  </div>
                  <button className={`btn btn-sm ${selectedSlot?.slotId === slotsData.recommendations.balanced.slot.slotId ? 'btn-primary' : 'btn-secondary'}`} style={{ marginTop: '1rem', width: '100%' }}>
                    {selectedSlot?.slotId === slotsData.recommendations.balanced.slot.slotId ? 'Selected' : 'Pick Balanced'}
                  </button>
                </div>
              )}

              {/* Option C: Most Convenient */}
              {slotsData.recommendations.mostConvenient && (
                <div
                  onClick={() => setSelectedSlot(slotsData.recommendations.mostConvenient.slot)}
                  style={{
                    border: selectedSlot?.slotId === slotsData.recommendations.mostConvenient.slot.slotId ? '2px solid var(--amber)' : '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    background: selectedSlot?.slotId === slotsData.recommendations.mostConvenient.slot.slotId ? 'var(--amber-light)' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <span className="badge badge-warning" style={{ marginBottom: '0.5rem' }}>
                      <ThumbsUp size={12} /> {slotsData.recommendations.mostConvenient.badge}
                    </span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                      {slotsData.recommendations.mostConvenient.slot.startTime.substring(0, 5)} - {slotsData.recommendations.mostConvenient.slot.endTime.substring(0, 5)}
                    </h3>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--amber)', margin: '0.5rem 0' }}>
                      ~{slotsData.recommendations.mostConvenient.slot.predictedWaitMinutes} mins wait
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {slotsData.recommendations.mostConvenient.reason}
                    </p>
                  </div>
                  <button className={`btn btn-sm ${selectedSlot?.slotId === slotsData.recommendations.mostConvenient.slot.slotId ? 'btn-secondary' : 'btn-secondary'}`} style={{ marginTop: '1rem', width: '100%' }}>
                    {selectedSlot?.slotId === slotsData.recommendations.mostConvenient.slot.slotId ? 'Selected' : 'Pick Convenient'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p>No slot recommendations available.</p>
          )}

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setStep(4)} className="btn btn-secondary">
              <ChevronLeft size={16} /> Back
            </button>
            <button onClick={() => setStep(6)} className="btn btn-primary" disabled={!selectedSlot}>
              Next: Review Booking <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: Review Information */}
      {step === 6 && (
        <div className="card">
          <h2 className="card-title" style={{ marginBottom: '0.5rem' }}>
            Step 6: Review Booking Information
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Verify your visit details before server-side confirmation.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: '#f8fafc', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Citizen Name:</span>
              <strong>{user?.full_name} ({user?.email})</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Target Service:</span>
              <strong>{selectedService?.name} ({selectedService?.service_code})</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>RTO Office:</span>
              <strong>{selectedOffice?.office_name} ({selectedOffice?.office_code})</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Date & Slot Window:</span>
              <strong>{selectedDate} at {selectedSlot?.startTime.substring(0, 5)} - {selectedSlot?.endTime.substring(0, 5)}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)' }}>Estimated Wait Time:</span>
              <strong style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>
                ~{selectedSlot?.predictedWaitMinutes} mins [{selectedSlot?.lowerBoundMinutes}-{selectedSlot?.upperBoundMinutes} min range]
              </strong>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="booking-notes">Special Remarks / Notes (Optional)</label>
            <textarea
              id="booking-notes"
              className="form-textarea"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. First time driving licence applicant, international licence holder..."
            />
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setStep(5)} className="btn btn-secondary">
              <ChevronLeft size={16} /> Back
            </button>
            <button onClick={() => setStep(7)} className="btn btn-primary">
              Proceed to Confirmation <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 7: Confirm Booking */}
      {step === 7 && (
        <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
          <FileText size={48} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
            Step 7: Confirm & Issue Queue Token
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
            Clicking confirm will execute an atomic database reservation, check slot capacity, and issue your unique queue ticket.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button onClick={() => setStep(6)} className="btn btn-secondary" disabled={submitting}>
              Back to Review
            </button>
            <button onClick={handleConfirmBooking} className="btn btn-primary btn-lg" disabled={submitting}>
              {submitting ? 'Executing Atomic Reservation...' : 'Confirm & Reserve Slot'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 8: Confirmation Page */}
      {step === 8 && bookingResult && (
        <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem', borderTop: '4px solid var(--teal)' }}>
          <CheckCircle2 size={54} color="var(--teal)" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
            Step 8: Booking Confirmed Successfully!
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
            Your appointment has been registered in the database. A unique token has been assigned to your queue ticket.
          </p>

          <div className="token-display-box" style={{ maxWidth: '440px', margin: '0 auto 2rem' }}>
            <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.9 }}>
              Official Queue Token
            </span>
            <div className="token-number">
              {bookingResult.appointment.queue_token}
            </div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
              Booking Reference: <strong>{bookingResult.appointment.booking_reference}</strong>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', maxWidth: '580px', margin: '0 auto 2rem', textAlign: 'left', background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Office:</span>
              <strong style={{ display: 'block', fontSize: '0.875rem' }}>{bookingResult.office?.office_name}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Service:</span>
              <strong style={{ display: 'block', fontSize: '0.875rem' }}>{bookingResult.service?.name}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Date & Slot:</span>
              <strong style={{ display: 'block', fontSize: '0.875rem' }}>{bookingResult.slot?.slot_date} ({bookingResult.slot?.start_time.substring(0, 5)})</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Forecasted Wait:</span>
              <strong style={{ display: 'block', fontSize: '0.875rem', color: 'var(--primary)' }}>~{bookingResult.prediction?.estimatedWaitMinutes} minutes</strong>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <Link to="/dashboard" className="btn btn-secondary">
              Go to Dashboard
            </Link>
            <Link to={`/queue?id=${bookingResult.appointment.id}`} className="btn btn-primary">
              <Clock size={16} /> Track Live in Queue Tracker
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
