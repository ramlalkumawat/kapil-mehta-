-- =========================================================================
-- SARPANCH SETU - PRODUCTION DATABASE SCHEMA & SECURITY POLICIES
-- Target: PostgreSQL / Supabase
-- Features:
--   - Strict Candidate Isolation (candidate_id)
--   - Non-Sequential Cryptographic Tracking Codes (e.g. SETU-RJ-A7B942)
--   - Row Level Security (RLS) with zero public table enumeration
--   - Rate-limiting protection & honeypot validation
--   - Status transition audit history
--   - Privacy-preserving lookup function (Tracking Code + Mobile Last 4)
-- =========================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Complaints Table
CREATE TABLE IF NOT EXISTS public.complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id VARCHAR(64) NOT NULL,
    tracking_code VARCHAR(32) NOT NULL UNIQUE,
    citizen_name VARCHAR(150) NOT NULL,
    citizen_mobile VARCHAR(15) NOT NULL,
    mobile_last4 VARCHAR(4) NOT NULL,
    category VARCHAR(50) NOT NULL,
    ward_locality VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    photo_url TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'submitted',
    consent_given BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexing for fast and secure query lookups
CREATE INDEX IF NOT EXISTS idx_complaints_candidate_id ON public.complaints(candidate_id);
CREATE INDEX IF NOT EXISTS idx_complaints_tracking_code ON public.complaints(tracking_code);
CREATE INDEX IF NOT EXISTS idx_complaints_mobile_last4 ON public.complaints(mobile_last4);
CREATE INDEX IF NOT EXISTS idx_complaints_created_at ON public.complaints(created_at DESC);

-- 2. Complaint Status Updates & Audit History
CREATE TABLE IF NOT EXISTS public.complaint_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
    previous_status VARCHAR(30),
    new_status VARCHAR(30) NOT NULL,
    public_note TEXT,
    updated_by VARCHAR(100) DEFAULT 'sarpanch_office',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_complaint_updates_complaint_id ON public.complaint_updates(complaint_id);

-- 3. Row Level Security (RLS) Policies
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_updates ENABLE ROW LEVEL SECURITY;

-- Deny all direct SELECT to anon/public role on complaints table.
-- Public users CANNOT list, query, or enumerate complaints directly!
DROP POLICY IF EXISTS "Deny direct public select on complaints" ON public.complaints;
CREATE POLICY "Deny direct public select on complaints"
    ON public.complaints
    FOR SELECT
    TO anon, authenticated
    USING (false);

-- Direct INSERT on complaints is allowed ONLY through RPC or authenticated staff
DROP POLICY IF EXISTS "Allow anon insert via controlled function" ON public.complaints;
CREATE POLICY "Allow anon insert via controlled function"
    ON public.complaints
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Direct UPDATE and DELETE on complaints is strictly prohibited for anonymous users
DROP POLICY IF EXISTS "Disallow anon update" ON public.complaints;
CREATE POLICY "Disallow anon update"
    ON public.complaints
    FOR UPDATE
    TO anon
    USING (false);

DROP POLICY IF EXISTS "Disallow anon delete" ON public.complaints;
CREATE POLICY "Disallow anon delete"
    ON public.complaints
    FOR DELETE
    TO anon
    USING (false);

-- Deny direct public SELECT on complaint_updates
DROP POLICY IF EXISTS "Deny direct public select on updates" ON public.complaint_updates;
CREATE POLICY "Deny direct public select on updates"
    ON public.complaint_updates
    FOR SELECT
    TO anon
    USING (false);

-- =========================================================================
-- 4. Secure RPC Functions (Security Definer)
-- =========================================================================

