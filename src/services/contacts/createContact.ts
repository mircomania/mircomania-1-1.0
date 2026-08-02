import 'server-only';

import { supabaseAdmin } from '@/lib/supabase/admin';

import type { CreateContactInput, CreateContactResult } from '@/types/contact';

export async function createContact(input: CreateContactInput): Promise<CreateContactResult> {
    const { error } = await supabaseAdmin.from('contact_messages').insert({
        name: input.name,
        email: input.email,
        contact_type: input.contactType,
        message: input.message,
        status: 'new',
        source: 'website',
        privacy_accepted_at: new Date().toISOString(),
    });

    if (error) {
        console.error('Error creando mensaje de contacto:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
        });

        return {
            success: false,
            error: 'database_error',
        };
    }

    return {
        success: true,
    };
}
