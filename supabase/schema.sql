create table if not exists public.leads (
  id text primary key,
  type text not null,
  created_at timestamptz not null default now(),
  name text not null,
  mobile text not null,
  location text,
  event_type text,
  guests integer,
  booking_date date,
  booking_time time,
  budget text,
  request text,
  status text not null default 'new' check (status in ('new', 'contacted', 'confirmed', 'closed'))
);

alter table public.leads enable row level security;

create policy "Public can submit leads"
on public.leads for insert
to anon, authenticated
with check (true);

create policy "Authenticated owner can read leads"
on public.leads for select
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'owner');

create policy "Authenticated owner can update leads"
on public.leads for update
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'owner')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'owner');

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_location_idx on public.leads (location);
create index if not exists leads_type_idx on public.leads (type);
