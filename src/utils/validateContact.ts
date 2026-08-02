import { CONTACT_TYPES, type ContactFieldErrors, type ContactFormPayload, type ContactType, type CreateContactInput } from '@/types/contact';

type ValidationSuccess = {
    success: true;
    data: CreateContactInput;
};

type ValidationError = {
    success: false;
    errors: ContactFieldErrors;
};

export type ContactValidationResult = ValidationSuccess | ValidationError;

const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function isContactType(value: string): value is ContactType {
    return CONTACT_TYPES.includes(value as ContactType);
}

function normalizeOptionalString(value: unknown, maxLength: number): string | null {
    if (typeof value !== 'string') {
        return null;
    }

    const normalizedValue = value.trim().slice(0, maxLength);

    return normalizedValue || null;
}

export function validateContactPayload(payload: ContactFormPayload): ContactValidationResult {
    const name = typeof payload.name === 'string' ? payload.name.trim() : '';

    const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';

    const contactType = typeof payload.contactType === 'string' ? payload.contactType : '';

    const message = typeof payload.message === 'string' ? payload.message.trim() : '';

    const errors: ContactFieldErrors = {};

    if (name.length < 2 || name.length > 100) {
        errors.name = 'Ingresa un nombre válido.';
    }

    if (email.length < 5 || email.length > 320 || !EMAIL_PATTERN.test(email)) {
        errors.email = 'Ingresa un correo válido.';
    }

    if (!isContactType(contactType)) {
        errors.contactType = 'Selecciona un motivo válido.';
    }

    if (message.length < 10 || message.length > 3000) {
        errors.message = 'El mensaje debe tener mínimo  10 caracteres.';
    }

    if (payload.privacyAccepted !== true) {
        errors.privacyAccepted = 'Debes aceptar el tratamiento de tus datos.';
    }

    if (Object.keys(errors).length > 0) {
        return {
            success: false,
            errors,
        };
    }

    if (!isContactType(contactType)) {
        return {
            success: false,
            errors: {
                contactType: 'Selecciona un motivo de contacto válido.',
            },
        };
    }

    return {
        success: true,
        data: {
            name,
            email,
            contactType,
            message,
            utmSource: normalizeOptionalString(payload.utmSource, 150),
            utmMedium: normalizeOptionalString(payload.utmMedium, 150),
            utmCampaign: normalizeOptionalString(payload.utmCampaign, 200),
        },
    };
}
