import 'server-only';

export type LimitedJsonBodyResult =
    | { success: true; data: unknown }
    | { success: false; error: 'body_too_large' | 'invalid_json' | 'invalid_body' };

export async function readLimitedJsonBody(request: Request, maxBytes: number): Promise<LimitedJsonBodyResult> {
    if (!request.body) {
        return {
            success: false,
            error: 'invalid_body',
        };
    }

    let reader: ReadableStreamDefaultReader<Uint8Array>;

    try {
        reader = request.body.getReader();
    } catch {
        return {
            success: false,
            error: 'invalid_body',
        };
    }

    const chunks: Uint8Array[] = [];
    let totalBytes = 0;

    try {
        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                break;
            }

            totalBytes += value.byteLength;

            if (totalBytes > maxBytes) {
                await reader.cancel().catch(() => undefined);

                return {
                    success: false,
                    error: 'body_too_large',
                };
            }

            chunks.push(value);
        }
    } catch {
        return {
            success: false,
            error: 'invalid_body',
        };
    } finally {
        reader.releaseLock();
    }

    if (totalBytes === 0) {
        return {
            success: false,
            error: 'invalid_body',
        };
    }

    const bodyBytes = new Uint8Array(totalBytes);
    let offset = 0;

    for (const chunk of chunks) {
        bodyBytes.set(chunk, offset);
        offset += chunk.byteLength;
    }

    let bodyText: string;

    try {
        bodyText = new TextDecoder('utf-8', { fatal: true }).decode(bodyBytes);
    } catch {
        return {
            success: false,
            error: 'invalid_body',
        };
    }

    if (bodyText.trim().length === 0) {
        return {
            success: false,
            error: 'invalid_body',
        };
    }

    try {
        return {
            success: true,
            data: JSON.parse(bodyText) as unknown,
        };
    } catch {
        return {
            success: false,
            error: 'invalid_json',
        };
    }
}
