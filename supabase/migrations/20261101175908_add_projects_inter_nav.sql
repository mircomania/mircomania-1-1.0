alter table public.projects
  add column inter_nav text;

alter table public.projects
  add constraint projects_inter_nav_internal_path_check
  check (
    inter_nav is null
    or (
      char_length(inter_nav) between 2 and 200
      and inter_nav ~ '^/(?:[a-z0-9]+(?:-[a-z0-9]+)*(?:/[a-z0-9]+(?:-[a-z0-9]+)*)*)$'
    )
  );
