import Home1 from '@/components/exports/home/home1/Home1';
import Home2 from '@/components/exports/home/home2/Home2';

import StarryBackground from '@/components/utils/starryBackground/StarryBackground';

export default function Home() {
    return (
        <div>
            <main>
                <StarryBackground />

                <Home1 />

                <Home2 />
            </main>
        </div>
    );
}
