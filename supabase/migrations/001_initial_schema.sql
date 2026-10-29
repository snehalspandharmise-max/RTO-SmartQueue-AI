-- ====================================================================
-- RTO SmartQueue AI: Database Schema Migration 001
-- Description: Core 13 Relational Tables, Constraints, & Indexes
-- Author: Computer Engineering Student
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Profiles (Linked to Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'citizen' CHECK (role IN ('citizen', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. RTO Offices
CREATE TABLE IF NOT EXISTS public.rto_offices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    office_code TEXT NOT NULL UNIQUE,
    office_name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    operating_hours_start TIME NOT NULL DEFAULT '09:00:00',
    operating_hours_end TIME NOT NULL DEFAULT '17:00:00',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Services
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    estimated_duration_minutes INTEGER NOT NULL CHECK (estimated_duration_minutes > 0),
    appointment_quota_per_slot INTEGER NOT NULL DEFAULT 5 CHECK (appointment_quota_per_slot > 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Office Services
CREATE TABLE IF NOT EXISTS public.office_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    office_id UUID NOT NULL REFERENCES public.rto_offices(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    custom_duration_minutes INTEGER,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (office_id, service_id)
);

-- 5. Counters
CREATE TABLE IF NOT EXISTS public.counters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    office_id UUID NOT NULL REFERENCES public.rto_offices(id) ON DELETE CASCADE,
    counter_number INTEGER NOT NULL,
    counter_label TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'busy', 'paused', 'offline')),
    current_appointment_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (office_id, counter_number)
);

-- 6. Counter Services
CREATE TABLE IF NOT EXISTS public.counter_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    counter_id UUID NOT NULL REFERENCES public.counters(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (counter_id, service_id)
);

-- 7. Appointment Slots
CREATE TABLE IF NOT EXISTS public.appointment_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    office_id UUID NOT NULL REFERENCES public.rto_offices(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    slot_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_capacity INTEGER NOT NULL CHECK (max_capacity > 0),
    booked_count INTEGER NOT NULL DEFAULT 0 CHECK (booked_count >= 0 AND booked_count <= max_capacity),
    is_active BOOLEAN NOT NULL DEFAULT true,
    UNIQUE (office_id, service_id, slot_date, start_time)
);

-- 8. Appointments
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    office_id UUID NOT NULL REFERENCES public.rto_offices(id) ON DELETE RESTRICT,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
    slot_id UUID NOT NULL REFERENCES public.appointment_slots(id) ON DELETE RESTRICT,
    counter_id UUID REFERENCES public.counters(id) ON DELETE SET NULL,
    booking_reference TEXT NOT NULL UNIQUE,
    queue_token TEXT NOT NULL,
    token_number INTEGER NOT NULL,
    token_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'booked' CHECK (status IN ('booked', 'checked_in', 'waiting', 'in_progress', 'completed', 'cancelled', 'no_show')),
    notes TEXT,
    checked_in_at TIMESTAMPTZ,
    service_started_at TIMESTAMPTZ,
    service_completed_at TIMESTAMPTZ,
    predicted_wait_at_checkin NUMERIC(5,2),
    actual_wait_minutes NUMERIC(5,2),
    actual_service_minutes NUMERIC(5,2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (office_id, token_date, queue_token)
);

-- 9. Queue Events
CREATE TABLE IF NOT EXISTS public.queue_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
    from_status TEXT,
    to_status TEXT NOT NULL,
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Prediction Snapshots
CREATE TABLE IF NOT EXISTS public.prediction_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
    office_id UUID NOT NULL REFERENCES public.rto_offices(id),
    service_id UUID NOT NULL REFERENCES public.services(id),
    predicted_wait_minutes NUMERIC(5,2) NOT NULL,
    lower_bound_minutes NUMERIC(5,2) NOT NULL,
    upper_bound_minutes NUMERIC(5,2) NOT NULL,
    confidence_score NUMERIC(3,2) NOT NULL,
    confidence_label TEXT NOT NULL,
    factors_used JSONB NOT NULL,
    data_basis TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Counter Recommendations
CREATE TABLE IF NOT EXISTS public.counter_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    office_id UUID NOT NULL REFERENCES public.rto_offices(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    source_counter_id UUID REFERENCES public.counters(id) ON DELETE CASCADE,
    target_counter_id UUID NOT NULL REFERENCES public.counters(id) ON DELETE CASCADE,
    recommendation_type TEXT NOT NULL,
    rationale TEXT NOT NULL,
    expected_wait_reduction_minutes NUMERIC(5,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    notification_type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    change_summary JSONB NOT NULL,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON public.appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_office_date ON public.appointments(office_id, token_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_slots_lookup ON public.appointment_slots(office_id, service_id, slot_date);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_counters_office ON public.counters(office_id);
CREATE INDEX IF NOT EXISTS idx_queue_events_appointment ON public.queue_events(appointment_id);
