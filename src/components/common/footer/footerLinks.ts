import type { ComponentType, SVGProps } from 'react';

import { ROUTES, ANCHORS, SOCIAL_LINKS } from '@/constants/routes';

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
        href: ROUTES.home,
    },
    {
        label: 'Servicios',
        href: ANCHORS.services,
    },
    {
        label: 'Proyectos',
        href: ANCHORS.projects,
    },
    {
        label: 'CV',
        href: ANCHORS.cv,
    },
];

export const socialLinks: SocialLink[] = [
    {
        label: 'LinkedIn',
        href: SOCIAL_LINKS.linkedin,
        ariaLabel: 'Visitar perfil de Mirco Rodríguez en LinkedIn',
        icon: linkedin,
    },
    {
        label: 'GitHub',
        href: SOCIAL_LINKS.github,
        ariaLabel: 'Visitar perfil de Mirco Rodríguez en GitHub',
        icon: github,
    },
];

export const legalLinks: FooterLink[] = [
    {
        label: 'Política de privacidad',
        href: ROUTES.privacy,
    },
];
