import Home1 from '@/components/exports/home/home1/Home1';
import Home2 from '@/components/exports/home/home2/Home2';
import Home3 from '@/components/exports/home/home3/Home3';

import { getFeaturedProjects } from '@/services/projects/getFeaturedProjects';

import StarryBackground from '@/components/utils/starryBackground/StarryBackground';

export default async function Home() {
    const projects = await getFeaturedProjects();

    return (
        <div>
            <main className="space-main">
                <StarryBackground />

                <Home1 />

                <Home2 />

                <Home3 projects={projects} />
            </main>
        </div>
    );
}
