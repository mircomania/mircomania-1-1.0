import { useLayoutEffect, useRef, useState } from 'react';

import { useMediaQuery } from '@/hooks/useMediaQuery';

import { getAdsCarouselPosition } from './adsCarouselPosition';

export function useMobileAdsCasesCarousel(count: number) {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const trackRef = useRef<HTMLDivElement>(null);
    const indexRef = useRef(0);
    const [index, setIndex] = useState(0);
    const looping = isMobile && count > 1;

    useLayoutEffect(() => {
        const element = trackRef.current;
        if (!element || !looping) return;
        const track = element;

        let stride = 0;
        let correcting = false;
        let touching = false;
        let frame = 0;
        let timer: ReturnType<typeof setTimeout> | undefined;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

        function jump(physicalIndex: number) {
            cancelAnimationFrame(frame);
            correcting = true;
            track.style.scrollSnapType = 'none';
            track.scrollTo({ left: physicalIndex * stride, behavior: 'instant' });
            frame = requestAnimationFrame(() => {
                track.style.removeProperty('scroll-snap-type');
                correcting = false;
            });
        }

        function settle() {
            clearTimeout(timer);
            if (correcting || touching || stride <= 0) return;
            const physicalIndex = Math.round(track.scrollLeft / stride);
            const { resetTo } = getAdsCarouselPosition(physicalIndex, count);
            // Wait for snap to finish; a partially visible clone must never be teleported.
            if (resetTo !== null && Math.abs(track.scrollLeft - physicalIndex * stride) < 1) jump(resetTo);
        }

        function onScroll() {
            if (stride <= 0) return;
            const { index: nextIndex } = getAdsCarouselPosition(Math.round(track.scrollLeft / stride), count);
            indexRef.current = nextIndex;
            setIndex(nextIndex);
            if (correcting) return;
            clearTimeout(timer);
            // Fallback for browsers without scrollend. Touch gestures finish before correction.
            timer = setTimeout(settle, 160);
        }

        function measure() {
            const [first, second] = Array.from(track.children) as HTMLElement[];
            stride = second.getBoundingClientRect().left - first.getBoundingClientRect().left;
            if (stride <= 0) return;
            clearTimeout(timer);
            indexRef.current %= count;
            jump(indexRef.current + 1);
        }

        function onKeyDown(event: KeyboardEvent) {
            if (event.target !== track || stride <= 0 || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
            event.preventDefault();
            let physicalIndex = Math.round(track.scrollLeft / stride);
            const { resetTo } = getAdsCarouselPosition(physicalIndex, count);
            if (resetTo !== null && Math.abs(track.scrollLeft - physicalIndex * stride) < 1) {
                jump(resetTo);
                physicalIndex = resetTo;
            }
            const adjacent = Math.max(0, Math.min(count + 1, physicalIndex + (event.key === 'ArrowRight' ? 1 : -1)));
            const target = event.key === 'Home' ? 1 : event.key === 'End' ? count : adjacent;
            track.scrollTo({ left: target * stride, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
            // Instant commands can coalesce scroll events; read the actual position immediately.
            if (reducedMotion.matches) onScroll();
        }

        function onFocus(event: FocusEvent) {
            if (!(event.target instanceof HTMLElement) || event.target === track) return;
            const slide = event.target.closest<HTMLElement>('[data-ads-slide]');
            if (!slide || stride <= 0) return;
            const nextIndex = Number(slide.dataset.adsSlide);
            indexRef.current = nextIndex;
            setIndex(nextIndex);
            jump(nextIndex + 1);
        }

        function onTouchStart() { touching = true; }
        function onTouchEnd() {
            touching = false;
            clearTimeout(timer);
            timer = setTimeout(settle, 160);
        }

        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(track);
        track.addEventListener('scroll', onScroll, { passive: true });
        track.addEventListener('scrollend', settle);
        track.addEventListener('keydown', onKeyDown);
        track.addEventListener('focus', onFocus, true);
        track.addEventListener('touchstart', onTouchStart, { passive: true });
        track.addEventListener('touchend', onTouchEnd, { passive: true });
        track.addEventListener('touchcancel', onTouchEnd, { passive: true });

        return () => {
            clearTimeout(timer);
            cancelAnimationFrame(frame);
            observer.disconnect();
            track.removeEventListener('scroll', onScroll);
            track.removeEventListener('scrollend', settle);
            track.removeEventListener('keydown', onKeyDown);
            track.removeEventListener('focus', onFocus, true);
            track.removeEventListener('touchstart', onTouchStart);
            track.removeEventListener('touchend', onTouchEnd);
            track.removeEventListener('touchcancel', onTouchEnd);
            track.style.removeProperty('scroll-snap-type');
            track.scrollLeft = 0;
        };
    }, [looping, count]);

    return { isMobile, looping, trackRef, activeIndex: count > 0 ? index % count : 0 };
}
