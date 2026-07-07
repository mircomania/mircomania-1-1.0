import type { Metadata } from 'next';
import { Montserrat, Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({ subsets: ['latin'], weight: ['700', '900'], variable: '--font-title' });

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-body' });

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['500', '700'], variable: '--font-space' });

export const metadata: Metadata = {
    title: 'Mircomania',
    description: 'Portafolio y CV Online',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es" className={`${montserrat.variable} ${inter.variable} ${spaceGrotesk.variable}`}>
            <body>{children}</body>
        </html>
    );
}
