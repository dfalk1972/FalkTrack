/* enabling row level security*/
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY;

/*function that looks up the logged in users id in public.users and checks that their status is active and returns their company_id */
CREATE FUNCTION public.current_company_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT company_id
    FROM public.users
    WHERE id = auth.uid() AND status ='active';
$$;

/*Policies*/
CREATE POLICY rls_user
ON public.users
FOR SELECT
USING (public.users.company_id = public.current_company_id());

CREATE POLICY rls_assets
ON public.assets
FOR SELECT
USING (public.assets.company_id = public.current_company_id());

CREATE POLICY rls_jobs
ON public.jobs
FOR SELECT
USING (public.jobs.company_id = public.current_company_id());

CREATE POLICY rls_companies
ON public.companies
FOR SELECT
USING (public.companies.id = public.current_company_id());

CREATE POLICY rls_maintenance_records
ON public.maintenance_records
FOR SELECT
USING (asset_id IN (SELECT id FROM public.assets WHERE company_id  = public.current_company_id()));

CREATE POLICY rls_time_entries
ON public.time_entries
FOR SELECT
USING (job_id IN (SELECT id FROM public.jobs WHERE company_id  = public.current_company_id()));

