export function getAdsCarouselPosition(physicalIndex: number, count: number) {
    if (count < 2) return { index: 0, resetTo: null };

    const position = Math.max(0, Math.min(count + 1, physicalIndex));
    const index = (position - 1 + count) % count;
    const resetTo = position === 0 ? count : position === count + 1 ? 1 : null;

    return { index, resetTo };
}
