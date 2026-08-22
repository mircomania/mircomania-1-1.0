import type { ContactApiResponse, ContactSubmitPayload } from '@/types/contact';

const CONTACT_REQUEST_TIMEOUT_MS = 20_000;

export async function submitContact(payload: ContactSubmitPayload): Promise<ContactApiResponse> {
    const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(CONTACT_REQUEST_TIMEOUT_MS),
    });

    let data: ContactApiResponse;

    try {
        data = (await response.json()) as ContactApiResponse;
    } catch {
        return {
            success: false,
            message: 'El servidor devolvió una respuesta no válida.',
        };
    }

    if (!response.ok && data.success) {
        return {
            success: false,
            message: 'No fue posible enviar el mensaje.',
        };
    }

    return data;
}