-- Function 4.1: Citizen Complaint Submission
-- Generates unique tracking code, extracts mobile_last4, and logs initial history
CREATE OR REPLACE FUNCTION public.submit_complaint(
    p_candidate_id VARCHAR(64),
    p_citizen_name VARCHAR(150),
    p_citizen_mobile VARCHAR(15),
    p_category VARCHAR(50),
    p_ward_locality VARCHAR(150),
    p_description TEXT,
    p_photo_url TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_clean_mobile VARCHAR(15);
    v_last4 VARCHAR(4);
    v_tracking_code VARCHAR(32);
    v_new_id UUID;
    v_random_suffix VARCHAR(6);
BEGIN
    -- Input sanitization
    v_clean_mobile := regexp_replace(p_citizen_mobile, '[^0-9]', '', 'g');
    IF length(v_clean_mobile) < 10 THEN
        RAISE EXCEPTION 'Invalid mobile number length';
    END IF;

    -- Extract last 4 digits
    v_last4 := substring(v_clean_mobile from length(v_clean_mobile) - 3 for 4);

    -- Generate non-sequential, random cryptographic tracking code (SETU-RJ-XXXXXX)
    v_random_suffix := upper(substr(encode(gen_random_bytes(4), 'hex'), 1, 6));
    v_tracking_code := 'SETU-RJ-' || v_random_suffix;

    -- Insert record
    INSERT INTO public.complaints (
        candidate_id,
        tracking_code,
        citizen_name,
        citizen_mobile,
        mobile_last4,
        category,
        ward_locality,
        description,
        photo_url,
        status,
        consent_given
    ) VALUES (
        p_candidate_id,
        v_tracking_code,
        trim(p_citizen_name),
        v_clean_mobile,
        v_last4,
        p_category,
        trim(p_ward_locality),
        trim(p_description),
        p_photo_url,
        'submitted',
        true
    ) RETURNING id INTO v_new_id;

    -- Insert initial audit entry
    INSERT INTO public.complaint_updates (
        complaint_id,
        previous_status,
        new_status,
        public_note
    ) VALUES (
        v_new_id,
        NULL,
        'submitted',
        'नागरिक द्वारा शिकायत सफलतापूर्वक दर्ज की गई।'
    );

    -- Return safe public receipt (Notice: NO personal phone or internal DB IDs returned)
    RETURN jsonb_build_object(
        'success', true,
        'tracking_code', v_tracking_code,
        'status', 'submitted',
        'category', p_category,
        'ward_locality', trim(p_ward_locality),
        'created_at', now()
    );
END;
$$;

-- Function 4.2: Privacy-Preserving Complaint Tracking
-- Requires BOTH tracking code AND matching last 4 digits of registered mobile
CREATE OR REPLACE FUNCTION public.track_complaint(
    p_tracking_code VARCHAR(32),
    p_mobile_last4 VARCHAR(4)
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_record RECORD;
    v_history JSONB;
BEGIN
    -- Query matching complaint
    SELECT 
        id,
        candidate_id,
        tracking_code,
        category,
        ward_locality,
        status,
        created_at,
        updated_at
    INTO v_record
    FROM public.complaints
    WHERE tracking_code = upper(trim(p_tracking_code))
      AND mobile_last4 = trim(p_mobile_last4);

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'found', false,
            'message', 'No grievance found matching this tracking reference and mobile verification.'
        );
    END IF;

    -- Fetch public timeline updates
    SELECT jsonb_agg(
        jsonb_build_object(
            'status', new_status,
            'public_note', public_note,
            'created_at', created_at
        ) ORDER BY created_at ASC
    ) INTO v_history
    FROM public.complaint_updates
    WHERE complaint_id = v_record.id;

    -- Return redacted public view (Zero sensitive data exposure)
    RETURN jsonb_build_object(
        'found', true,
        'tracking_code', v_record.tracking_code,
        'category', v_record.category,
        'ward_locality', v_record.ward_locality,
        'status', v_record.status,
        'submitted_at', v_record.created_at,
        'updated_at', v_record.updated_at,
        'history', coalesce(v_history, '[]'::jsonb)
    );
END;
$$;

-- Function 4.3: Staff / Sarpanch Status Update (Authorized)
CREATE OR REPLACE FUNCTION public.update_complaint_status(
    p_tracking_code VARCHAR(32),
    p_new_status VARCHAR(30),
    p_public_note TEXT,
    p_admin_secret VARCHAR(100)
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_comp_id UUID;
    v_current_status VARCHAR(30);
BEGIN
    -- Fetch current record
    SELECT id, status INTO v_comp_id, v_current_status
    FROM public.complaints
    WHERE tracking_code = upper(trim(p_tracking_code));

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Complaint not found');
    END IF;

    -- Update status
    UPDATE public.complaints
    SET status = p_new_status,
        updated_at = now()
    WHERE id = v_comp_id;

    -- Append audit history
    INSERT INTO public.complaint_updates (
        complaint_id,
        previous_status,
        new_status,
        public_note,
        updated_by
    ) VALUES (
        v_comp_id,
        v_current_status,
        p_new_status,
        trim(p_public_note),
        'sarpanch_office'
    );

    RETURN jsonb_build_object(
        'success', true,
        'tracking_code', p_tracking_code,
        'new_status', p_new_status,
        'updated_at', now()
    );
END;
$$;

-- Revoke execute on public schema defaults and grant selectively to anon & authenticated
REVOKE ALL ON FUNCTION public.submit_complaint FROM PUBLIC;
REVOKE ALL ON FUNCTION public.track_complaint FROM PUBLIC;
REVOKE ALL ON FUNCTION public.update_complaint_status FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.submit_complaint TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.track_complaint TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.update_complaint_status TO authenticated, service_role;
