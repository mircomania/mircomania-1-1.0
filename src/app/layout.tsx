import type { Metadata } from 'next';
import { Inter, Montserrat, Space_Grotesk } from 'next/font/google';
import { GoogleTagManager } from '@next/third-parties/google';

import { SITE_URL } from '@/constants/routes';

import { Footer } from '@/components/common/footer/Footer';
import { Navbar } from '@/components/common/navbar/Navbar';
import RouteFocusManager from '@/utils/RouteFocusManager';

import './globals.css';

const montserrat = Montserrat({ subsets: ['latin'], weight: ['700', '900'], variable: '--font-title' });

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-body' });

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['500', '700'], variable: '--font-space' });

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default: 'Mircomania',
        template: '%s | Mircomania',
    },

    description: 'Desarrollo web, automatización y productos digitales enfocados en rendimiento, experiencia de usuario y soluciones a medida.',

    verification: {
        google: '6ObDISrNV_z7N6J3A1CQpjUkO6G3obpqPdAzykt4M2g',
    },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="es" data-scroll-behavior="smooth">
            <body className={`${montserrat.variable} ${inter.variable} ${spaceGrotesk.variable}`}>
                <RouteFocusManager />

                <Navbar />

                {children}

                <Footer />
            </body>

            <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID!} />
        </html>
    );
}
