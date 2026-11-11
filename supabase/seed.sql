-- ====================================================================
-- RTO SmartQueue AI: Comprehensive Academic Demonstration Seed Data
-- Clearly Identifiable Synthetic Demonstration Records
-- ====================================================================

-- 1. Profiles (Deterministic UUIDs for Demonstration)
INSERT INTO public.profiles (id, email, full_name, phone, role)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'admin@smartqueue.demo', 'Demonstration Administrator', '+91 98765 43210', 'admin'),
    ('22222222-2222-2222-2222-222222222222', 'citizen@smartqueue.demo', 'Aarav Sharma (Demo Citizen)', '+91 98765 12345', 'citizen'),
    ('33333333-3333-3333-3333-333333333333', 'priya.patel@example.com', 'Priya Patel', '+91 98765 23456', 'citizen'),
    ('44444444-4444-4444-4444-444444444444', 'rohit.verma@example.com', 'Rohit Verma', '+91 98765 34567', 'citizen'),
    ('55555555-5555-5555-5555-555555555555', 'ananya.deshmukh@example.com', 'Ananya Deshmukh', '+91 98765 45678', 'citizen')
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

-- 2. Verified Maharashtra Regional Transport Offices (Reference: transport.maharashtra.gov.in)
INSERT INTO public.rto_offices (id, office_code, office_name, address, city, state, timezone, operating_hours_start, operating_hours_end, is_active)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'MH-01', 'Mumbai Central Regional Transport Office', 'Old Bodyguard Lane, Tulsiwadi, Tardeo', 'Mumbai', 'Maharashtra', 'Asia/Kolkata', '09:00:00', '17:00:00', true),
    ('a0000000-0000-0000-0000-000000000002', 'MH-12', 'Pune Regional Transport Office', '38, Dr. Ambedkar Road, Sangam Bridge, Pune', 'Pune', 'Maharashtra', 'Asia/Kolkata', '09:00:00', '17:00:00', true),
    ('a0000000-0000-0000-0000-000000000003', 'MH-02', 'Mumbai West Regional Transport Office', 'D/111, Ambivali Village, Versova Road, Andheri (West)', 'Mumbai', 'Maharashtra', 'Asia/Kolkata', '09:00:00', '17:00:00', true),
    ('a0000000-0000-0000-0000-000000000004', 'MH-03', 'Mumbai East Regional Transport Office', 'BPT Colony, Eastern Freeway Road, Wadala (East)', 'Mumbai', 'Maharashtra', 'Asia/Kolkata', '09:00:00', '17:00:00', true),
    ('a0000000-0000-0000-0000-000000000005', 'MH-04', 'Thane Regional Transport Office', 'Near Central Jail, Court Naka, Thane (West)', 'Thane', 'Maharashtra', 'Asia/Kolkata', '09:00:00', '17:00:00', true),
    ('a0000000-0000-0000-0000-000000000006', 'MH-05', 'Kalyan Deputy Regional Transport Office', 'Near Sahajanand Chowk, Agra Road, Rambaug, Kalyan', 'Kalyan', 'Maharashtra', 'Asia/Kolkata', '09:00:00', '17:00:00', true),
    ('a0000000-0000-0000-0000-000000000007', 'MH-43', 'Navi Mumbai Regional Transport Office', 'Sector 19B, APMC Market Road, Vashi, Navi Mumbai', 'Navi Mumbai', 'Maharashtra', 'Asia/Kolkata', '09:00:00', '17:00:00', true),
    ('a0000000-0000-0000-0000-000000000008', 'MH-46', 'Panvel Regional Transport Office', 'NH-4, Palaspa Phata, Near Panvel Town, Raigad', 'Panvel', 'Maharashtra', 'Asia/Kolkata', '09:00:00', '17:00:00', true),
    ('a0000000-0000-0000-0000-000000000009', 'MH-47', 'Borivali Deputy Regional Transport Office', 'Kandarpada, Dahisar Link Road, Borivali (West)', 'Mumbai', 'Maharashtra', 'Asia/Kolkata', '09:00:00', '17:00:00', true),
    ('a0000000-0000-0000-0000-000000000010', 'MH-48', 'Vasai Deputy Regional Transport Office', 'Chinchoti-Kaman Road, Chandansar, Virar / Vasai', 'Vasai-Virar', 'Maharashtra', 'Asia/Kolkata', '09:00:00', '17:00:00', true),
    ('a0000000-0000-0000-0000-000000000011', 'MH-14', 'Pimpri-Chinchwad Deputy Regional Transport Office', 'Sector 6, Spine Road, Moshi Pradhikaran, PCMC', 'Pimpri-Chinchwad', 'Maharashtra', 'Asia/Kolkata', '09:00:00', '17:00:00', true),
    ('a0000000-0000-0000-0000-000000000012', 'MH-09', 'Kolhapur Regional Transport Office', 'Kasaba Bawada Main Road, Kolhapur', 'Kolhapur', 'Maharashtra', 'Asia/Kolkata', '09:00:00', '17:00:00', true),
    ('a0000000-0000-0000-0000-000000000013', 'MH-10', 'Sangli Deputy Regional Transport Office', 'Madhavnagar Road, Sangli', 'Sangli', 'Maharashtra', 'Asia/Kolkata', '09:00:00', '17:00:00', true),
    ('a0000000-0000-0000-0000-000000000014', 'MH-11', 'Satara Deputy Regional Transport Office', 'Camp Area, Near Circuit House, Satara', 'Satara', 'Maharashtra', 'Asia/Kolkata', '09:00:00', '17:00:00', true),
    ('a0000000-0000-0000-0000-000000000015', 'MH-13', 'Solapur Regional Transport Office', 'Near Old Pune Naka, Solapur', 'Solapur', 'Maharashtra', 'Asia/Kolkata', '09:00:00', '17:00:00', true),
    ('a0000000-0000-0000-0000-000000000016', 'MH-15', 'Nashik Regional Transport Office', 'Trimbak Road, Near ITI, Satpur, Nashik', 'Nashik', 'Maharashtra', 'Asia/Kolkata', '09:00:00', '17:00:00', true),
    ('a0000000-0000-0000-0000-000000000017', 'MH-16', 'Ahmednagar Deputy Regional Transport Office', 'MIDC Nagapur Road, Ahmednagar', 'Ahmednagar', 'Maharashtra', 'Asia/Kolkata', '09:00:00', '17:00:00', true),
    ('a0000000-0000-0000-0000-000000000018', 'MH-18', 'Dhule Regional Transport Office', 'Mumbai-Agra Highway, Mohadi, Dhule', 'Dhule', 'Maharashtra', 'Asia/Kolkata', '09:00:00', '17:00:00', true),
    ('a0000000-0000-0000-0000-000000000019', 'MH-19', 'Jalgaon Regional Transport Office', 'Adarsh Nagar, National Highway 6, Jalgaon', 'Jalgaon', 'Maharashtra', 'Asia/Kolkata', '09:00:00', '17:00:00', true),
    ('a0000000-0000-0000-0000-000000000020', 'MH-20', 'Chhatrapati Sambhajinagar Regional Transport Office', 'Railway Station Road, Near Goldie Cinema, Chhatrapati Sambhajinagar', 'Chhatrapati Sambhajinagar', 'Maharashtra', 'Asia/Kolkata', '09:00:00', '17:00:00', true),
    ('a0000000-0000-0000-0000-000000000021', 'MH-24', 'Latur Deputy Regional Transport Office', 'Babhalgaon Road, Latur', 'Latur', 'Maharashtra', 'Asia/Kolkata', '09:00:00', '17:00:00', true),
    ('a0000000-0000-0000-0000-000000000022', 'MH-26', 'Nanded Regional Transport Office', 'Maltekdi Road, VIP Road, Nanded', 'Nanded', 'Maharashtra', 'Asia/Kolkata', '09:00:00', '17:00:00', true),
    ('a0000000-0000-0000-0000-000000000023', 'MH-31', 'Nagpur City Regional Transport Office', 'Opposite Railway Station, Giripeth, Nagpur', 'Nagpur', 'Maharashtra', 'Asia/Kolkata', '09:00:00', '17:00:00', true),
    ('a0000000-0000-0000-0000-000000000024', 'MH-40', 'Nagpur Rural Deputy Regional Transport Office', 'Amravati Road, Wadi, Nagpur Rural', 'Nagpur', 'Maharashtra', 'Asia/Kolkata', '09:00:00', '17:00:00', true),
    ('a0000000-0000-0000-0000-000000000025', 'MH-27', 'Amravati Regional Transport Office', 'Near Collector Office, Camp, Amravati', 'Amravati', 'Maharashtra', 'Asia/Kolkata', '09:00:00', '17:00:00', true)
