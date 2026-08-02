import {
    CONTACT_TYPES,
    type ContactFormPayload,
    type ContactType,
    type CreateContactInput,
} from '@/types/contact';

type ValidationErrors = {
    name?: string;
    email?: string;
    contactType?: string;
    message?: string;
    privacyAccepted?: string;
};

type ValidationSuccess = {
    success: true;
    data: CreateContactInput;
};

type ValidationError = {
    success: false;
    errors: ValidationErrors;
};

export type ContactValidationResult = ValidationSuccess | ValidationError;

const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function isContactType(value: string): value is ContactType {
    return CONTACT_TYPES.includes(value as ContactType);
}

export function validateContactPayload(
    payload: ContactFormPayload,
): ContactValidationResult {
    const name = typeof payload.name === 'string' ? payload.name.trim() : '';

    const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';

    const contactType = typeof payload.contactType === 'string' ? payload.contactType : '';

    const message = typeof payload.message === 'string' ? payload.message.trim() : '';

    const errors: ValidationErrors = {};

    if (name.length < 2 || name.length > 100) {
        errors.name = 'El nombre debe tener entre 2 y 100 caracteres.';
    }

    if (email.length < 5 || email.length > 320 || !EMAIL_PATTERN.test(email)) {
        errors.email = 'Ingresa un correo electrónico válido.';
    }

    if (!isContactType(contactType)) {
        errors.contactType = 'Selecciona un motivo de contacto válido.';
    }

    if (message.length < 20 || message.length > 3000) {
        errors.message = 'El mensaje debe tener entre 20 y 3000 caracteres.';
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

    /*
     * Esta comprobación permite que TypeScript estreche correctamente
     * contactType a ContactType sin usar una aserción en el resultado.
     *
     * En condiciones normales ya fue comprobado arriba. Se repite porque
     * TypeScript no relaciona automáticamente errors.contactType con el tipo
     * de la variable.
     */
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
        },
    };
}