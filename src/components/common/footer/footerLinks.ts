import type { ComponentType, SVGProps } from 'react';

import { ROUTES, ANCHORS, SOCIAL_LINKS } from '@/constants/routes';

import github from '@/assets/icons/Github';
import linkedin from '@/assets/icons/Linkedin';

export type FooterLink = {
    label: string;
    href: string;
    dataLink?: string;
};

export type SocialLink = FooterLink & {
    ariaLabel: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export const navigationLinks: FooterLink[] = [
    {
        label: 'Inicio',
        href: ROUTES.home,
        dataLink: 'footer-inicio-link',
    },
    {
        label: 'Servicios',
        href: ANCHORS.services,
        dataLink: 'footer-servicios-link',
    },
    {
        label: 'Proyectos',
        href: ANCHORS.projects,
        dataLink: 'footer-proyectos-link',
    },
    {
        label: 'CV',
        href: ANCHORS.cv,
        dataLink: 'footer-cv-link',
    },
];

export const socialLinks: SocialLink[] = [
    {
        label: 'LinkedIn',
        href: SOCIAL_LINKS.linkedin,
        ariaLabel: 'Visitar perfil de Mirco Rodríguez en LinkedIn',
        icon: linkedin,
        dataLink: 'footer-linkedin-link',
    },
    {
        label: 'GitHub',
        href: SOCIAL_LINKS.github,
        ariaLabel: 'Visitar perfil de Mirco Rodríguez en GitHub',
        icon: github,
        dataLink: 'footer-github-link',
    },
];

export const legalLinks: FooterLink[] = [
    {
        label: 'Política de privacidad',
        href: ROUTES.privacy,
        dataLink: 'footer-privacy-link',
    },
];
