import type { NavItem } from '@/types/navigation';
import { ROUTES, ANCHORS } from '@/constants/routes';

export const navbarMenu = [
    {
        id: 'inicio',
        href: ROUTES.home,
        label: 'Inicio',
        title: 'Ir al inicio',
        dataLink: 'navbar-inicio-link',
    },
    {
        id: 'servicios',
        href: ANCHORS.services,
        label: 'Servicios',
        title: 'Ir a la sección de servicios',
        dataLink: 'navbar-servicios-link',
    },
    {
        id: 'proyectos',
        href: ANCHORS.projects,
        label: 'Proyectos',
        title: 'Ir a la sección de proyectos',
        dataLink: 'navbar-proyectos-link',
    },
    {
        id: 'cv',
        href: ANCHORS.cv,
        label: 'CV',
        title: 'Ir a la sección del currículum',
        dataLink: 'navbar-cv-link',
    },
] as const satisfies readonly NavItem[];
