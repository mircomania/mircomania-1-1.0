begin;

set local role postgres;

create or replace function private.touch_contact_interaction(
    p_contact_id uuid
)
returns timestamptz
language plpgsql
security invoker
set search_path = ''
set timezone = 'UTC'
as $$
declare
    v_last_interaction_at timestamptz;
begin
    -- The existing trigger also updates updated_at; this is intentional.
    update public.contact_messages
    set last_interaction_at = now()
    where id = p_contact_id
    returning last_interaction_at
    into v_last_interaction_at;

    if not found then
        raise exception 'Contact message not found';
    end if;

    return v_last_interaction_at;
end;
$$;

alter function private.touch_contact_interaction(uuid)
    owner to postgres;

revoke all on function private.touch_contact_interaction(uuid)
    from public, anon, authenticated, service_role;

grant execute on function private.touch_contact_interaction(uuid)
    to postgres;

commit;
