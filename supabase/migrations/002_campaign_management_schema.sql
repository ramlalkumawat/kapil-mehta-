-- =========================================================================
-- SARPANCH SETU - MIGRATION 002: WARD & CAMPAIGN MANAGEMENT SCHEMA
-- Target Candidate: Kapil Mehta (candidate-kapil-mehta)
-- Jurisdiction: Zila Parishad Ward No. 22, Jhalawar, Rajasthan
-- Features:
--   - Gram Panchayat & Polling Booth registry
--   - Volunteer management & booth/village assignments
--   - Voter management with EPIC ID & verification status
--   - Field surveys & door-to-door visit logging
--   - Campaign task tracking & assignment
--   - Strict Candidate Isolation (candidate_id) & Row Level Security (RLS)
-- =========================================================================

-- Enable pgcrypto for UUID generation if not already active
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Gram Panchayats & Locations Table
CREATE TABLE IF NOT EXISTS public.gram_panchayats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id VARCHAR(64) NOT NULL,
    ward_number VARCHAR(20) NOT NULL DEFAULT '22',
    name_hi VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    tehsil VARCHAR(100) DEFAULT 'खानपुर',
    district VARCHAR(100) DEFAULT 'झालावाड़',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_gram_panchayats_candidate ON public.gram_panchayats(candidate_id);
CREATE INDEX IF NOT EXISTS idx_gram_panchayats_ward ON public.gram_panchayats(ward_number);

-- 2. Polling Booths Table
CREATE TABLE IF NOT EXISTS public.polling_booths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id VARCHAR(64) NOT NULL,
    gram_panchayat_id UUID REFERENCES public.gram_panchayats(id) ON DELETE CASCADE,
    booth_number VARCHAR(30),
    name_hi VARCHAR(200) NOT NULL,
    name_en VARCHAR(200),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_polling_booths_candidate ON public.polling_booths(candidate_id);

-- 3. Campaign Volunteers Table
CREATE TABLE IF NOT EXISTS public.volunteers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id VARCHAR(64) NOT NULL,
    name VARCHAR(150) NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    gram_panchayat VARCHAR(100) NOT NULL,
    assigned_booth VARCHAR(200),
    role VARCHAR(80) DEFAULT 'सक्रिय कार्यकर्ता',
    status VARCHAR(30) DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_volunteers_candidate ON public.volunteers(candidate_id);
CREATE INDEX IF NOT EXISTS idx_volunteers_gp ON public.volunteers(gram_panchayat);

-- 4. Voter Registry Table
CREATE TABLE IF NOT EXISTS public.voters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id VARCHAR(64) NOT NULL,
    voter_id_epic VARCHAR(50),
    full_name VARCHAR(150) NOT NULL,
    relative_name VARCHAR(150),
    age INT,
    gender VARCHAR(10),
    gram_panchayat VARCHAR(100) NOT NULL,
    booth_name VARCHAR(200),
    mobile VARCHAR(15),
    address TEXT,
    status VARCHAR(30) DEFAULT 'verified',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_voters_candidate ON public.voters(candidate_id);
CREATE INDEX IF NOT EXISTS idx_voters_gp ON public.voters(gram_panchayat);
CREATE INDEX IF NOT EXISTS idx_voters_epic ON public.voters(voter_id_epic);

-- 5. Field Surveys & Visits Table
CREATE TABLE IF NOT EXISTS public.field_visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id VARCHAR(64) NOT NULL,
    gram_panchayat VARCHAR(100) NOT NULL,
    village_locality VARCHAR(150),
    volunteer_name VARCHAR(150) NOT NULL,
    visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
    issues_raised TEXT,
    sentiment VARCHAR(30) DEFAULT 'positive',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_field_visits_candidate ON public.field_visits(candidate_id);
CREATE INDEX IF NOT EXISTS idx_field_visits_gp ON public.field_visits(gram_panchayat);

-- 6. Campaign Tasks Table
CREATE TABLE IF NOT EXISTS public.campaign_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id VARCHAR(64) NOT NULL,
    title VARCHAR(250) NOT NULL,
    assigned_to VARCHAR(150),
    gram_panchayat VARCHAR(100) DEFAULT 'all',
    due_date DATE,
    priority VARCHAR(20) DEFAULT 'medium',
    status VARCHAR(30) DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_campaign_tasks_candidate ON public.campaign_tasks(candidate_id);

-- =========================================================================
-- 7. Row Level Security (RLS) Policies
-- =========================================================================

ALTER TABLE public.gram_panchayats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polling_booths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.field_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_tasks ENABLE ROW LEVEL SECURITY;

-- Allow public read of candidate's configured gram panchayats
DROP POLICY IF EXISTS "Public can view gram panchayats" ON public.gram_panchayats;
CREATE POLICY "Public can view gram panchayats"
    ON public.gram_panchayats
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Deny public enumeration of volunteers and voters
DROP POLICY IF EXISTS "Deny direct public select on volunteers" ON public.volunteers;
CREATE POLICY "Deny direct public select on volunteers"
    ON public.volunteers
    FOR SELECT
    TO anon
    USING (false);

DROP POLICY IF EXISTS "Deny direct public select on voters" ON public.voters;
CREATE POLICY "Deny direct public select on voters"
    ON public.voters
    FOR SELECT
    TO anon
    USING (false);

-- =========================================================================
-- 8. Seed Initial 7 Gram Panchayats for Kapil Mehta (Ward 22)
-- =========================================================================
INSERT INTO public.gram_panchayats (candidate_id, ward_number, name_hi, name_en, tehsil, district)
VALUES
    ('candidate-kapil-mehta', '22', 'अकोदिया', 'Akodiya', 'खानपुर', 'झालावाड़'),
    ('candidate-kapil-mehta', '22', 'सरखंडिया', 'Sarkhandiya', 'खानपुर', 'झालावाड़'),
    ('candidate-kapil-mehta', '22', 'पनवाड़', 'Panwad', 'खानपुर', 'झालावाड़'),
    ('candidate-kapil-mehta', '22', 'बिशन खेड़ी', 'Bishan Khedi', 'खानपुर', 'झालावाड़'),
    ('candidate-kapil-mehta', '22', 'पखराना', 'Pakhrana', 'खानपुर', 'झालावाड़'),
    ('candidate-kapil-mehta', '22', 'लायफल', 'Layphal', 'खानपुर', 'झालावाड़'),
    ('candidate-kapil-mehta', '22', 'हरीगढ़', 'Harigarh', 'खानपुर', 'झालावाड़')
ON CONFLICT DO NOTHING;
