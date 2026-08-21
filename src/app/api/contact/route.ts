import { checkContactRateLimit } from '@/services/contacts/checkContactRateLimit';
import { createContact } from '@/services/contacts/createContact';

import type { ContactFormPayload } from '@/types/contact';

import { validateContactPayload } from '@/components/exports/form/validateContact';

import { getClientIdentity } from '@/utils/getClientIdentity';
import { getRequestPath } from '@/utils/getRequestPath';
import { hashRateLimitIdentifier } from '@/utils/hashRateLimitIdentifier';
import { readLimitedJsonBody } from '@/utils/readLimitedJsonBody';

const MAX_REQUEST_SIZE = 10_000;

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function serviceUnavailableResponse(): Response {
    return Response.json(
        {
            success: false,
            message: 'El servicio no está disponible temporalmente. Inténtalo nuevamente más tarde.',
        },
        {
            status: 503,
        },
    );
}

export async function POST(request: Request): Promise<Response> {
    const contentType = request.headers.get('content-type');
    const contentLength = Number(request.headers.get('content-length') ?? 0);

    if (!contentType?.includes('application/json')) {
        return Response.json(
            {
                success: false,
                message: 'Formato de solicitud no válido.',
            },
            {
                status: 415,
            },
        );
    }

    if (contentLength > MAX_REQUEST_SIZE) {
        return Response.json(
            {
                success: false,
                message: 'La solicitud excede el tamaño permitido.',
            },
            {
                status: 413,
            },
        );
    }

    const clientIdentity = getClientIdentity(request);

    if (!clientIdentity.success) {
        return serviceUnavailableResponse();
    }

    const identifierHash = hashRateLimitIdentifier(clientIdentity.identity);

    if (!identifierHash.success) {
        return serviceUnavailableResponse();
    }

    const rateLimit = await checkContactRateLimit(identifierHash.identifierHash);

    if (rateLimit.status === 'error') {
        return serviceUnavailableResponse();
    }

    if (rateLimit.status === 'blocked') {
        return Response.json(
            {
                success: false,
                message: 'Has realizado demasiados intentos. Inténtalo nuevamente más tarde.',
            },
            {
                status: 429,
                headers: {
                    'Retry-After': String(rateLimit.retryAfterSeconds),
                },
            },
        );
    }

    const bodyResult = await readLimitedJsonBody(request, MAX_REQUEST_SIZE);

    if (!bodyResult.success && bodyResult.error === 'body_too_large') {
        return Response.json(
            {
                success: false,
                message: 'La solicitud excede el tamaño permitido.',
            },
            {
                status: 413,
            },
        );
    }

    if (!bodyResult.success) {
        return Response.json(
            {
                success: false,
                message: 'El cuerpo de la solicitud no es válido.',
            },
            {
                status: 400,
            },
        );
    }

    const rawPayload = bodyResult.data;

    if (!isRecord(rawPayload)) {
        return Response.json(
            {
                success: false,
                message: 'El cuerpo de la solicitud no es válido.',
            },
            {
                status: 400,
            },
        );
    }

    const payload: ContactFormPayload = {
        name: rawPayload.name,
        email: rawPayload.email,
        contactType: rawPayload.contactType,
        message: rawPayload.message,
        privacyAccepted: rawPayload.privacyAccepted,
        website: rawPayload.website,
        utmSource: rawPayload.utmSource,
        utmMedium: rawPayload.utmMedium,
        utmCampaign: rawPayload.utmCampaign,
    };

    const honeypot = typeof payload.website === 'string' ? payload.website.trim() : '';

    if (honeypot.length > 0) {
        return Response.json(
            {
                success: true,
                message: 'Mensaje enviado correctamente.',
            },
            {
                status: 200,
            },
        );
    }

    const validation = validateContactPayload(payload);

    if (!validation.success) {
        return Response.json(
            {
                success: false,
                message: 'Revisa los datos ingresados.',
                errors: validation.errors,
            },
            {
                status: 422,
            },
        );
    }

    const path = getRequestPath(request);

    const result = await createContact({
        ...validation.data,
        path,
    });

    if (!result.success) {
        return Response.json(
            {
                success: false,
                message: 'No fue posible enviar el mensaje. Inténtalo nuevamente.',
            },
            {
                status: 500,
            },
        );
    }

    return Response.json(
        {
            success: true,
            message: 'Mensaje enviado correctamente.',
        },
        {
            status: 201,
        },
    );
}
