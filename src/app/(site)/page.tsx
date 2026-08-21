import { createMetadata } from '@/utils/createMetadata';

import { ROUTES } from '@/constants/routes';

import Home1 from '@/components/exports/home/home1/Home1';
import Home2 from '@/components/exports/home/home2/Home2';
import Home3 from '@/components/exports/home/home3/Home3';
import ProjectsLoadError from '@/components/exports/home/home3/ProjectsLoadError';
import Home4 from '@/components/exports/home/home4/Home4';
import Home5 from '@/components/exports/home/home5/Home5';

import { getFeaturedProjects } from '@/services/projects/getFeaturedProjects';

import type { FeaturedProjectCard } from '@/types/projects';

import StarryBackground from '@/utils/starryBackground/StarryBackground';

export const metadata = createMetadata({
    title: 'Mircomania | Desarrollo web, automatización y productos digitales',

    description:
        'Desarrollo web, automatización y productos digitales con foco en rendimiento, experiencia de usuario y soluciones adaptadas a cada proyecto.',

    path: ROUTES.home,

    absoluteTitle: true,
});

export const revalidate = 3600;

export default async function Home() {
    let projects: FeaturedProjectCard[] = [];
    let projectsLoadFailed = false;

    try {
        projects = await getFeaturedProjects();
    } catch {
        projectsLoadFailed = true;
    }

    return (
        <main className="space-main">
            <StarryBackground />

            <Home1 />

            <section id="servicios">
                <Home2 />
            </section>

            {projectsLoadFailed ? (
                <section id="proyectos">
                    <ProjectsLoadError />
                </section>
            ) : projects.length > 0 ? (
                <section id="proyectos">
                    <Home3 projects={projects} />
                </section>
            ) : null}

            <section id="cv">
                <Home4 />
            </section>

            <Home5 />
        </main>
    );
}
