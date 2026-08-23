import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { checkContactRateLimitMock, createContactMock } = vi.hoisted(() => ({
    checkContactRateLimitMock: vi.fn(),
    createContactMock: vi.fn(),
}));

vi.mock('@/services/contacts/checkContactRateLimit', () => ({
    checkContactRateLimit: checkContactRateLimitMock,
}));

vi.mock('@/services/contacts/createContact', () => ({
    createContact: createContactMock,
}));

import { POST } from './route';

const REQUEST_URL = 'https://mircomania.cl/api/contact';

const VALID_PAYLOAD = {
    name: 'Mirco',
    email: 'mirco@example.com',
    contactType: 'project',
    message: 'Mensaje válido para contactar.',
    privacyAccepted: true,
    website: '',
    utmSource: '',
    utmMedium: '',
    utmCampaign: '',
};

type ResponseBody = {
    success: boolean;
    errors?: Record<string, string>;
};

function createJsonRequest(payload: unknown, headers: Record<string, string> = {}): Request {
    return new Request(REQUEST_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        body: JSON.stringify(payload),
    });
}

async function readResponseBody(response: Response): Promise<ResponseBody> {
    return (await response.json()) as ResponseBody;
}

beforeEach(() => {
    checkContactRateLimitMock.mockReset();
    createContactMock.mockReset();

    vi.stubEnv('NODE_ENV', 'test');
    vi.stubEnv('RATE_LIMIT_SECRET', 'route-test-secret');

    checkContactRateLimitMock.mockResolvedValue({
        status: 'allowed',
        remaining: 4,
    });
    createContactMock.mockResolvedValue({
        success: true,
    });
});

afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
});

