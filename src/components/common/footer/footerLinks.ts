import type { ComponentType, SVGProps } from 'react';

import github from '@/assets/icons/Github';
import linkedin from '@/assets/icons/Linkedin';

export type FooterLink = {
    label: string;
    href: string;
};

export type SocialLink = FooterLink & {
    ariaLabel: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export const navigationLinks: FooterLink[] = [
    {
        label: 'Inicio',
        href: '/',
    },
    {
        label: 'Servicios',
        href: '/#servicios',
    },
    {
        label: 'Proyectos',
        href: '/#proyectos',
    },
    {
        label: 'CV',
        href: '/#cv',
    },
];

export const socialLinks: SocialLink[] = [
    {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/mircorodriguez',
        ariaLabel: 'Visitar perfil de Mirco Rodríguez en LinkedIn',
        icon: linkedin,
    },
    {
        label: 'GitHub',
        href: 'https://github.com/mircomania',
        ariaLabel: 'Visitar perfil de Mirco Rodríguez en GitHub',
        icon: github,
    },
];

export const legalLinks: FooterLink[] = [
    {
        label: 'Política de privacidad',
        href: '/politica-privacidad',
    },
];
