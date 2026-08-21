-- Fresh local Supabase projects default to revoking API table privileges.
-- Grants enable the API roles; existing RLS policies continue to control access.

grant select, insert, update, delete on public.profiles to authenticated;

grant select on public.case_studies, public.case_study_media, public.blog_posts, public.client_logos to anon;
grant select, insert, update, delete on public.case_studies, public.case_study_media, public.blog_posts, public.client_logos to authenticated;

grant select, insert, update, delete on public.contact_enquiries, public.digital_scans to authenticated;
