create table public.companies(
    id uuid primary key default gen_random_uuid(),
    name varchar not null, 
    industry varchar, 
    created_at timestamptz not null default now()
);

create table public.users(
    id uuid primary key references auth.users (id) on delete cascade, 
    company_id uuid not null references public.companies (id),
    full_name varchar not null,
    email varchar not null,
    role varchar not null default 'worker' check(role in ('admin','worker')) ,
    status varchar not null default 'pending' check (status in ('pending', 'active', 'rejected')),
    created_at timestamptz not null default now()
);

create table public.assets(
    id uuid primary key default gen_random_uuid(),
    company_id uuid not null references public.companies (id),
    name varchar not null,
    asset_number varchar not null,
    category varchar not null,
    make varchar not null, 
    model varchar not null, 
    year int not null,
    thumbnail_url text, 
    created_at timestamptz not null default now(),
    UNIQUE ( company_id, asset_number  )
);

create table public.maintenance_records(
    id uuid primary key default gen_random_uuid(),
    asset_id uuid not null references public.assets(id),
    performed_by uuid not null references public.users (id),
    maintenance_type varchar not null, 
    notes text,
    cost decimal(10,2) not null,
    performed_at timestamptz not null default now(),
    next_due_date date, 
    photo_url text,
    created_at timestamptz not null default now()
);

create table public.jobs(
    id uuid primary key default gen_random_uuid(),
    company_id uuid not null references public.companies (id),
    title varchar not null, 
    description text not null,
    status varchar not null default 'created' check(status in('created', 'in process', 'completed')),
    total_minutes int not null default 0,
    created_at timestamptz not null default now(),
    completed_at timestamptz,
    CHECK ((status in ('completed') AND completed_at is not null) OR (status not in ('completed') AND completed_at is null))
    );

create table public.time_entries(
    id uuid primary key default gen_random_uuid(),
    job_id uuid not null references public.jobs(id),
    user_id uuid not null references public.users(id),
    clock_in timestamptz not null,
    clock_out timestamptz,
    duration_minutes int,
    CHECK ( CASE WHEN clock_out is not null THEN clock_out > clock_in ELSE true END),
    CHECK ( CASE WHEN clock_out is not null THEN duration_minutes is not null ELSE duration_minutes is null END)
);

create UNIQUE index one_open_timer_per_user_per_job ON public.time_entries(user_id, job_id) WHERE clock_out is null;
   