ON CONFLICT (office_code) DO NOTHING;

-- 3. Configurable Services
INSERT INTO public.services (id, service_code, name, description, estimated_duration_minutes, appointment_quota_per_slot, is_active)
VALUES
    ('b0000000-0000-0000-0000-000000000001', 'DL', 'Driving Licence', 'Permanent driving licence biometrics, document verification, and practical test processing', 15, 6, true),
    ('b0000000-0000-0000-0000-000000000002', 'LL', 'Learner''s Licence', 'Online learner licence approval, knowledge verification, and issuance', 10, 10, true),
    ('b0000000-0000-0000-0000-000000000003', 'VR', 'Vehicle Registration', 'New vehicle registration, chassis verification, and smart card assignment', 25, 4, true),
    ('b0000000-0000-0000-0000-000000000004', 'TO', 'Ownership Transfer', 'Vehicle ownership transfer verification, NOC validation, and endorsement', 20, 5, true),
    ('b0000000-0000-0000-0000-000000000005', 'RC', 'RC Renewal', 'Registration Certificate fitness check, renewal, and address change updates', 15, 6, true)
ON CONFLICT (service_code) DO NOTHING;

-- 4. Office Services Mapping
INSERT INTO public.office_services (office_id, service_id, custom_duration_minutes, is_active)
SELECT 'a0000000-0000-0000-0000-000000000001', id, estimated_duration_minutes, true FROM public.services
ON CONFLICT (office_id, service_id) DO NOTHING;

