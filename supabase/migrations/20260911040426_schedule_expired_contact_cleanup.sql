begin;

set local role postgres;

-- Fail explicitly rather than schedule the job outside UTC/GMT.
do $$
begin
    if coalesce(current_setting('cron.timezone', true), 'GMT')
        not in ('GMT', 'UTC', 'Etc/UTC', 'Etc/GMT') then
        raise exception 'Data retention jobs require cron.timezone to be UTC or GMT';
    end if;
end;
$$;

-- Delete contacts whose last_interaction_at is more than 24 months old.
-- New interactions can be recorded manually with private.touch_contact_interaction(uuid).
-- Run daily at 03:30 UTC; expired contacts may intentionally remain until the next cycle.
-- The named schedule updates the existing job for this same role on replay.
select cron.schedule(
    'delete-expired-contacts',
    '30 3 * * *',
    'select private.delete_expired_contacts();'
);

commit;
