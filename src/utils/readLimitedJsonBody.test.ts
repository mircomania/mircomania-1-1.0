import { describe, expect, it } from 'vitest';

import { readLimitedJsonBody } from './readLimitedJsonBody';

const REQUEST_URL = 'http://localhost/api/contact';

type StreamingRequestInit = RequestInit & {
    duplex: 'half';
};

function createStreamingRequest(stream: ReadableStream<Uint8Array>): Request {
    const init: StreamingRequestInit = {
        method: 'POST',
        body: stream,
        duplex: 'half',
    };

    return new Request(REQUEST_URL, init);
}

function createRequestFromChunks(chunks: Uint8Array[]): Request {
    const stream = new ReadableStream<Uint8Array>({
        start(controller) {
            for (const chunk of chunks) {
                controller.enqueue(chunk);
            }

            controller.close();
        },
    });

    return createStreamingRequest(stream);
}

describe('readLimitedJsonBody', () => {
    it('lee JSON válido desde un Request real', async () => {
        const data = {
            name: 'Mirco',
            contactType: 'project',
        };
        const body = JSON.stringify(data);
        const request = new Request(REQUEST_URL, {
            method: 'POST',
            body,
        });

        const result = await readLimitedJsonBody(request, 1024);

        expect(result).toEqual({
            success: true,
            data,
        });
    });

    it('acumula varios chunks y reconstruye caracteres multibyte divididos entre ellos', async () => {
        const encoder = new TextEncoder();
        const data = {
            name: 'Rodríguez',
            message: 'Proyecto 🚀',
        };
        const body = JSON.stringify(data);
        const bodyBytes = encoder.encode(body);
        const emojiOffset = encoder.encode(body.slice(0, body.indexOf('🚀'))).byteLength;
        const request = createRequestFromChunks([
            bodyBytes.slice(0, emojiOffset + 1),
            bodyBytes.slice(emojiOffset + 1, emojiOffset + 3),
            bodyBytes.slice(emojiOffset + 3),
        ]);

        const result = await readLimitedJsonBody(request, bodyBytes.byteLength);

        expect(result).toEqual({
            success: true,
            data,
        });
    });

    it('acepta un JSON cuyo tamaño en bytes coincide exactamente con el límite', async () => {
        const data = { message: 'España 🚀' };
        const body = JSON.stringify(data);
        const bodyBytes = new TextEncoder().encode(body);
        const request = new Request(REQUEST_URL, {
            method: 'POST',
            body,
        });

        const result = await readLimitedJsonBody(request, bodyBytes.byteLength);

        expect(result).toEqual({
            success: true,
            data,
        });
    });

    it('rechaza un JSON cuando supera el límite por un byte', async () => {
        const body = JSON.stringify({ message: 'España 🚀' });
        const bodyBytes = new TextEncoder().encode(body);
        const request = new Request(REQUEST_URL, {
            method: 'POST',
            body,
        });

        const result = await readLimitedJsonBody(request, bodyBytes.byteLength - 1);

        expect(result).toEqual({
            success: false,
            error: 'body_too_large',
        });
    });

    it('clasifica como invalid_json el texto UTF-8 no vacío con JSON mal formado', async () => {
        const request = new Request(REQUEST_URL, {
            method: 'POST',
            body: '{"name":"Mirco"',
        });

        const result = await readLimitedJsonBody(request, 1024);

        expect(result).toEqual({
            success: false,
            error: 'invalid_json',
        });
    });

    it.each([
        ['sin body', () => new Request(REQUEST_URL, { method: 'POST' })],
        [
            'con body de cero bytes',
            () =>
                new Request(REQUEST_URL, {
                    method: 'POST',
                    body: new Uint8Array(),
                }),
        ],
        [
            'con body compuesto solo por espacios',
            () =>
                new Request(REQUEST_URL, {
                    method: 'POST',
                    body: '   ',
                }),
        ],
    ])('clasifica como invalid_body un Request %s', async (_case, createRequest) => {
        const result = await readLimitedJsonBody(createRequest(), 1024);

        expect(result).toEqual({
            success: false,
            error: 'invalid_body',
        });
    });

    it('clasifica como invalid_body una secuencia UTF-8 inválida', async () => {
        const request = createRequestFromChunks([new Uint8Array([0xc3, 0x28])]);

        const result = await readLimitedJsonBody(request, 1024);

        expect(result).toEqual({
            success: false,
            error: 'invalid_body',
        });
    });

    it('clasifica como invalid_body un error durante la lectura del stream', async () => {
        const encoder = new TextEncoder();
        let chunkDelivered = false;
        const stream = new ReadableStream<Uint8Array>({
            pull(controller) {
                if (!chunkDelivered) {
                    controller.enqueue(encoder.encode('{"name":'));
                    chunkDelivered = true;
                    return;
                }

                controller.error(new Error('stream read failed'));
            },
        });
        const request = createStreamingRequest(stream);

        const result = await readLimitedJsonBody(request, 1024);

        expect(result).toEqual({
            success: false,
            error: 'invalid_body',
        });
    });
});
