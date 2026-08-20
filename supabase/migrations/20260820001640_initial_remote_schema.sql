set local check_function_bodies = off;

alter default privileges for role "postgres" in schema "public" revoke all on sequences from "anon";

alter default privileges for role "postgres" in schema "public" revoke all on sequences from "authenticated";

alter default privileges for role "postgres" in schema "public" revoke all on sequences from "service_role";

create table "public"."contact_messages" (
  "id"                  uuid                     not null default gen_random_uuid(),
  "name"                text                     not null,
  "email"               text                     not null,
  "contact_type"        text                     not null,
  "message"             text                     not null,
  "status"              text                     not null default 'new'::text,
  "source"              text                     not null default 'website'::text,
  "privacy_accepted_at" timestamp with time zone not null,
  "created_at"          timestamp with time zone not null default now(),
  "updated_at"          timestamp with time zone not null default now(),
  "utm_source"          text,
  "utm_medium"          text,
  "utm_campaign"        text,
  "path"                text,
  constraint "contact_messages_contact_type_check" check ((contact_type = ANY (ARRAY['project'::text, 'job'::text, 'collaboration'::text, 'general'::text]))),
  constraint "contact_messages_email_format_check" check ((email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'::text)),
  constraint "contact_messages_email_length_check" check (((char_length(TRIM(BOTH FROM email)) >= 5) AND (char_length(TRIM(BOTH FROM email)) <= 254))),
  constraint "contact_messages_message_length_check" check (((char_length(TRIM(BOTH FROM message)) >= 10) AND (char_length(TRIM(BOTH FROM message)) <= 3000))),
  constraint "contact_messages_name_length_check" check (((char_length(TRIM(BOTH FROM name)) >= 2) AND (char_length(TRIM(BOTH FROM name)) <= 100))),
  constraint "contact_messages_pkey" primary key (id),
  constraint "contact_messages_status_check" check ((status = ANY (ARRAY['new'::text, 'read'::text, 'replied'::text, 'closed'::text, 'spam'::text]))),
  constraint "contact_messages_utm_campaign_length_check" check (((utm_campaign IS NULL) OR (char_length(utm_campaign) <= 200))),
  constraint "contact_messages_utm_medium_length_check" check (((utm_medium IS NULL) OR (char_length(utm_medium) <= 150))),
  constraint "contact_messages_utm_source_length_check" check (((utm_source IS NULL) OR (char_length(utm_source) <= 150)))
);

alter table "public"."contact_messages"
  enable row level security;

create table "public"."project_media" (
  "id"           uuid                     not null default gen_random_uuid(),
  "project_id"   uuid                     not null,
  "media_type"   text                     not null,
  "storage_path" text                     not null,
  "poster_path"  text,
  "alt_text"     text                     not null default ''::text,
  "caption"      text,
  "width"        integer,
  "height"       integer,
  "sort_order"   smallint                 not null default 0,
  "is_cover"     boolean                  not null default false,
  "created_at"   timestamp with time zone not null default now(),
  "updated_at"   timestamp with time zone not null default now(),
  constraint "project_media_dimensions_check" check ((((width IS NULL) OR (width > 0)) AND ((height IS NULL) OR (height > 0)))),
  constraint "project_media_image_alt_check" check (((media_type <> 'image'::text) OR (char_length(TRIM(BOTH FROM alt_text)) > 0))),
  constraint "project_media_pkey" primary key (id),
  constraint "project_media_project_order_unique" unique (project_id, sort_order),
  constraint "project_media_sort_order_check" check ((sort_order >= 0)),
  constraint "project_media_type_check" check ((media_type = ANY (ARRAY['image'::text, 'video'::text])))
);

alter table "public"."project_media"
  enable row level security;

create table "public"."projects" (
  "id"             uuid                     not null default gen_random_uuid(),
  "slug"           text                     not null,
  "title"          text                     not null,
  "summary"        text                     not null,
  "description"    text,
  "role"           text,
  "client"         text,
  "project_year"   smallint,
  "stack"          text[]                   not null default '{}'::text[],
  "featured"       boolean                  not null default false,
  "featured_order" smallint,
  "status"         text                     not null default 'draft'::text,
  "demo_url"       text,
  "repository_url" text,
  "created_at"     timestamp with time zone not null default now(),
  "updated_at"     timestamp with time zone not null default now(),
  "project_type"   text                     not null,
  constraint "projects_featured_order_check" check ((((featured = false) AND (featured_order IS NULL)) OR ((featured = true) AND (featured_order IS
    NOT NULL) AND (featured_order > 0)))),
  constraint "projects_pkey" primary key (id),
  constraint "projects_project_type_check"
    check ((project_type = ANY (ARRAY['corporate'::text, 'full_stack'::text, 'saas'::text, 'automation'::text, 'ecommerce'::text, 'mobile_app'::text]))),
  constraint "projects_slug_format_check" check ((slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'::text)),
  constraint "projects_slug_key" unique (slug),
  constraint "projects_status_check" check ((status = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text]))),
  constraint "projects_summary_length_check" check (((char_length(summary) >= 10) AND (char_length(summary) <= 500))),
  constraint "projects_title_length_check" check (((char_length(title) >= 2) AND (char_length(title) <= 120))),
  constraint "projects_year_check" check (((project_year IS NULL) OR ((project_year >= 2000) AND (project_year <= 2100))))
);

alter table "public"."projects"
  enable row level security;

create or replace function public.rls_auto_enable()
  returns event_trigger
  language plpgsql
  security definer
  set search_path to 'pg_catalog'
  AS $function$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$function$;

create or replace function public.set_updated_at()
  returns trigger
  language plpgsql
  set search_path to ''
  AS $function$
begin
    new.updated_at = now();
    return new;
end;
$function$;

alter table "public"."project_media"
  add constraint "project_media_project_id_fkey" foreign key (project_id) references public.projects(id) on delete cascade;

create index contact_messages_status_created_idx on public.contact_messages using btree (status, created_at desc);

create unique index project_media_one_cover_per_project on public.project_media using btree (project_id)
  where (is_cover = true);

create unique index projects_featured_order_unique on public.projects using btree (featured_order)
  where (featured = true);

create index projects_featured_published_idx on public.projects using btree (featured_order)
  where ((featured = true) AND (status = 'published'::text));

create index projects_status_idx on public.projects using btree (status);

create trigger contact_messages_set_updated_at
  before update on public.contact_messages
  for each row
  execute function public.set_updated_at();

create trigger project_media_set_updated_at
  before update on public.project_media
  for each row
  execute function public.set_updated_at();

create trigger projects_set_updated_at
  before update on public.projects
  for each row
  execute function public.set_updated_at();

create policy "Public can read media from published projects" on "public"."project_media"
  for select
  to "anon", "authenticated"
  using ((exists ( select 1
   from public.projects
  where ((projects.id = project_media.project_id) AND (projects.status = 'published'::text)))));

create policy "Public can read published projects" on "public"."projects"
  for select
  to "anon", "authenticated"
  using ((status = 'published'::text));

create event trigger "ensure_rls"
  on ddl_command_end
  when tag in ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
  execute function "public"."rls_auto_enable"();

revoke all on function "public"."rls_auto_enable"() from public;

grant execute on function "public"."rls_auto_enable"() to "postgres";

grant execute on function "public"."set_updated_at"() to public, "postgres";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."contact_messages" to "postgres", "service_role";

revoke all on table "public"."project_media" from "anon";

grant select on table "public"."project_media" to "anon";

revoke all on table "public"."project_media" from "authenticated";

grant select on table "public"."project_media" to "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."project_media" to "postgres";

grant maintain, references, trigger, truncate on table "public"."project_media" to "service_role";

revoke all on table "public"."projects" from "anon";

grant select on table "public"."projects" to "anon";

revoke all on table "public"."projects" from "authenticated";

grant select on table "public"."projects" to "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."projects" to "postgres";

grant maintain, references, trigger, truncate on table "public"."projects" to "service_role";

