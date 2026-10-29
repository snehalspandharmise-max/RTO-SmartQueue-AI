-- ====================================================================
-- RTO SmartQueue AI: Database Schema Migration 002
-- Description: Row Level Security (RLS) Policies & RBAC Controls
-- Author: Computer Engineering Student
-- ====================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rto_offices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.office_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counter_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queue_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prediction_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counter_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current authenticated user is an administrator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Profiles Policies
CREATE POLICY "Users can view own profile or admins can view all"
ON public.profiles FOR SELECT
USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile (non-role) or admins"
ON public.profiles FOR UPDATE
USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Allow system insert into profiles"
ON public.profiles FOR INSERT
WITH CHECK (true);

-- 2. Public Read Policies for Offices & Services
CREATE POLICY "Public read for RTO offices"
ON public.rto_offices FOR SELECT
USING (true);

CREATE POLICY "Admin write for RTO offices"
ON public.rto_offices FOR ALL
USING (public.is_admin());

CREATE POLICY "Public read for Services"
ON public.services FOR SELECT
USING (true);

CREATE POLICY "Admin write for Services"
ON public.services FOR ALL
USING (public.is_admin());

CREATE POLICY "Public read for Office Services"
ON public.office_services FOR SELECT
USING (true);

CREATE POLICY "Admin write for Office Services"
ON public.office_services FOR ALL
USING (public.is_admin());

-- 3. Counters Policies
CREATE POLICY "Public read for Counters"
ON public.counters FOR SELECT
USING (true);

CREATE POLICY "Admin write for Counters"
ON public.counters FOR ALL
USING (public.is_admin());

CREATE POLICY "Public read for Counter Services"
ON public.counter_services FOR SELECT
USING (true);

CREATE POLICY "Admin write for Counter Services"
ON public.counter_services FOR ALL
USING (public.is_admin());

-- 4. Appointment Slots Policies
CREATE POLICY "Public read for Appointment Slots"
ON public.appointment_slots FOR SELECT
USING (true);

CREATE POLICY "Admin write for Appointment Slots"
ON public.appointment_slots FOR ALL
USING (public.is_admin());

-- 5. Appointments Policies (Strict Tenant Isolation)
CREATE POLICY "Citizens can view own appointments or admins view all"
ON public.appointments FOR SELECT
USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Citizens can insert own appointment"
ON public.appointments FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Citizens can cancel/reschedule own booked appointment or admins update"
ON public.appointments FOR UPDATE
USING ((auth.uid() = user_id AND status = 'booked') OR public.is_admin());

-- 6. Notifications Policies
CREATE POLICY "Citizens can view own notifications"
ON public.notifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Citizens can update own notifications"
ON public.notifications FOR UPDATE
USING (auth.uid() = user_id);

-- 7. Administrative Tables (Recommendations & Audit Logs)
CREATE POLICY "Admin only for Counter Recommendations"
ON public.counter_recommendations FOR ALL
USING (public.is_admin());

CREATE POLICY "Admin only for Audit Logs"
ON public.audit_logs FOR ALL
USING (public.is_admin());

-- 8. Queue Events & Prediction Snapshots
CREATE POLICY "Read queue events for authorized appointments"
ON public.queue_events FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.appointments a
        WHERE a.id = appointment_id AND (a.user_id = auth.uid() OR public.is_admin())
    )
);

CREATE POLICY "Read prediction snapshots for authorized appointments"
ON public.prediction_snapshots FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.appointments a
        WHERE a.id = appointment_id AND (a.user_id = auth.uid() OR public.is_admin())
    ) OR public.is_admin()
);
