begin;

-- Keep ownership and the Cron execution role consistent across local replays.
set local role postgres;

-- Supabase provides pg_cron; the server must preload it in shared_preload_libraries.
-- This migration must run in the database configured by cron.database_name.
create extension if not exists pg_cron;

-- Do not silently schedule the UTC rate limit job in a different server Cron timezone.
do $$
begin
    if coalesce(current_setting('cron.timezone', true), 'GMT') not in ('GMT', 'UTC', 'Etc/UTC', 'Etc/GMT') then
        raise exception 'Data retention jobs require cron.timezone to be UTC or GMT';
    end if;
end;
$$;

-- Add without a default first so existing contacts retain their original start date.
alter table public.contact_messages
    add column if not exists last_interaction_at timestamptz;

-- Preserve updated_at during this backfill. The ALTER TABLE lock and transaction
-- prevent concurrent writes while this specific trigger is temporarily disabled.
alter table public.contact_messages
    disable trigger contact_messages_set_updated_at;

update public.contact_messages
set last_interaction_at = created_at
where last_interaction_at is null;

alter table public.contact_messages
    enable trigger contact_messages_set_updated_at;

alter table public.contact_messages
    alter column last_interaction_at set default now(),
    alter column last_interaction_at set not null;

create index if not exists contact_messages_last_interaction_idx
    on public.contact_messages using btree (last_interaction_at);

create index if not exists contact_rate_limits_updated_at_idx
    on private.contact_rate_limits using btree (updated_at);

-- Prepared but not scheduled: a future migration will add the contacts job only
-- when a reliable mechanism maintains last_interaction_at for subsequent interactions.
-- Before scheduling, reconcile historical interactions and legal retention exceptions.
-- No email/CRM integration or legal-hold mechanism exists here.
create or replace function private.delete_expired_contacts()
returns bigint
language plpgsql
security invoker
set search_path = ''
set timezone = 'UTC'
as $$
declare
    v_deleted bigint;
begin
    delete from public.contact_messages
    where last_interaction_at < now() - interval '24 months';

    get diagnostics v_deleted = row_count;
    return v_deleted;
end;
$$;

create or replace function private.delete_stale_contact_rate_limits()
returns bigint
language plpgsql
security invoker
set search_path = ''
set timezone = 'UTC'
as $$
declare
    v_deleted bigint;
begin
    delete from private.contact_rate_limits
    where updated_at < now() - interval '24 hours';

    get diagnostics v_deleted = row_count;
    return v_deleted;
end;
$$;

alter function private.delete_expired_contacts() owner to postgres;
alter function private.delete_stale_contact_rate_limits() owner to postgres;

revoke all on function private.delete_expired_contacts()
    from public, anon, authenticated, service_role;
revoke all on function private.delete_stale_contact_rate_limits()
    from public, anon, authenticated, service_role;

grant execute on function private.delete_expired_contacts() to postgres;
grant execute on function private.delete_stale_contact_rate_limits() to postgres;

-- The only job created by this migration is delete-stale-contact-rate-limits.
-- Its named schedule updates the existing job for this same role on replay.
-- Applying this migration activates this job without running the cleanup immediately.
select cron.schedule(
    'delete-stale-contact-rate-limits',
    '15 3 * * *',
    'select private.delete_stale_contact_rate_limits();'
);

-- Daily execution can leave stale rate limit rows until the next successful run.
-- Cleanup of Make/email copies and Cron execution history is outside this migration.
commit;
