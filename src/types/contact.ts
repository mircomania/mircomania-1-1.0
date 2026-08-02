export const CONTACT_TYPES = ['project', 'job', 'collaboration', 'general'] as const;

export type ContactType = (typeof CONTACT_TYPES)[number];

export type UtmParams = {
    utmSource: string;
    utmMedium: string;
    utmCampaign: string;
};

export type StoredUtmParams = UtmParams & {
    timestamp: number;
};

export type ContactFormValues = {
    name: string;
    email: string;
    contactType: ContactType | '';
    message: string;
    privacyAccepted: boolean;
    website: string;
};

export type ContactSubmitPayload = ContactFormValues & UtmParams;

export type ContactFormPayload = {
    name: unknown;
    email: unknown;
    contactType: unknown;
    message: unknown;
    privacyAccepted: unknown;
    website?: unknown;
    utmSource?: unknown;
    utmMedium?: unknown;
    utmCampaign?: unknown;
};

export type CreateContactInput = {
    name: string;
    email: string;
    contactType: ContactType;
    message: string;
    utmSource: string | null;
    utmMedium: string | null;
    utmCampaign: string | null;
};

export type ContactFieldErrors = {
    name?: string;
    email?: string;
    contactType?: string;
    message?: string;
    privacyAccepted?: string;
};

export type ContactApiResponse = { success: true; message: string } | { success: false; message: string; errors?: ContactFieldErrors };

export type CreateContactResult = { success: true } | { success: false; error: 'database_error' };
