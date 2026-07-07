import { useSyncExternalStore } from 'react';

export const useMediaQuery = (query: string) => {
    return useSyncExternalStore(
        (callback) => {
            const mediaQuery = window.matchMedia(query);

            mediaQuery.addEventListener('change', callback);

            return () => {
                mediaQuery.removeEventListener('change', callback);
            };
        },
        () => window.matchMedia(query).matches,
        () => false,
    );
};
