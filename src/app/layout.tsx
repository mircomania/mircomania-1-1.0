import type { Metadata } from 'next';
import { Montserrat, Inter, Orbitron } from 'next/font/google';
import './globals.css';

// Inicializamos las fuentes y definimos variables CSS para usarlas en los Modules
const montserrat = Montserrat({ subsets: ['latin'], weight: ['900'], variable: '--font-title' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-body' });
const orbitron = Orbitron({ subsets: ['latin'], weight: ['700'], variable: '--font-neon' });

export const metadata: Metadata = {
    title: 'Mircomania',
    description: 'Portafolio y CV Online',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es" className={`${montserrat.variable} ${inter.variable} ${orbitron.variable}`}>
            <body>{children}</body>
        </html>
    );
}
