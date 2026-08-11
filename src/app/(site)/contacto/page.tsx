import { createMetadata } from '@/utils/createMetadata';

import { ROUTES } from '@/constants/routes';

import Contact1 from '@/components/exports/contact/contact1/Contact1';

import StarryBackground from '@/utils/starryBackground/StarryBackground';

export const metadata = createMetadata({
    title: 'Contacto',

    description: 'Conversemos sobre desarrollo web, automatización, productos digitales, colaboraciones u oportunidades profesionales.',

    path: ROUTES.contact,
});

export default function Contact() {
    return (
        <main className="space-main">
            <StarryBackground />

            <Contact1 />
        </main>
    );
}
