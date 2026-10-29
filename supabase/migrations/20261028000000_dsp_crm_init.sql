-- =============================================================================
-- DSP ACADEMY COACHING CRM — SCHEMA & ROW LEVEL SECURITY MIGRATION
-- Target: Supabase PostgreSQL
-- Version: 20261028000000
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES & STAFF
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'sales_rep' CHECK (role IN ('owner', 'sales_manager', 'sales_rep', 'marketing', 'coach', 'operations', 'finance', 'analyst')),
  avatar_initials TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROGRAMS
CREATE TABLE IF NOT EXISTS public.programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  format TEXT DEFAULT 'Cohort + 1-on-1',
  price_ngn NUMERIC(12, 2) NOT NULL DEFAULT 0,
  duration_weeks INT DEFAULT 8,
  active_learners INT DEFAULT 0,
  max_capacity INT DEFAULT 50,
  icon TEXT DEFAULT '✦',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CONTACTS
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  location TEXT DEFAULT 'Lagos, Nigeria',
  occupation TEXT,
  company TEXT,
  source TEXT DEFAULT 'Website',
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  consent BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for duplicate detection
CREATE INDEX IF NOT EXISTS idx_contacts_phone ON public.contacts(phone);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON public.contacts(email);

-- 4. OPPORTUNITIES & LEADS
CREATE TABLE IF NOT EXISTS public.opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  program_id UUID REFERENCES public.programs(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  stage TEXT NOT NULL DEFAULT 'New Lead' CHECK (stage IN (
    'New Lead',
    'Contact Attempted',
    'Contact Established',
    'Qualified',
    'Offer Presented',
    'Follow-up / Decision Pending',
    'Payment Pending',
    'Won',
    'Lost',
    'Nurture'
  )),
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  assigned_name TEXT,
  source TEXT NOT NULL DEFAULT 'Website',
  estimated_value NUMERIC(12, 2) DEFAULT 0,
  quoted_price NUMERIC(12, 2) DEFAULT 0,
  lead_score INT DEFAULT 50 CHECK (lead_score BETWEEN 0 AND 100),
  temperature TEXT DEFAULT 'warm' CHECK (temperature IN ('cold', 'warm', 'hot')),
  qualification_answers JSONB DEFAULT '{}'::jsonb,
  blocker_objections TEXT,
  loss_reason TEXT,
  next_action TEXT,
  next_action_due TIMESTAMPTZ,
  last_interaction_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_opportunities_stage ON public.opportunities(stage);
CREATE INDEX IF NOT EXISTS idx_opportunities_assigned ON public.opportunities(assigned_to);

-- 5. TASKS
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  assigned_name TEXT,
  related_contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  related_opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE SET NULL,
  due_date DATE DEFAULT CURRENT_DATE,
  due_time TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ACTIVITIES (CENTRAL AUDIT & TIMELINE LEDGER)
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  actor_name TEXT NOT NULL,
  related_type TEXT NOT NULL, -- 'lead', 'contact', 'opportunity', 'student', 'finance', 'task'
  related_id UUID,
  activity_type TEXT NOT NULL, -- 'call_attempted', 'call_completed', 'whatsapp_logged', 'qualification_completed', 'offer_presented', 'stage_changed', 'payment_verified', 'task_completed', 'note_added'
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activities_related ON public.activities(related_type, related_id);
CREATE INDEX IF NOT EXISTS idx_activities_created ON public.activities(created_at DESC);

-- 7. ENROLLMENTS & STUDENTS
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID NOT NULL REFERENCES public.contacts(id) ON DELETE RESTRICT,
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE RESTRICT,
  opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE SET NULL,
  student_name TEXT NOT NULL,
  student_email TEXT,
  student_phone TEXT,
  coach_name TEXT,
  cohort TEXT DEFAULT 'Cohort 2026-Q4',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'onboarding', 'paused', 'completed', 'dropped')),
  progress_percent INT DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
  attendance_rate INT DEFAULT 100 CHECK (attendance_rate BETWEEN 0 AND 100),
  payment_status TEXT DEFAULT 'verified' CHECK (payment_status IN ('partial', 'verified', 'sponsored', 'overdue')),
  amount_paid NUMERIC(12, 2) DEFAULT 0,
  balance_due NUMERIC(12, 2) DEFAULT 0,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completion_date DATE
);

-- 8. COACHING SESSIONS
CREATE TABLE IF NOT EXISTS public.coaching_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id UUID REFERENCES public.programs(id) ON DELETE SET NULL,
  coach_name TEXT NOT NULL,
  student_name TEXT NOT NULL,
  student_email TEXT,
  title TEXT NOT NULL,
  session_type TEXT DEFAULT 'Consultation' CHECK (session_type IN ('Consultation', '1-on-1 Coaching', 'Masterclass Review', 'Project Audit', 'Strategy Session')),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INT DEFAULT 45,
  meeting_link TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'missed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. PAYMENTS & FINANCIAL TRANSACTIONS
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE SET NULL,
  program_id UUID REFERENCES public.programs(id) ON DELETE SET NULL,
  amount_ngn NUMERIC(12, 2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  channel TEXT NOT NULL DEFAULT 'Bank Transfer' CHECK (channel IN ('Bank Transfer', 'Paystack', 'Flutterwave', 'Card', 'Cash', 'Installment')),
  transaction_ref TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'verified' CHECK (status IN ('pending', 'verified', 'rejected', 'refunded')),
  verified_by TEXT,
  verified_at TIMESTAMPTZ,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

-- 10. AUTOMATION WORKFLOW RULES
CREATE TABLE IF NOT EXISTS public.automations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  trigger_event TEXT NOT NULL,
  condition_config JSONB DEFAULT '{}'::jsonb,
  action_type TEXT NOT NULL,
  action_config JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  execution_count INT DEFAULT 0,
  last_run_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;

-- Read policies for authenticated staff
CREATE POLICY "Authenticated users can view programs" ON public.programs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view contacts" ON public.contacts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert contacts" ON public.contacts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update contacts" ON public.contacts FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can view opportunities" ON public.opportunities FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert opportunities" ON public.opportunities FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update opportunities" ON public.opportunities FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can view tasks" ON public.tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can modify tasks" ON public.tasks FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can view activities" ON public.activities FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can record activities" ON public.activities FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Staff can view students" ON public.enrollments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff can view sessions" ON public.coaching_sessions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff can modify sessions" ON public.coaching_sessions FOR ALL TO authenticated USING (true);

-- Finance policies: Only owners, finance managers, or sales managers can see or verify payments
CREATE POLICY "Finance staff can view payments" ON public.payments FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IN ('owner', 'finance', 'sales_manager')
  )
);
CREATE POLICY "Finance staff can insert/update payments" ON public.payments FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IN ('owner', 'finance')
  )
);
