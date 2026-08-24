-- The internal analysis worker connects with the server-only service role.
-- These grants do not change RLS or browser-facing CMS access.
grant select on public.prospects to service_role;
grant select, insert, update, delete on public.prospect_analyses to service_role;
grant select, insert, update, delete on public.prospect_evidence to service_role;
grant insert on public.prospect_activity to service_role;