-- 5. Counters (Office 1)
INSERT INTO public.counters (id, office_id, counter_number, counter_label, status)
VALUES
    ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 1, 'Counter 1 — Licence Services', 'active'),
    ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 2, 'Counter 2 — Fast-Track Learner', 'active'),
    ('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 3, 'Counter 3 — Vehicle Registration & Transfer', 'active'),
    ('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 4, 'Counter 4 — RC Renewal & General Inquiries', 'active'),
    ('c0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 5, 'Counter 5 — Priority & Overflow Assistance', 'active')
ON CONFLICT (office_id, counter_number) DO NOTHING;

-- 6. Counter Authorized Services
-- Counter 1: DL, LL
INSERT INTO public.counter_services (counter_id, service_id)
VALUES 
    ('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001'),
    ('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002')
ON CONFLICT (counter_id, service_id) DO NOTHING;

-- Counter 2: LL only
INSERT INTO public.counter_services (counter_id, service_id)
VALUES 
    ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002')
ON CONFLICT (counter_id, service_id) DO NOTHING;

-- Counter 3: VR, TO
INSERT INTO public.counter_services (counter_id, service_id)
VALUES 
    ('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003'),
    ('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000004')
ON CONFLICT (counter_id, service_id) DO NOTHING;

-- Counter 4: RC, TO
INSERT INTO public.counter_services (counter_id, service_id)
VALUES 
    ('c0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000005'),
    ('c0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000004')
ON CONFLICT (counter_id, service_id) DO NOTHING;

-- Counter 5: DL, RC, VR (Overflow)
INSERT INTO public.counter_services (counter_id, service_id)
VALUES 
    ('c0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000001'),
    ('c0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000005')
ON CONFLICT (counter_id, service_id) DO NOTHING;

-- 7. Appointment Slots for Today
INSERT INTO public.appointment_slots (id, office_id, service_id, slot_date, start_time, end_time, max_capacity, booked_count, is_active)
VALUES
    ('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', CURRENT_DATE, '09:00:00', '10:00:00', 6, 4, true),
    ('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', CURRENT_DATE, '10:00:00', '11:00:00', 6, 5, true),
    ('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', CURRENT_DATE, '11:00:00', '12:00:00', 6, 2, true),
    ('d0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', CURRENT_DATE, '14:00:00', '15:00:00', 6, 1, true),
    ('d0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', CURRENT_DATE, '15:00:00', '16:00:00', 6, 0, true)
ON CONFLICT (office_id, service_id, slot_date, start_time) DO NOTHING;

-- 8. Seed Synthetic Appointments for Demonstration
-- A: Completed Appointments for Prediction Accuracy Evaluation (MAE / MAPE)
INSERT INTO public.appointments (
    id, user_id, office_id, service_id, slot_id, counter_id,
    booking_reference, queue_token, token_number, token_date,
    status, predicted_wait_at_checkin, actual_wait_minutes, actual_service_minutes,
    checked_in_at, service_started_at, service_completed_at
) VALUES
    ('e0000000-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'BK-2026101', 'DL-101', 101, CURRENT_DATE, 'completed', 14.0, 16.2, 14.8, NOW() - INTERVAL '3 hours', NOW() - INTERVAL '2 hours 44 minutes', NOW() - INTERVAL '2 hours 29 minutes'),
    ('e0000000-0000-0000-0000-000000000002', '44444444-4444-4444-4444-444444444444', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'BK-2026102', 'DL-102', 102, CURRENT_DATE, 'completed', 18.0, 19.5, 15.2, NOW() - INTERVAL '2 hours 30 minutes', NOW() - INTERVAL '2 hours 10 minutes', NOW() - INTERVAL '1 hour 55 minutes'),
    ('e0000000-0000-0000-0000-000000000003', '55555555-5555-5555-5555-555555555555', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'BK-2026103', 'DL-103', 103, CURRENT_DATE, 'completed', 12.0, 11.0, 13.5, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour 49 minutes', NOW() - INTERVAL '1 hour 35 minutes');

-- B: Active In-Progress Appointment
INSERT INTO public.appointments (
    id, user_id, office_id, service_id, slot_id, counter_id,
    booking_reference, queue_token, token_number, token_date,
    status, predicted_wait_at_checkin, checked_in_at, service_started_at
) VALUES
    ('e0000000-0000-0000-0000-000000000004', '44444444-4444-4444-4444-444444444444', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'BK-2026104', 'DL-104', 104, CURRENT_DATE, 'in_progress', 15.0, NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '8 minutes');

-- C: Demo Citizen's Live Waiting Appointment (Token DL-105)
INSERT INTO public.appointments (
    id, user_id, office_id, service_id, slot_id,
    booking_reference, queue_token, token_number, token_date,
    status, predicted_wait_at_checkin, checked_in_at
) VALUES
    ('e0000000-0000-0000-0000-000000000005', '22222222-2222-2222-2222-222222222222', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'BK-2026105', 'DL-105', 105, CURRENT_DATE, 'waiting', 14.5, NOW() - INTERVAL '15 minutes');

-- 9. Pending Counter Reassignment Recommendation for Demo
INSERT INTO public.counter_recommendations (
    id, office_id, service_id, source_counter_id, target_counter_id,
    recommendation_type, rationale, expected_wait_reduction_minutes, status
) VALUES
    ('f0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000005', 'REASSIGN_COUNTER', 'Counter 1 Driving Licence queue has 3 citizens waiting. Eligible Counter 5 has low utilization. Temporarily routing DL requests to Counter 5 is estimated to reduce wait times by 12 minutes.', 12.0, 'pending');

-- 10. Notifications for Demo Citizen
INSERT INTO public.notifications (user_id, appointment_id, notification_type, title, message, is_read)
VALUES
    ('22222222-2222-2222-2222-222222222222', 'e0000000-0000-0000-0000-000000000005', 'BOOKING_CONFIRMED', 'Appointment Confirmed', 'Your appointment for Driving Licence at Mumbai Central Demonstration RTO is confirmed with Token DL-105.', true),
    ('22222222-2222-2222-2222-222222222222', 'e0000000-0000-0000-0000-000000000005', 'STATUS_CHANGED', 'Checked In Successfully', 'You have been marked Checked In. Your estimated wait time is currently 14-18 minutes.', false);

-- 11. Audit Log Demo Record
INSERT INTO public.audit_logs (actor_id, action, target_type, target_id, change_summary)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'SYSTEM_INITIALIZATION', 'system', 'sys-01', '{"message": "Academic demonstration database initialized with standard RTO services and synthetic records"}');
