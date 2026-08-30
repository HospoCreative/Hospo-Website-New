-- Keeps the existing marketing package distinct from the new recurring
-- Content Creation offer. Commercial values and deliverables are unchanged.

update public.packages
set
  name = 'Content & Social Partner',
  name_pt = 'Parceiro de Conteúdo e Redes Sociais'
where slug = 'content-partner';
