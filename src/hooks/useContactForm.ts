'use client';

import { useEffect, useRef, useState, type ChangeEvent, type SubmitEvent } from 'react';

import { submitContact } from '@/services/contacts/submitContact';

import type { ContactFieldErrors, ContactFormValues, ContactType } from '@/types/contact';

import { pushContactFormEvent } from '@/components/exports/form/pushContactFormEvent';
import { EMPTY_UTM_PARAMS, getUtmParams } from '@/utils/getUtmParams';
import { validateContactPayload } from '@/components/exports/form/validateContact';

const INITIAL_VALUES: ContactFormValues = {
    name: '',
    email: '',
    contactType: '',
    message: '',
    privacyAccepted: false,
    website: '',
};

type ContactTextField = 'name' | 'email' | 'message' | 'website';

type UseContactFormReturn = {
    values: ContactFormValues;
    errors: ContactFieldErrors;
    isSubmitting: boolean;
    successMessage: string | null;
    submitError: string | null;
    handleTextChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    updateContactType: (contactType: ContactType | '') => void;
    updatePrivacyAccepted: (accepted: boolean) => void;
    handleSubmit: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
};

export function useContactForm(): UseContactFormReturn {
    const [values, setValues] = useState<ContactFormValues>(INITIAL_VALUES);

    const utmParamsRef = useRef(EMPTY_UTM_PARAMS);

    const [errors, setErrors] = useState<ContactFieldErrors>({});

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        utmParamsRef.current = getUtmParams();
    }, []);

    function clearFieldError(field: keyof ContactFieldErrors): void {
        setErrors((currentErrors) => {
            if (!currentErrors[field]) {
                return currentErrors;
            }

            const nextErrors = { ...currentErrors };
            delete nextErrors[field];

            return nextErrors;
        });
    }

    function handleTextChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        const field = event.target.name as ContactTextField;
        const { value } = event.target;

        setValues((currentValues) => ({
            ...currentValues,
            [field]: value,
        }));

        if (field !== 'website') {
            clearFieldError(field);
        }
    }

    function updateContactType(contactType: ContactType | ''): void {
        setValues((currentValues) => ({
            ...currentValues,
            contactType,
        }));

        clearFieldError('contactType');
    }

    function updatePrivacyAccepted(privacyAccepted: boolean): void {
        setValues((currentValues) => ({
            ...currentValues,
            privacyAccepted,
        }));

        clearFieldError('privacyAccepted');
    }

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        setSuccessMessage(null);
        setSubmitError(null);

        const validation = validateContactPayload({
            ...values,
            ...utmParamsRef.current,
        });

        if (!validation.success) {
            setErrors(validation.errors);
            return;
        }

        setErrors({});
        setIsSubmitting(true);

        try {
            const response = await submitContact({
                ...values,
                ...utmParamsRef.current,
            });

            if (!response.success) {
                setErrors(response.errors ?? {});
                setSubmitError(response.message);
                return;
            }

            const submittedContactType = values.contactType;

            if (submittedContactType) {
                pushContactFormEvent(submittedContactType);
            }

            setValues(INITIAL_VALUES);
            setSuccessMessage(response.message);
        } catch (error: unknown) {
            console.error('Error enviando formulario de contacto:', error);

            setSubmitError('No fue posible conectar con el servidor. Inténtalo nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return {
        values,
        errors,
        isSubmitting,
        successMessage,
        submitError,
        handleTextChange,
        updateContactType,
        updatePrivacyAccepted,
        handleSubmit,
    };
}
