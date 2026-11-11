-- ====================================================================
-- RTO SmartQueue AI — Migration 003: Portal & Gaming Schema
-- Adds support for department announcements, road safety learning scores,
-- candidate achievement badges, and citizen grievance/feedback records.
-- ====================================================================

-- 1. Portal Announcements Table
CREATE TABLE IF NOT EXISTS portal_announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    priority VARCHAR(32) NOT NULL DEFAULT 'medium', -- urgent, high, medium, low
    summary TEXT NOT NULL,
    details TEXT NOT NULL,
    published_date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Road Safety Candidate Scores & Certifications Table
CREATE TABLE IF NOT EXISTS road_safety_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    candidate_name VARCHAR(128) NOT NULL,
    test_type VARCHAR(64) NOT NULL, -- ll_mock_exam, sign_challenge, signal_master, etc.
    score INT NOT NULL,
    max_score INT NOT NULL,
    percentage NUMERIC(5, 2) NOT NULL,
    passed BOOLEAN NOT NULL,
    certificate_id VARCHAR(64) UNIQUE,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Citizen Feedback & Grievances Table
CREATE TABLE IF NOT EXISTS citizen_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(128) NOT NULL,
    email VARCHAR(128) NOT NULL,
    phone VARCHAR(32),
    subject VARCHAR(64) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'received', -- received, under_review, resolved
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE portal_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE road_safety_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE citizen_feedback ENABLE ROW LEVEL SECURITY;

-- Announcements: Public read access
CREATE POLICY "Public read access for portal announcements"
    ON portal_announcements FOR SELECT
    USING (is_active = true);

-- Road Safety Scores: Authenticated read & insert access
CREATE POLICY "Users can view their own road safety scores"
    ON road_safety_scores FOR SELECT
    USING (auth.uid() = user_id OR auth.role() = 'service_role');

CREATE POLICY "Users can record their road safety results"
    ON road_safety_scores FOR INSERT
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Feedback: Public insert access; Admin read access
CREATE POLICY "Public can submit citizen feedback"
    ON citizen_feedback FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Admins can view citizen feedback"
    ON citizen_feedback FOR SELECT
    USING (auth.role() = 'service_role');
