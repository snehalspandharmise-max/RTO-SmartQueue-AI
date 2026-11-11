
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../auth/AuthContext';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Clock,
  MapPin,
  FileText,
  CheckCircle2,
  Sparkles,
  Zap,
  Award,
  ThumbsUp,
  AlertCircle,
  LogIn,
  Search,
  Building2,
  Activity
} from 'lucide-react';
import { MAHARASHTRA_REGIONS } from '../../data/maharashtraOffices';

// Use the computer's local calendar date instead of UTC.
const getLocalDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const formatTime = (time) => {
  return time ? String(time).substring(0, 5) : '--:--';
};

export function BookingWizard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Wizard progress
  const [step, setStep] = useState(1);

  // Data
  const [offices, setOffices] = useState([]);
  const [services, setServices] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Office filters
  const [officeSearch, setOfficeSearch] = useState('');
  const [officeRegion, setOfficeRegion] = useState('All Regions');

  // User selections
  const [selectedService, setSelectedService] = useState(null);
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getLocalDate());
  const [preferredWindow, setPreferredWindow] = useState('morning');
  const [notes, setNotes] = useState('');

  // Appointment slots
  const [slotsData, setSlotsData] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState('');

  // Booking submission
  const [submitting, setSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [bookingError, setBookingError] = useState(null);

  // Load offices and services
  useEffect(() => {
    let isMounted = true;

    async function loadMeta() {
      try {
        setLoadingData(true);

        const [officesRes, servicesRes] = await Promise.all([
          api.get('/offices'),
          api.get('/services')
        ]);

        if (!isMounted) return;

        const officeList = officesRes.offices || [];
        const serviceList = servicesRes.services || [];

        setOffices(officeList);
        setServices(serviceList);

        const targetOfficeId = searchParams.get('officeId');

        const matchedOffice = targetOfficeId
          ? officeList.find(o => o.id === targetOfficeId)
          : null;

        setSelectedOffice(
          matchedOffice || officeList[0] || null
        );

        const targetServiceId = searchParams.get('serviceId');

        const matchedService = targetServiceId
          ? serviceList.find(s => s.id === targetServiceId)
          : null;

        setSelectedService(
          matchedService || serviceList[0] || null
        );

      } catch (err) {
        console.error('Failed to load booking metadata:', err.message);
      } finally {
        if (isMounted) {
          setLoadingData(false);
        }
      }
    }

    loadMeta();

    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  // Filter RTO offices
  const filteredOffices = useMemo(() => {
    return offices.filter(off => {
      if (
        officeRegion !== 'All Regions' &&
        off.region !== officeRegion
      ) {
        return false;
      }

      if (officeSearch.trim()) {
        const q = officeSearch.trim().toLowerCase();

        const matchCode = off.office_code?.toLowerCase().includes(q);
        const matchName = off.office_name?.toLowerCase().includes(q);
        const matchCity = off.city?.toLowerCase().includes(q);
        const matchDist = off.district?.toLowerCase().includes(q);

        if (!matchCode && !matchName && !matchCity && !matchDist) {
          return false;
        }
      }

      return true;
    });
  }, [offices, officeRegion, officeSearch]);

  // Fetch actual appointment slots from the backend / Supabase
  useEffect(() => {
    if (!selectedOffice || !selectedService || !selectedDate) {
      setSlotsData(null);
      setSelectedSlot(null);
      return;
    }

    let isMounted = true;

    async function fetchSlots() {
      try {
        setLoadingSlots(true);
        setSlotError('');
        setSlotsData(null);
        setSelectedSlot(null);

        const query = new URLSearchParams({
          officeId: selectedOffice.id,
          serviceId: selectedService.id,
          date: selectedDate
        });

        const data = await api.get(`/slots?${query.toString()}`);

        if (!isMounted) return;

        // Convert database fields into the format used by the UI.
        const normalizedSlots = (data.slots || []).map(slot => {
          const remainingCapacity =
            slot.remainingCapacity ??
            slot.remaining_capacity ??
            Math.max(0, slot.max_capacity - slot.booked_count);

          const isFull =
            slot.isFull ??
            (remainingCapacity <= 0);

          return {
            ...slot,
            slotId: slot.id,
            startTime: slot.start_time,
            endTime: slot.end_time,
            remainingCapacity,
            isFull,
            predictedWaitMinutes: null,
            lowerBoundMinutes: null,
            upperBoundMinutes: null,
            confidenceLabel: 'Pending'
          };
        });

        setSlotsData({
          ...data,
          allSlots: normalizedSlots
        });

        // Automatically select the first available slot.
        const firstAvailable = normalizedSlots.find(
          slot => !slot.isFull
        );

        setSelectedSlot(firstAvailable || null);

        if (normalizedSlots.length === 0) {
          setSlotError(
            'No appointment slots are configured for this office, service and date.'
          );
        } else if (!firstAvailable) {
          setSlotError(
            'All appointment slots for this date are fully booked.'
          );
        }

      } catch (err) {
        console.error('Failed to fetch appointment slots:', err.message);

        if (isMounted) {
          setSlotsData(null);
          setSelectedSlot(null);
          setSlotError(
            err.message || 'Unable to load appointment slots. Please try again.'
          );
        }
      } finally {
        if (isMounted) {
          setLoadingSlots(false);
        }
      }
    }

    fetchSlots();

    return () => {
      isMounted = false;
    };
  }, [selectedOffice, selectedService, selectedDate]);

  // Create recommendations from real slot availability.
  // These are availability recommendations, not wait-time predictions.
  const recommendations = useMemo(() => {
    const availableSlots = (slotsData?.allSlots || []).filter(
      slot => !slot.isFull
    );

    if (availableSlots.length === 0) {
      return [];
    }

    const getMinutes = (time) => {
      const [hours, minutes] = formatTime(time)
        .split(':')
        .map(Number);

      return hours * 60 + minutes;
    };

    const morningSlots = availableSlots.filter(
      slot => getMinutes(slot.startTime) < 13 * 60
    );

    const afternoonSlots = availableSlots.filter(
      slot => getMinutes(slot.startTime) >= 13 * 60
    );

    const preferredSlots =
      preferredWindow === 'morning'
        ? morningSlots
        : afternoonSlots;

    const sortedByCapacity = [...availableSlots].sort(
      (a, b) => b.remainingCapacity - a.remainingCapacity
    );

    const sortedByTime = [...availableSlots].sort(
      (a, b) => getMinutes(a.startTime) - getMinutes(b.startTime)
    );

    const picks = [];

    const addPick = (slot, title, badge, reason, icon) => {
      if (!slot || picks.some(item => item.slot.slotId === slot.slotId)) {
        return;
      }

      picks.push({
        slot,
        title,
        badge,
        reason,
        icon
      });
    };

    addPick(
      sortedByCapacity[0],
      'Most Available Seats',
      'Highest Availability',
      'This slot currently has the greatest number of unbooked seats.',
      'capacity'
    );

    addPick(
      preferredSlots.length
        ? [...preferredSlots].sort(
            (a, b) => b.remainingCapacity - a.remainingCapacity
          )[0]
        : null,
      'Preferred Time',
      'Matches Your Preference',
      `This slot matches your ${preferredWindow} time preference.`,
      'preferred'
    );

    addPick(
      sortedByTime[0],
      'Earliest Available',
      'First Available',
      'This is the earliest available appointment slot for your selected date.',
      'earliest'
    );

    // If all three choices were identical, show additional distinct slots.
    for (const slot of sortedByTime) {
      if (picks.length >= 3) break;

      addPick(
        slot,
        'Another Available Option',
        'Available',
        'This is another appointment slot with available capacity.',
        'available'
      );
    }

    return picks;
  }, [slotsData, preferredWindow]);

  // Confirm booking using the actual database slot ID.
  const handleConfirmBooking = async () => {
    if (!selectedSlot || !selectedSlot.slotId) {
      setBookingError('Please select an available appointment slot.');
      return;
    }

    if (!user) {
      setBookingError('Please log in before confirming your appointment.');
      return;
    }

    try {
      setSubmitting(true);
      setBookingError(null);

      const res = await api.post('/appointments', {
        office_id: selectedOffice.id,
        service_id: selectedService.id,
        slot_id: selectedSlot.slotId,
        notes
      });

      if (!res?.appointment) {
        throw new Error(
          'The server did not return appointment confirmation details.'
        );
      }

      setBookingResult(res);
      setStep(8);

    } catch (err) {
      console.error('Booking failed:', err);

      setBookingError(
        err.message ||
        'Failed to confirm booking. The slot may have filled up. Please try another slot.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const stepsList = [
    'Service',
    'RTO Office',
    'Date',
    'Compare Slots',
    'Recommendations',
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

      {/* Wizard Progress */}
      <div style={{ marginBottom: '2rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            overflowX: 'auto',
            paddingBottom: '0.75rem'
          }}
        >
          {stepsList.map((label, idx) => {
            const stepNum = idx + 1;
            const isCompleted = step > stepNum;
            const isCurrent = step === stepNum;

            return (
              <div
                key={label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flex: 1,
                  minWidth: '70px',
                  position: 'relative',
                  zIndex: 2
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: isCompleted
                      ? 'var(--teal)'
                      : isCurrent
                        ? 'var(--primary)'
                        : '#e2e8f0',
                    color: isCompleted || isCurrent ? '#ffffff' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    marginBottom: '0.35rem'
                  }}
                >
                  {isCompleted ? <Check size={16} /> : stepNum}
                </div>

                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: isCurrent ? 700 : 500,
                    color: isCurrent
                      ? 'var(--navy-900)'
                      : 'var(--text-muted)',
                    textAlign: 'center'
                  }}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Booking Error */}
      {bookingError && (
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.5rem'
          }}
        >
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

          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.875rem',
              marginBottom: '1.5rem'
            }}
          >
            Select the government service you need to complete at the Regional Transport Office.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {services.map(srv => {
              const isSelected = selectedService?.id === srv.id;

              return (
                <div
                  key={srv.id}
                  onClick={() => setSelectedService(srv)}
                  style={{
                    border: isSelected
                      ? '2px solid var(--primary)'
                      : '1px solid var(--border)',
                    backgroundColor: isSelected
                      ? 'var(--primary-light)'
                      : '#ffffff',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <strong style={{ fontSize: '1rem', color: 'var(--navy-900)' }}>
                        {srv.name}
                      </strong>

                      <span className="badge badge-neutral">
                        {srv.service_code}
                      </span>
                    </div>

                    <p
                      style={{
                        fontSize: '0.825rem',
                        color: 'var(--text-secondary)',
                        marginTop: '0.25rem'
                      }}
                    >
                      {srv.description}
                    </p>
                  </div>

                  <div style={{ textAlign: 'right', minWidth: '110px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                      Base Duration
                    </span>

                    <strong style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>
                      ~{srv.estimated_duration_minutes} mins
                    </strong>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setStep(2)}
              className="btn btn-primary"
              disabled={!selectedService}
            >
              Next: Select Office <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Select RTO Office */}
      {step === 2 && (
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">
                Step 2: Select Maharashtra RTO Office
              </h2>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Select an RTO office from the Maharashtra Motor Vehicle Department directory.
              </p>
            </div>

            <Link
              to="/offices"
              target="_blank"
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem' }}
            >
              Full Directory & Codes ↗
            </Link>
          </div>

          {/* Search and Region Filter */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              marginBottom: '1.25rem',
              background: '#f8fafc',
              padding: '0.85rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)'
            }}
          >
            <div style={{ flex: '1 1 200px', position: 'relative' }}>
              <Search
                size={15}
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }}
              />

              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.25rem', fontSize: '0.85rem' }}
                placeholder="Search by code, city or area..."
                value={officeSearch}
                onChange={e => setOfficeSearch(e.target.value)}
              />
            </div>

            <div style={{ minWidth: '180px' }}>
              <select
                className="form-select"
                style={{ fontSize: '0.85rem' }}
                value={officeRegion}
                onChange={e => setOfficeRegion(e.target.value)}
              >
                {MAHARASHTRA_REGIONS.map(reg => (
                  <option key={reg} value={reg}>
                    {reg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Office List */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              maxHeight: '420px',
              overflowY: 'auto',
              paddingRight: '0.25rem'
            }}
          >
            {filteredOffices.length === 0 ? (
              <div className="state-box" style={{ padding: '2rem' }}>
                <Building2
                  size={32}
                  style={{ color: 'var(--text-muted)', margin: '0 auto 0.5rem' }}
                />
                <p>No offices match your search criteria.</p>
              </div>
            ) : (
              filteredOffices.map(off => {
                const isSelected = selectedOffice?.id === off.id;
                const isLive = off.has_live_queue_integration;

                return (
                  <div
                    key={off.id}
                    onClick={() => setSelectedOffice(off)}
                    style={{
                      border: isSelected
                        ? '2px solid var(--primary)'
                        : '1px solid var(--border)',
                      backgroundColor: isSelected
                        ? 'var(--primary-light)'
                        : '#ffffff',
                      padding: '1.15rem',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <MapPin size={18} color="var(--primary)" />

                        <strong style={{ fontSize: '1.025rem', color: 'var(--navy-900)' }}>
                          {off.office_name}
                        </strong>

                        <span
                          className="badge badge-primary"
                          style={{ fontFamily: 'var(--font-mono)' }}
                        >
                          {off.office_code}
                        </span>
                      </div>

                      <p
                        style={{
                          fontSize: '0.825rem',
                          color: 'var(--text-secondary)',
                          marginTop: '0.35rem'
                        }}
                      >
                        {off.address}, {off.city}{' '}
                        {off.district ? `(${off.district} Dist.)` : ''}
                      </p>
                    </div>

                    <div style={{ textAlign: 'right', minWidth: '130px' }}>
                      {isLive ? (
                        <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>
                          <Activity size={12} /> Online Dispatch
                        </span>
                      ) : (
                        <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>
                          Verified Center
                        </span>
                      )}

                      <span
                        style={{
                          fontSize: '0.725rem',
                          color: 'var(--text-muted)',
                          display: 'block',
                          marginTop: '0.25rem'
                        }}
                      >
                        {off.region ? off.region.split('(')[0].trim() : 'Maharashtra'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setStep(1)} className="btn btn-secondary">
              <ChevronLeft size={16} /> Back
            </button>

            <button
              onClick={() => setStep(3)}
              className="btn btn-primary"
              disabled={!selectedOffice}
            >
              Next: Select Date <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Select Date */}
      {step === 3 && (
        <div className="card">
          <h2 className="card-title" style={{ marginBottom: '0.5rem' }}>
            Step 3: Choose Appointment Date & Preferences
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Select your preferred visit date and time window.
          </p>

          <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="appt-date">
                Visit Date
              </label>

              <input
                id="appt-date"
                type="date"
                className="form-input"
                value={selectedDate}
                min={getLocalDate()}
                onChange={e => setSelectedDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="time-window">
                Preferred Window
              </label>

              <select
                id="time-window"
                className="form-select"
                value={preferredWindow}
                onChange={e => setPreferredWindow(e.target.value)}
              >
                <option value="morning">Morning (Before 01:00 PM)</option>
                <option value="afternoon">Afternoon (01:00 PM onwards)</option>
              </select>
            </div>
          </div>

          <div
            style={{
              background: '#f8fafc',
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid #e2e8f0',
              fontSize: '0.825rem',
              color: '#475569'
            }}
          >
            <Sparkles size={16} style={{ display: 'inline', verticalAlign: 'middle' }} />{' '}
            <strong>Smart Slot Selection:</strong> The system checks actual
            appointment capacity and recommends available time slots.
            Wait-time predictions will be shown when connected to live queue data.
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setStep(2)} className="btn btn-secondary">
              <ChevronLeft size={16} /> Back
            </button>

            <button
              onClick={() => setStep(4)}
              className="btn btn-primary"
              disabled={!selectedDate || selectedDate < getLocalDate()}
            >
              Next: Compare Slots <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Compare Slots */}
      {step === 4 && (
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">
                Step 4: Compare Available Slots
              </h2>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                {selectedOffice?.office_name} • {selectedDate}
              </p>
            </div>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSlotsData(null);
                setSelectedSlot(null);
                setSlotError('');
                setLoadingSlots(true);
                // Changing the date triggers a fresh request.
                setSelectedDate(date => date);
              }}
              disabled={loadingSlots}
              style={{ display: 'none' }}
            >
              Refresh
            </button>
          </div>

          {loadingSlots ? (
            <div className="state-box">
              <div className="spinner"></div>
              <p>Loading actual appointment slots from the database...</p>
            </div>
          ) : slotError && (!slotsData?.allSlots?.length) ? (
            <div className="state-box" style={{ padding: '2rem' }}>
              <AlertCircle
                size={30}
                color="var(--text-muted)"
                style={{ margin: '0 auto 0.75rem' }}
              />
              <p>{slotError}</p>
            </div>
          ) : !slotsData?.allSlots?.length ? (
            <div className="state-box" style={{ padding: '2rem' }}>
              <p>No slots configured for this date.</p>
            </div>
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
                  {slotsData.allSlots.map(s => {
                    const isSelected = selectedSlot?.slotId === s.slotId;

                    return (
                      <tr
                        key={s.slotId}
                        style={{
                          backgroundColor: isSelected ? '#eff6ff' : 'transparent'
                        }}
                      >
                        <td>
                          <strong>
                            {formatTime(s.startTime)} - {formatTime(s.endTime)}
                          </strong>
                        </td>

                        <td>
                          {s.isFull ? (
                            <span className="badge badge-danger">
                              Fully Booked
                            </span>
                          ) : (
                            <span className="badge badge-success">
                              {s.remainingCapacity} seats left
                            </span>
                          )}
                        </td>

                        <td>
                          <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
                            Pending
                          </span>
                          <span
                            style={{
                              fontSize: '0.725rem',
                              color: 'var(--text-muted)',
                              display: 'block'
                            }}
                          >
                            Awaiting queue data
                          </span>
                        </td>

                        <td>
                          <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>
                            Not calculated
                          </span>
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

            <button
              onClick={() => setStep(5)}
              className="btn btn-primary"
              disabled={!selectedSlot || loadingSlots}
            >
              Next: View Recommendations <Sparkles size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Recommendations */}
      {step === 5 && (
        <div className="card">
          <div className="card-header">
            <div>
              <div className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
                <Sparkles size={12} /> Smart Slot Recommendations
              </div>

              <h2 className="card-title">
                Step 5: Recommended Appointment Slots
              </h2>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Recommendations are based on actual remaining appointment capacity
                and your selected time preference.
              </p>
            </div>
          </div>

          {recommendations.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}
            >
              {recommendations.map((item, index) => {
                const isSelected =
                  selectedSlot?.slotId === item.slot.slotId;

                const Icon =
                  item.icon === 'capacity'
                    ? Zap
                    : item.icon === 'preferred'
                      ? ThumbsUp
                      : item.icon === 'earliest'
                        ? Award
                        : Sparkles;

                return (
                  <div
                    key={item.slot.slotId}
                    onClick={() => setSelectedSlot(item.slot)}
                    style={{
                      border: isSelected
                        ? '2px solid var(--primary)'
                        : '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem',
                      background: isSelected
                        ? 'var(--primary-light)'
                        : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}
                  >
                    <div>
                      <span
                        className={`badge ${index === 0 ? 'badge-success' : 'badge-primary'}`}
                        style={{ marginBottom: '0.5rem' }}
                      >
                        <Icon size={12} /> {item.badge}
                      </span>

                      <h3
                        style={{
                          fontSize: '1.05rem',
                          fontWeight: 800,
                          color: 'var(--navy-900)',
                          marginBottom: '0.4rem'
                        }}
                      >
                        {item.title}
                      </h3>

                      <h3
                        style={{
                          fontSize: '1.2rem',
                          fontWeight: 800,
                          color: 'var(--primary)'
                        }}
                      >
                        {formatTime(item.slot.startTime)} - {formatTime(item.slot.endTime)}
                      </h3>

                      <div
                        style={{
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          color: 'var(--teal)',
                          margin: '0.5rem 0'
                        }}
                      >
                        {item.slot.remainingCapacity} seats available
                      </div>

                      <p
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--text-secondary)',
                          lineHeight: 1.5
                        }}
                      >
                        {item.reason}
                      </p>
                    </div>

                    <button
                      type="button"
                      className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ width: '100%' }}
                    >
                      {isSelected ? 'Selected' : 'Choose This Slot'}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="state-box" style={{ padding: '2rem' }}>
              <AlertCircle size={28} style={{ margin: '0 auto 0.5rem' }} />
              <p>No available slot recommendations for this date.</p>
            </div>
          )}

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setStep(4)} className="btn btn-secondary">
              <ChevronLeft size={16} /> Back
            </button>

            <button
              onClick={() => setStep(6)}
              className="btn btn-primary"
              disabled={!selectedSlot}
            >
              Next: Review Booking <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: Review */}
      {step === 6 && (
        <div className="card">
          <h2 className="card-title" style={{ marginBottom: '0.5rem' }}>
            Step 6: Review Booking Information
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Verify your visit details before server-side confirmation.
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              background: '#f8fafc',
              padding: '1.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              marginBottom: '1.5rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Citizen Name:</span>
              <strong>{user?.full_name || 'Not available'} ({user?.email || ''})</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Target Service:</span>
              <strong>{selectedService?.name} ({selectedService?.service_code})</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>RTO Office:</span>
              <strong>{selectedOffice?.office_name} ({selectedOffice?.office_code})</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Date & Slot:</span>
              <strong>
                {selectedDate} at {formatTime(selectedSlot?.startTime)} - {formatTime(selectedSlot?.endTime)}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)' }}>Estimated Wait Time:</span>
              <strong style={{ color: 'var(--primary)', fontSize: '1rem' }}>
                Pending queue calculation
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Remaining Capacity:</span>
              <strong style={{ color: 'var(--teal)' }}>
                {selectedSlot?.remainingCapacity} seats
              </strong>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="booking-notes">
              Special Remarks / Notes (Optional)
            </label>

            <textarea
              id="booking-notes"
              className="form-textarea"
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Enter any additional information..."
            />
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setStep(5)} className="btn btn-secondary">
              <ChevronLeft size={16} /> Back
            </button>

            <button
              onClick={() => setStep(7)}
              className="btn btn-primary"
              disabled={!selectedSlot}
            >
              Proceed to Confirmation <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 7: Confirm Booking */}
      {step === 7 && (
        <div
          className="card"
          style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}
        >
          <FileText
            size={48}
            color="var(--primary)"
            style={{ margin: '0 auto 1rem' }}
          />

          <h2
            style={{
              fontSize: '1.45rem',
              fontWeight: 800,
              color: 'var(--navy-900)',
              marginBottom: '0.5rem'
            }}
          >
            Step 7: Confirm & Issue Queue Token
          </h2>

          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              maxWidth: '480px',
              margin: '0 auto 1.5rem'
            }}
          >
            Confirming executes a database reservation, checks slot capacity,
            and requests your unique queue ticket.
          </p>

          {!user && (
            <div
              style={{
                background: '#fef3c7',
                border: '1px solid #fde68a',
                color: '#92400e',
                padding: '0.85rem 1.25rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.875rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}
            >
              <AlertCircle size={18} />
              <span>You must be logged in to confirm a booking.</span>

              <Link
                to="/login"
                state={{ from: { pathname: '/book' } }}
                className="btn btn-primary btn-sm"
                style={{
                  marginLeft: '0.5rem',
                  display: 'inline-flex',
                  alignItems: 'center'
                }}
              >
                <LogIn size={14} style={{ marginRight: '0.35rem' }} />
                Log In Now
              </Link>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setStep(6)}
              className="btn btn-secondary"
              disabled={submitting}
            >
              Back to Review
            </button>

            <button
              onClick={handleConfirmBooking}
              className="btn btn-primary btn-lg"
              disabled={submitting || !user || !selectedSlot}
            >
              {submitting
                ? 'Reserving Appointment...'
                : 'Confirm & Reserve Slot'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 8: Booking Confirmation */}
      {step === 8 && bookingResult?.appointment && (
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '2.5rem 1.5rem',
            borderTop: '4px solid var(--teal)'
          }}
        >
          <CheckCircle2
            size={54}
            color="var(--teal)"
            style={{ margin: '0 auto 1rem' }}
          />

          <h2
            style={{
              fontSize: '1.6rem',
              fontWeight: 800,
              color: 'var(--navy-900)',
              marginBottom: '0.5rem'
            }}
          >
            Booking Confirmed Successfully!
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
            Your appointment has been registered in the database.
            Your queue ticket details are displayed below.
          </p>

          <div
            className="token-display-box"
            style={{ maxWidth: '440px', margin: '0 auto 2rem' }}
          >
            <span
              style={{
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                opacity: 0.9
              }}
            >
              Queue Token
            </span>

            <div className="token-number">
              {bookingResult.appointment.queue_token || 'Issued'}
            </div>

            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
              Booking Reference:{' '}
              <strong>
                {bookingResult.appointment.booking_reference || 'Generated'}
              </strong>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              maxWidth: '580px',
              margin: '0 auto 2rem',
              textAlign: 'left',
              background: '#f8fafc',
              padding: '1rem',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Office:
              </span>
              <strong style={{ display: 'block', fontSize: '0.875rem' }}>
                {bookingResult.office?.office_name || selectedOffice?.office_name}
              </strong>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Service:
              </span>
              <strong style={{ display: 'block', fontSize: '0.875rem' }}>
                {bookingResult.service?.name || selectedService?.name}
              </strong>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Date & Slot:
              </span>
              <strong style={{ display: 'block', fontSize: '0.875rem' }}>
                {bookingResult.slot?.slot_date || selectedDate}
                {' '}
                ({formatTime(bookingResult.slot?.start_time || selectedSlot?.startTime)})
              </strong>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Forecasted Wait:
              </span>
              <strong style={{ display: 'block', fontSize: '0.875rem', color: 'var(--primary)' }}>
                Pending queue calculation
              </strong>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/dashboard" className="btn btn-secondary">
              Go to Dashboard
            </Link>

            <Link
              to={`/queue?id=${bookingResult.appointment.id}`}
              className="btn btn-primary"
            >
              <Clock size={16} /> Track Queue
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
