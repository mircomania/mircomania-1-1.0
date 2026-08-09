import { createMetadata } from '@/utils/createMetadata';

import { ROUTES } from '@/constants/routes';

import Privacy1 from '@/components/exports/privacy/privacy1/Privacy1';

import StarryBackground from '@/utils/starryBackground/StarryBackground';

export const metadata = createMetadata({
    title: 'Política de privacidad',

    description: 'Consulta cómo Mircomania recopila, utiliza y protege la información enviada a través de sus formularios y servicios digitales.',

    path: ROUTES.privacy,
});

export default function Politics() {
    return (
        <main className="space-main">
            <StarryBackground />

            <Privacy1 />
        </main>
    );
}
