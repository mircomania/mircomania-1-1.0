import { afterEach, describe, expect, it, vi } from 'vitest';

import { getClientIdentity } from './getClientIdentity';

const REQUEST_URL = 'http://localhost/api/contact';
const PASSENGER_HEADER = '!~Passenger-Client-Address';

function createRequest(headers?: HeadersInit): Request {
    return new Request(REQUEST_URL, { headers });
}

afterEach(() => {
    vi.unstubAllEnvs();
});

describe('getClientIdentity', () => {
    it.each([
        ['IPv4', '  203.0.113.10  ', '203.0.113.10'],
        ['IPv6', '  2001:db8::1  ', '2001:db8::1'],
    ])('acepta una dirección %s válida del header Passenger', (_version, headerValue, identity) => {
        vi.stubEnv('NODE_ENV', 'test');
        const request = createRequest({
            [PASSENGER_HEADER]: headerValue,
        });

        const result = getClientIdentity(request);

        expect(result).toEqual({
            success: true,
            identity,
        });
    });

    it('da prioridad al header Passenger válido en producción', () => {
        vi.stubEnv('NODE_ENV', 'production');
        const request = createRequest({
            [PASSENGER_HEADER]: '203.0.113.10',
            'x-forwarded-for': '198.51.100.20',
            'x-real-ip': '192.0.2.30',
        });

        const result = getClientIdentity(request);

        expect(result).toEqual({
            success: true,
            identity: '203.0.113.10',
        });
    });

    const invalidPassengerCases: [string, HeadersInit][] = [
        [
            'ausente aunque existan headers no confiables válidos',
            {
                'x-forwarded-for': '198.51.100.20',
                'x-real-ip': '192.0.2.30',
            },
        ],
        ['vacío', { [PASSENGER_HEADER]: '' }],
        ['con una IP inválida', { [PASSENGER_HEADER]: 'not-an-ip' }],
    ];

    it.each(invalidPassengerCases)('falla en producción con Passenger %s', (_case, headers) => {
        vi.stubEnv('NODE_ENV', 'production');
        const request = createRequest(headers);

        const result = getClientIdentity(request);

        expect(result).toEqual({
            success: false,
        });
    });

    it('usa la primera IP de x-forwarded-for fuera de producción', () => {
        vi.stubEnv('NODE_ENV', 'test');
        const request = createRequest({
            'x-forwarded-for': '  203.0.113.10, 198.51.100.20  ',
        });

        const result = getClientIdentity(request);

        expect(result).toEqual({
            success: true,
            identity: '203.0.113.10',
        });
    });

    it('usa x-real-ip fuera de producción cuando x-forwarded-for no es válido', () => {
        vi.stubEnv('NODE_ENV', 'test');
        const request = createRequest({
            'x-forwarded-for': 'not-an-ip, 203.0.113.10',
            'x-real-ip': '  198.51.100.20  ',
        });

        const result = getClientIdentity(request);

        expect(result).toEqual({
            success: true,
            identity: '198.51.100.20',
        });
    });

    it('usa la identidad local fuera de producción cuando no hay una IP válida', () => {
        vi.stubEnv('NODE_ENV', 'test');
        const request = createRequest({
            'x-forwarded-for': 'not-an-ip',
            'x-real-ip': 'also-not-an-ip',
        });

        const result = getClientIdentity(request);

        expect(result).toEqual({
            success: true,
            identity: '127.0.0.1',
        });
    });
});
