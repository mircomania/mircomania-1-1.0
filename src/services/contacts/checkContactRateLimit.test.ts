import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { rpcMock } = vi.hoisted(() => ({
    rpcMock: vi.fn(),
}));

vi.mock('@/lib/supabase/admin', () => ({
    supabaseAdmin: {
        rpc: rpcMock,
    },
}));

import { checkContactRateLimit } from './checkContactRateLimit';

const VALID_IDENTIFIER_HASH = 'a'.repeat(64);

beforeEach(() => {
    rpcMock.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe('checkContactRateLimit', () => {
    it.each([
        ['menos de 64 caracteres', 'a'.repeat(63)],
        ['más de 64 caracteres', 'a'.repeat(65)],
        ['letras fuera de a-f', 'g'.repeat(64)],
        ['hexadecimal en mayúsculas', 'A'.repeat(64)],
    ])('rechaza localmente un hash con %s', async (_case, identifierHash) => {
        const result = await checkContactRateLimit(identifierHash);

        expect(result).toEqual({
            status: 'error',
        });
        expect(rpcMock).not.toHaveBeenCalled();
    });

    it('normaliza una respuesta permitida devuelta como array', async () => {
        rpcMock.mockResolvedValue({
            data: [
                {
                    allowed: true,
                    remaining: 4,
                    retry_after_seconds: 0,
                },
            ],
            error: null,
        });

        const result = await checkContactRateLimit(VALID_IDENTIFIER_HASH);

        expect(result).toEqual({
            status: 'allowed',
            remaining: 4,
        });
        expect(rpcMock).toHaveBeenCalledWith('check_contact_rate_limit', {
            p_identifier_hash: VALID_IDENTIFIER_HASH,
        });
    });

    it('normaliza una respuesta bloqueada devuelta como fila directa', async () => {
        rpcMock.mockResolvedValue({
            data: {
                allowed: false,
                remaining: 0,
                retry_after_seconds: 275,
            },
            error: null,
        });

        const result = await checkContactRateLimit(VALID_IDENTIFIER_HASH);

        expect(result).toEqual({
            status: 'blocked',
            remaining: 0,
            retryAfterSeconds: 275,
        });
    });

    it('devuelve error cuando Supabase informa un fallo de la RPC', async () => {
        rpcMock.mockResolvedValue({
            data: null,
            error: {
                code: 'TEST_ERROR',
                message: 'RPC failed',
                details: null,
                hint: null,
            },
        });

        const result = await checkContactRateLimit(VALID_IDENTIFIER_HASH);

        expect(result).toEqual({
            status: 'error',
        });
    });

    it.each([
        ['data null', null],
        ['array vacío', []],
        ['fila que no es un objeto', 'invalid-row'],
        [
            'allowed que no es boolean',
            {
                allowed: 'true',
                remaining: 4,
                retry_after_seconds: 0,
            },
        ],
        [
            'remaining negativo',
            {
                allowed: true,
                remaining: -1,
                retry_after_seconds: 0,
            },
        ],
        [
            'remaining decimal',
            {
                allowed: true,
                remaining: 1.5,
                retry_after_seconds: 0,
            },
        ],
        [
            'respuesta bloqueada sin retry_after_seconds',
            {
                allowed: false,
                remaining: 0,
            },
        ],
        [
            'respuesta bloqueada con retry_after_seconds igual a cero',
            {
                allowed: false,
                remaining: 0,
                retry_after_seconds: 0,
            },
        ],
        [
            'respuesta bloqueada con retry_after_seconds decimal',
            {
                allowed: false,
                remaining: 0,
                retry_after_seconds: 1.5,
            },
        ],
    ])('rechaza una respuesta RPC malformada: %s', async (_case, data) => {
        rpcMock.mockResolvedValue({
            data,
            error: null,
        });

        const result = await checkContactRateLimit(VALID_IDENTIFIER_HASH);

        expect(result).toEqual({
            status: 'error',
        });
    });
});
