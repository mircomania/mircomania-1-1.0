'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';

import ParticlePlanet from './ParticlePlanet';

export default function DesktopParticlePlanet() {
    const isDesktop = useMediaQuery('(min-width: 1200px)');

    if (!isDesktop) {
        return null;
    }

    return <ParticlePlanet />;
}
