-- Run this once in the Supabase Dashboard SQL Editor.
create table if not exists public.shared_state (
  id integer primary key check (id = 1),
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.shared_state enable row level security;

drop policy if exists "Signed-in users can read shared lists" on public.shared_state;
drop policy if exists "Allowlisted phones can read shared lists" on public.shared_state;
drop policy if exists "Allowlisted emails can read shared lists" on public.shared_state;
create policy "Allowlisted emails can read shared lists"
  on public.shared_state for select to authenticated
  using (lower(auth.jwt() ->> 'email') in ('cieslak.96@proton.me', 'christopher.ry.lewis@gmail.com'));

drop policy if exists "Signed-in users can create shared lists" on public.shared_state;
drop policy if exists "Allowlisted phones can create shared lists" on public.shared_state;
drop policy if exists "Allowlisted emails can create shared lists" on public.shared_state;
create policy "Allowlisted emails can create shared lists"
  on public.shared_state for insert to authenticated
  with check (lower(auth.jwt() ->> 'email') in ('cieslak.96@proton.me', 'christopher.ry.lewis@gmail.com'));

drop policy if exists "Signed-in users can update shared lists" on public.shared_state;
drop policy if exists "Allowlisted phones can update shared lists" on public.shared_state;
drop policy if exists "Allowlisted emails can update shared lists" on public.shared_state;
create policy "Allowlisted emails can update shared lists"
  on public.shared_state for update to authenticated
  using (lower(auth.jwt() ->> 'email') in ('cieslak.96@proton.me', 'christopher.ry.lewis@gmail.com'))
  with check (lower(auth.jwt() ->> 'email') in ('cieslak.96@proton.me', 'christopher.ry.lewis@gmail.com'));

grant select, insert, update on public.shared_state to authenticated;
