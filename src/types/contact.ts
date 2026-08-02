export const CONTACT_TYPES = ['project', 'job', 'collaboration', 'general'] as const;

export type ContactType = (typeof CONTACT_TYPES)[number];

export type CreateContactInput = {
    name: string;
    email: string;
    contactType: ContactType;
    message: string;
};

export type ContactFormPayload = {
    name: unknown;
    email: unknown;
    contactType: unknown;
    message: unknown;
    privacyAccepted: unknown;
    website?: unknown;
};

export type CreateContactResult = { success: true } | { success: false; error: 'database_error' };
