alter table public.ads_cases
  drop constraint ads_cases_published_ready_check;

alter table public.ads_cases
  rename column cover_path to logo_path;
alter table public.ads_cases
  rename column cover_alt to logo_alt;

alter table public.ads_cases
  rename constraint ads_cases_cover_pair_check to ads_cases_logo_pair_check;
alter table public.ads_cases
  rename constraint ads_cases_cover_path_check to ads_cases_logo_path_check;
alter table public.ads_cases
  rename constraint ads_cases_cover_alt_check to ads_cases_logo_alt_check;

alter table public.ads_cases
  add column featured_metric_secondary_label text,
  add column featured_metric_secondary_value text,
  add column featured_metric_period text;

alter table public.ads_cases
  add constraint ads_cases_published_ready_check
    check (status <> 'published' or featured_order is not null),
  add constraint ads_cases_secondary_metric_pair_check
    check (
      (featured_metric_secondary_label is null and featured_metric_secondary_value is null)
      or (
        featured_metric_secondary_label is not null
        and featured_metric_secondary_value is not null
        and char_length(btrim(featured_metric_secondary_label)) between 4 and 120
        and char_length(btrim(featured_metric_secondary_value)) between 1 and 40
      )
    ),
  add constraint ads_cases_metric_period_length_check
    check (featured_metric_period is null or char_length(btrim(featured_metric_period)) between 6 and 120);

update public.ads_cases
set
  featured_metric_label = 'Conversiones registradas',
  featured_metric_value = '34.795',
  featured_metric_secondary_label = 'Costo por conversión',
  featured_metric_secondary_value = '$15,29 MXN',
  featured_metric_period = 'Junio 2025 – octubre 2026 (parcial)'
where slug = 'mejoravit'
  and status = 'draft';
