
alter table public.contact_messages
    drop constraint contact_messages_contact_type_check;

alter table public.contact_messages
    add constraint contact_messages_contact_type_check
    check (
        contact_type = any (
            array[
                'project'::text,
                'automation'::text,
                'advertising'::text,
                'analytics'::text,
                'job'::text,
                'collaboration'::text,
                'general'::text
            ]
        )
    );
