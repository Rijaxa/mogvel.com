-- =========================================================
-- 02_auth_core.sql
-- Organizations, Users, Roles, Locations
-- =========================================================

-- 1. Organizations
CREATE TABLE public.organizations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    type text NOT NULL CHECK (type IN ('company','vendor')),
    name text NOT NULL,
    legal_name text,
    tax_id text,
    country text,
    city text,
    address text,
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended','pending_verification')),
    is_listed boolean NOT NULL DEFAULT true,
    verification_status text NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending','verified','rejected')),
    support_phone text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_organizations_updated_at
BEFORE UPDATE ON public.organizations
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 2. Profiles (Extends auth.users)
CREATE TABLE public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name text,
    job_title text,
    phone text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 3. Roles
CREATE TABLE public.roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    scope text NOT NULL CHECK (scope IN ('company','vendor')),
    name text NOT NULL,
    description text,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(organization_id, name)
);

-- 4. Organization Members
CREATE TABLE public.organization_members (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role_id uuid NOT NULL REFERENCES public.roles(id) ON DELETE RESTRICT,
    status text NOT NULL DEFAULT 'invited' CHECK (status IN ('invited','active','disabled')),
    invited_email text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(organization_id, user_id)
);

CREATE TRIGGER trg_org_members_updated_at
BEFORE UPDATE ON public.organization_members
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5. Role Permissions
CREATE TABLE public.role_permissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id uuid NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    resource text NOT NULL,
    action text NOT NULL,
    allowed boolean NOT NULL DEFAULT true,
    UNIQUE(role_id, resource, action)
);

-- 6. Locations
CREATE TABLE public.locations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name text NOT NULL,
    type text CHECK (type IN ('hq','warehouse','office','branch')),
    address text,
    created_at timestamptz NOT NULL DEFAULT now()
);


-- =========================================================
-- Helper Functions (Depend on Core Tables)
-- =========================================================

-- Check if user is an active member of specific org
CREATE OR REPLACE FUNCTION public.is_active_member(p_company_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
 SELECT EXISTS (
   SELECT 1
   FROM public.organization_members m
   WHERE m.organization_id = p_company_id
     AND m.user_id = auth.uid()
     AND m.status = 'active'
 );
$$;

-- Check if user belongs to ANY 'company' type organization
CREATE OR REPLACE FUNCTION public.is_company_user()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
 SELECT EXISTS (
   SELECT 1
   FROM public.organization_members m
   JOIN public.organizations o ON o.id = m.organization_id
   WHERE m.user_id = auth.uid()
     AND m.status = 'active'
     AND o.type = 'company'
 );
$$;

-- Check if user belongs to ANY 'vendor' type organization
CREATE OR REPLACE FUNCTION public.is_vendor_user()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
 SELECT EXISTS (
   SELECT 1
   FROM public.organization_members m
   JOIN public.organizations o ON o.id = m.organization_id
   WHERE m.user_id = auth.uid()
     AND m.status = 'active'
     AND o.type = 'vendor'
 );
$$;

-- Assert Org Type (for triggers)
CREATE OR REPLACE FUNCTION public.assert_org_type(p_org_id uuid, p_expected text)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE t text;
BEGIN
 SELECT type::text INTO t FROM public.organizations WHERE id = p_org_id;
 IF t IS NULL THEN
   RAISE EXCEPTION 'Organization % not found', p_org_id;
 END IF;
 IF t <> p_expected THEN
   RAISE EXCEPTION 'Organization % must be %, got %', p_org_id, p_expected, t;
 END IF;
END;
$$;
