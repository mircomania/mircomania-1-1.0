import { afterEach, describe, expect, it, vi } from 'vitest';

import { hashRateLimitIdentifier } from './hashRateLimitIdentifier';

afterEach(() => {
    vi.unstubAllEnvs();
});

describe('hashRateLimitIdentifier', () => {
    it.each([
        ['ausente', undefined],
        ['vacío', ''],
        ['compuesto solo por espacios', '   '],
    ])('falla cuando RATE_LIMIT_SECRET está %s', (_case, secret) => {
        vi.stubEnv('RATE_LIMIT_SECRET', secret);

        const result = hashRateLimitIdentifier('203.0.113.42');

        expect(result).toEqual({
            success: false,
        });
    });

    it('coincide con un vector conocido de HMAC-SHA256 hexadecimal', () => {
        vi.stubEnv('RATE_LIMIT_SECRET', 'test-rate-limit-secret');

        const result = hashRateLimitIdentifier('203.0.113.42');

        expect(result).toEqual({
            success: true,
            identifierHash: '983b944d8a7bc49f72f41e9f1a7b140da1a73132c4e1c729d2dbf29cca3fd6b2',
        });
    });

    it('es determinista y devuelve 64 caracteres hexadecimales en minúsculas', () => {
        vi.stubEnv('RATE_LIMIT_SECRET', 'test-rate-limit-secret');

        const firstResult = hashRateLimitIdentifier('203.0.113.42');
        const secondResult = hashRateLimitIdentifier('203.0.113.42');

        expect(firstResult).toEqual(secondResult);
        expect(firstResult.success).toBe(true);

        if (firstResult.success) {
            expect(firstResult.identifierHash).toMatch(/^[0-9a-f]{64}$/);
        }
    });

    it('cambia el hash cuando cambia la identidad', () => {
        vi.stubEnv('RATE_LIMIT_SECRET', 'test-rate-limit-secret');

        const firstResult = hashRateLimitIdentifier('203.0.113.42');
        const secondResult = hashRateLimitIdentifier('198.51.100.20');

        expect(firstResult.success).toBe(true);
        expect(secondResult.success).toBe(true);

        if (firstResult.success && secondResult.success) {
            expect(firstResult.identifierHash).not.toBe(secondResult.identifierHash);
        }
    });

    it('cambia el hash cuando cambia el secreto', () => {
        const identifier = '203.0.113.42';
        vi.stubEnv('RATE_LIMIT_SECRET', 'first-rate-limit-secret');
        const firstResult = hashRateLimitIdentifier(identifier);

        vi.stubEnv('RATE_LIMIT_SECRET', 'second-rate-limit-secret');
        const secondResult = hashRateLimitIdentifier(identifier);

        expect(firstResult.success).toBe(true);
        expect(secondResult.success).toBe(true);

        if (firstResult.success && secondResult.success) {
            expect(firstResult.identifierHash).not.toBe(secondResult.identifierHash);
        }
    });
});
