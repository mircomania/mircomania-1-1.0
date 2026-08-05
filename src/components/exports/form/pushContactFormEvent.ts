import type { ContactType } from '@/types/contact';

export function pushContactFormEvent(contactType: ContactType): void {
    if (typeof window === 'undefined') {
        return;
    }

    window.dataLayer = window.dataLayer ?? [];

    window.dataLayer.push({
        event: 'send_form',
        form_name: 'contact',
        contact_type: contactType,
    });
}
