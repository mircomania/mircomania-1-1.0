alter table public.projects
    drop constraint projects_project_type_check;

alter table public.projects
    add constraint projects_project_type_check
    check (
        project_type = any (
            array[
                'corporate'::text,
                'full_stack'::text,
                'saas'::text,
                'automation'::text,
                'ecommerce'::text,
                'mobile_app'::text,
                'digital_ads'::text
            ]
        )
    );
