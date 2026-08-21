import 'server-only';

import { supabaseAdmin } from '@/lib/supabase/admin';

export type ContactRateLimitResult =
    | { status: 'allowed'; remaining: number }
    | { status: 'blocked'; remaining: number; retryAfterSeconds: number }
    | { status: 'error' };

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonNegativeInteger(value: unknown): value is number {
    return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}

export async function checkContactRateLimit(identifierHash: string): Promise<ContactRateLimitResult> {
    if (!/^[0-9a-f]{64}$/.test(identifierHash)) {
        return {
            status: 'error',
        };
    }

    const { data, error } = await supabaseAdmin.rpc('check_contact_rate_limit', {
        p_identifier_hash: identifierHash,
    });

    if (error) {
        console.error('Error comprobando el rate limit de contacto:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
        });

        return {
            status: 'error',
        };
    }

    const row = Array.isArray(data) ? data[0] : data;

    if (!isRecord(row) || typeof row.allowed !== 'boolean' || !isNonNegativeInteger(row.remaining)) {
        console.error('Respuesta no válida al comprobar el rate limit de contacto.');

        return {
            status: 'error',
        };
    }

    if (row.allowed) {
        return {
            status: 'allowed',
            remaining: row.remaining,
        };
    }

    if (!isNonNegativeInteger(row.retry_after_seconds) || row.retry_after_seconds < 1) {
        console.error('Respuesta no válida al comprobar el rate limit de contacto.');

        return {
            status: 'error',
        };
    }

    return {
        status: 'blocked',
        remaining: row.remaining,
        retryAfterSeconds: row.retry_after_seconds,
    };
}
