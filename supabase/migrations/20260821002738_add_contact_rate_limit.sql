create schema if not exists private;

revoke all on schema private from public;
revoke all on schema private from anon;
revoke all on schema private from authenticated;

create table private.contact_rate_limits (
    identifier_hash text primary key,
    window_started_at timestamptz not null default now(),
    request_count integer not null default 1,
    updated_at timestamptz not null default now(),

    constraint contact_rate_limits_identifier_hash_check
        check (identifier_hash ~ '^[0-9a-f]{64}$'),

    constraint contact_rate_limits_request_count_check
        check (request_count > 0)
);

revoke all on table private.contact_rate_limits from public;
revoke all on table private.contact_rate_limits from anon;
revoke all on table private.contact_rate_limits from authenticated;
revoke all on table private.contact_rate_limits from service_role;

create or replace function public.check_contact_rate_limit(
    p_identifier_hash text
)
returns table (
    allowed boolean,
    remaining integer,
    retry_after_seconds integer
)
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_now timestamptz := clock_timestamp();
    v_window constant interval := interval '10 minutes';
    v_limit constant integer := 5;
    v_row private.contact_rate_limits%rowtype;
begin
    if p_identifier_hash is null
        or p_identifier_hash !~ '^[0-9a-f]{64}$' then
        raise exception 'Invalid rate limit identifier';
    end if;

    insert into private.contact_rate_limits (
        identifier_hash,
        window_started_at,
        request_count,
        updated_at
    )
    values (
        p_identifier_hash,
        v_now,
        1,
        v_now
    )
    on conflict (identifier_hash)
    do update
    set
        window_started_at = case
            when private.contact_rate_limits.window_started_at <= v_now - v_window
                then v_now
            else private.contact_rate_limits.window_started_at
        end,

        request_count = case
            when private.contact_rate_limits.window_started_at <= v_now - v_window
                then 1
            else private.contact_rate_limits.request_count + 1
        end,

        updated_at = v_now
    returning *
    into v_row;

    allowed := v_row.request_count <= v_limit;

    remaining := greatest(
        v_limit - v_row.request_count,
        0
    );

    retry_after_seconds := case
        when allowed then 0
        else greatest(
            ceil(
                extract(
                    epoch from (
                        (v_row.window_started_at + v_window) - v_now
                    )
                )
            )::integer,
            1
        )
    end;

    return next;
end;
$$;

revoke all
on function public.check_contact_rate_limit(text)
from public;

revoke execute
on function public.check_contact_rate_limit(text)
from anon, authenticated;

grant execute
on function public.check_contact_rate_limit(text)
to service_role;