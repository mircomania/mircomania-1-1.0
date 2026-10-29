create table public.ads_cases (
    id uuid not null default gen_random_uuid(),
    slug text not null,
    title text not null,
    summary text not null,
    category text not null,
    cover_path text,
    cover_alt text,
    featured_order smallint,
    status text not null default 'draft',
    featured_metric_label text,
    featured_metric_value text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint ads_cases_pkey primary key (id),
    constraint ads_cases_slug_key unique (slug),
    constraint ads_cases_slug_format_check check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
    constraint ads_cases_title_length_check check (char_length(btrim(title)) between 2 and 120),
    constraint ads_cases_summary_length_check check (char_length(btrim(summary)) between 10 and 500),
    constraint ads_cases_category_length_check check (char_length(btrim(category)) between 2 and 60),
    constraint ads_cases_featured_order_check check (featured_order is null or featured_order > 0),
    constraint ads_cases_status_check check (status in ('draft', 'published')),
    constraint ads_cases_cover_pair_check check (
        (cover_path is null and cover_alt is null)
        or (cover_path is not null and cover_alt is not null)
    ),
    constraint ads_cases_cover_path_check check (
        cover_path is null or (
            char_length(btrim(cover_path)) between 5 and 500
            and cover_path = btrim(cover_path)
            and left(cover_path, 1) <> '/'
            and cover_path not like '%..%'
            and lower(cover_path) ~ '\.(webp|avif|jpe?g)$'
        )
    ),
    constraint ads_cases_cover_alt_check check (
        cover_alt is null or char_length(btrim(cover_alt)) between 8 and 250
    ),
    constraint ads_cases_metric_pair_check check (
        (featured_metric_label is null and featured_metric_value is null)
        or (
            featured_metric_label is not null and featured_metric_value is not null
            and char_length(btrim(featured_metric_label)) between 4 and 120
            and char_length(btrim(featured_metric_value)) between 1 and 40
        )
    ),
    constraint ads_cases_published_ready_check check (
        status <> 'published' or
        (featured_order is not null and cover_path is not null and cover_alt is not null)
    )
);

alter table public.ads_cases enable row level security;

revoke all on table public.ads_cases from public, anon, authenticated, service_role;
grant select on table public.ads_cases to anon, authenticated;

create policy "Public can read published ads cases"
    on public.ads_cases
    for select
    to anon, authenticated
    using (status = 'published');

create unique index ads_cases_published_order_unique
    on public.ads_cases (featured_order)
    where status = 'published';

create trigger ads_cases_set_updated_at
    before update on public.ads_cases
    for each row
    execute function public.set_updated_at();

insert into public.ads_cases (
    slug, title, summary, category, featured_order, status
) values (
    'mejoravit',
    'Mejoravit',
    'Evolución de una estrategia de captación mediante Google Ads, desde campañas de búsqueda hasta una operación con segmentación territorial y Performance Max.',
    'Google Ads',
    1,
    'draft'
);
