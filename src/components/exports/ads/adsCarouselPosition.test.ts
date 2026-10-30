import { describe, expect, it } from 'vitest';

import { getAdsCarouselPosition } from './adsCarouselPosition';

describe('circular ads case positions', () => {
    it.each([0, 1])('does not loop with %i cases', (count) => {
        expect(getAdsCarouselPosition(0, count)).toEqual({ index: 0, resetTo: null });
    });

    it.each([2, 3, 5, 25])('preserves order and wraps both ends with %i real cases', (count) => {
        const previous = getAdsCarouselPosition(0, count);
        const next = getAdsCarouselPosition(count + 1, count);
        expect(previous).toEqual({ index: count - 1, resetTo: count });
        expect(next).toEqual({ index: 0, resetTo: 1 });
        // The invisible correction must preserve both the visible case and its indicator.
        expect(getAdsCarouselPosition(previous.resetTo!, count).index).toBe(previous.index);
        expect(getAdsCarouselPosition(next.resetTo!, count).index).toBe(next.index);
        for (let index = 0; index < count; index++) {
            expect(getAdsCarouselPosition(index + 1, count)).toEqual({ index, resetTo: null });
        }
    });
});