describe('POST /api/contact', () => {
    it('devuelve 415 para un content type no admitido', async () => {
        const request = new Request(REQUEST_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: JSON.stringify(VALID_PAYLOAD),
        });

        const response = await POST(request);
        const body = await readResponseBody(response);

        expect(response.status).toBe(415);
        expect(body.success).toBe(false);
        expect(checkContactRateLimitMock).not.toHaveBeenCalled();
        expect(createContactMock).not.toHaveBeenCalled();
    });

    it('devuelve 413 antes de leer el body cuando Content-Length supera el límite', async () => {
        const request = createJsonRequest(VALID_PAYLOAD, {
            'Content-Length': '10001',
        });

        const response = await POST(request);
        const body = await readResponseBody(response);

        expect(response.status).toBe(413);
        expect(body.success).toBe(false);
        expect(checkContactRateLimitMock).not.toHaveBeenCalled();
        expect(createContactMock).not.toHaveBeenCalled();
    });

    it('devuelve 413 cuando el tamaño real del body supera el límite', async () => {
        const request = createJsonRequest({
            message: 'a'.repeat(10_001),
        });

        const response = await POST(request);
        const body = await readResponseBody(response);

        expect(response.status).toBe(413);
        expect(body.success).toBe(false);
        expect(checkContactRateLimitMock).toHaveBeenCalledOnce();
        expect(createContactMock).not.toHaveBeenCalled();
    });

    it('devuelve 503 en producción cuando no hay identidad Passenger válida', async () => {
        vi.stubEnv('NODE_ENV', 'production');
        const request = createJsonRequest(VALID_PAYLOAD);

        const response = await POST(request);
        const body = await readResponseBody(response);

        expect(response.status).toBe(503);
        expect(body.success).toBe(false);
        expect(checkContactRateLimitMock).not.toHaveBeenCalled();
        expect(createContactMock).not.toHaveBeenCalled();
    });

    it('devuelve 503 cuando falla la comprobación del rate limit', async () => {
        checkContactRateLimitMock.mockResolvedValue({
            status: 'error',
        });
        const request = createJsonRequest(VALID_PAYLOAD);

        const response = await POST(request);
        const body = await readResponseBody(response);

        expect(response.status).toBe(503);
        expect(body.success).toBe(false);
        expect(createContactMock).not.toHaveBeenCalled();
    });

    it('devuelve 429 y Retry-After cuando el rate limit bloquea la solicitud', async () => {
        checkContactRateLimitMock.mockResolvedValue({
            status: 'blocked',
            remaining: 0,
            retryAfterSeconds: 275,
        });
        const request = createJsonRequest(VALID_PAYLOAD);

        const response = await POST(request);
        const body = await readResponseBody(response);

        expect(response.status).toBe(429);
        expect(body.success).toBe(false);
        expect(response.headers.get('Retry-After')).toBe('275');
        expect(createContactMock).not.toHaveBeenCalled();
    });

    it('devuelve 400 para JSON malformado', async () => {
        const request = new Request(REQUEST_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: '{"name":"Mirco"',
        });

        const response = await POST(request);
        const body = await readResponseBody(response);

        expect(response.status).toBe(400);
        expect(body.success).toBe(false);
        expect(createContactMock).not.toHaveBeenCalled();
    });

    it.each([
        ['null', null],
        ['un array', []],
    ])('devuelve 400 para JSON válido que representa %s', async (_case, payload) => {
        const request = createJsonRequest(payload);

        const response = await POST(request);
        const body = await readResponseBody(response);

        expect(response.status).toBe(400);
        expect(body.success).toBe(false);
        expect(createContactMock).not.toHaveBeenCalled();
    });

    it('devuelve 200 para el honeypot sin persistir el contacto', async () => {
        const request = createJsonRequest({
            ...VALID_PAYLOAD,
            website: '  bot-content  ',
        });

        const response = await POST(request);
        const body = await readResponseBody(response);

        expect(response.status).toBe(200);
        expect(body.success).toBe(true);
        expect(createContactMock).not.toHaveBeenCalled();
    });

    it('devuelve 422 con errores para un payload de contacto inválido', async () => {
        const request = createJsonRequest({
            ...VALID_PAYLOAD,
            privacyAccepted: false,
        });

        const response = await POST(request);
        const body = await readResponseBody(response);

        expect(response.status).toBe(422);
        expect(body.success).toBe(false);
        expect(body.errors?.privacyAccepted).toBeDefined();
        expect(createContactMock).not.toHaveBeenCalled();
    });

    it('devuelve 500 cuando falla la persistencia del contacto', async () => {
        createContactMock.mockResolvedValue({
            success: false,
            error: 'database_error',
        });
        const request = createJsonRequest(VALID_PAYLOAD);

        const response = await POST(request);
        const body = await readResponseBody(response);

        expect(response.status).toBe(500);
        expect(body.success).toBe(false);
        expect(createContactMock).toHaveBeenCalledOnce();
    });

    it('devuelve 201 y persiste el payload normalizado con el path del referer', async () => {
        const request = createJsonRequest(
            {
                name: '  Mirco Rodríguez  ',
                email: '  MIRCO@EXAMPLE.COM  ',
                contactType: 'project',
                message: '  Mensaje válido para contactar.  ',
                privacyAccepted: true,
                website: '',
                utmSource: '  google  ',
                utmMedium: '  cpc  ',
                utmCampaign: '   ',
            },
            {
                host: 'mircomania.cl',
                referer: 'https://mircomania.cl/contacto/',
            },
        );

        const response = await POST(request);
        const body = await readResponseBody(response);

        expect(response.status).toBe(201);
        expect(body.success).toBe(true);
        expect(createContactMock).toHaveBeenCalledOnce();
        expect(createContactMock).toHaveBeenCalledWith({
            name: 'Mirco Rodríguez',
            email: 'mirco@example.com',
            contactType: 'project',
            message: 'Mensaje válido para contactar.',
            utmSource: 'google',
            utmMedium: 'cpc',
            utmCampaign: null,
            path: '/contacto',
        });
    });
});
