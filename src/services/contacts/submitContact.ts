import type { ContactApiResponse, ContactSubmitPayload } from '@/types/contact';

export async function submitContact(payload: ContactSubmitPayload): Promise<ContactApiResponse> {
    const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
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
