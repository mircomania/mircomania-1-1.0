import type { NavItem } from '@/types/navigation';

export const navbarMenu = [
    {
        id: 'inicio',
        href: '/',
        label: 'Inicio',
        title: 'Ir al inicio',
        dataLink: 'navbar-inicio-link',
    },
    {
        id: 'servicios',
        href: '/#servicios',
        label: 'Servicios',
        title: 'Ir a la sección de servicios',
        dataLink: 'navbar-servicios-link',
    },
    {
        id: 'proyectos',
        href: '/#proyectos',
        label: 'Proyectos',
        title: 'Ir a la sección de proyectos',
        dataLink: 'navbar-proyectos-link',
    },
    {
        id: 'cv',
        href: '/#cv',
        label: 'CV',
        title: 'Ir a la sección del currículum',
        dataLink: 'navbar-cv-link',
    },
] as const satisfies readonly NavItem[];
