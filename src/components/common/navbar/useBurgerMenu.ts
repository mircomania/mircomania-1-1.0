'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const FOCUSABLE_SELECTOR =
    'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';

function getFocusableElements(container: HTMLElement): HTMLElement[] {
    return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((element) => {
        return !element.matches(':disabled') && element.tabIndex >= 0 && element.getAttribute('aria-hidden') !== 'true' && element.getClientRects().length > 0;
    });
}

export function useBurgerMenu() {
    const [isOpen, setIsOpen] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    const toggleMenu = useCallback((): void => {
        setIsOpen((currentState) => !currentState);
    }, []);

    const closeMenu = useCallback((): void => {
        setIsOpen(false);
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        const focusFirstElementFrame = requestAnimationFrame(() => {
            const panel = panelRef.current;

            if (!panel) return;

            getFocusableElements(panel)[0]?.focus();
        });

        const handlePointerDown = (event: PointerEvent): void => {
            const target = event.target;

            if (!(target instanceof Node)) return;

            const isInsideTrigger = menuRef.current?.contains(target);
            const isInsidePanel = panelRef.current?.contains(target);

            if (!isInsideTrigger && !isInsidePanel) {
                closeMenu();
            }
        };

        const handleKeyDown = (event: KeyboardEvent): void => {
            if (event.key === 'Escape') {
                triggerRef.current?.focus();
                closeMenu();
                return;
            }

            if (event.key !== 'Tab') return;

            const panel = panelRef.current;

            if (!panel) return;

            const focusableElements = getFocusableElements(panel);

            if (focusableElements.length === 0) {
                event.preventDefault();
                return;
            }

            const firstElement = focusableElements[0];
            const lastElement = focusableElements.at(-1);
            const activeElement = document.activeElement;

            if (event.shiftKey && (activeElement === firstElement || !panel.contains(activeElement))) {
                event.preventDefault();
                lastElement?.focus();
                return;
            }

            if (!event.shiftKey && (activeElement === lastElement || !panel.contains(activeElement))) {
                event.preventDefault();
                firstElement.focus();
            }
        };

        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            cancelAnimationFrame(focusFirstElementFrame);
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, closeMenu]);

    useEffect(() => {
        if (!isOpen) return;

        const previousBodyOverflow = document.body.style.overflow;
        const previousHtmlOverflow = document.documentElement.style.overflow;

        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        document.documentElement.dataset.mobileMenuOpen = 'true';

        return () => {
            document.body.style.overflow = previousBodyOverflow;
            document.documentElement.style.overflow = previousHtmlOverflow;
            delete document.documentElement.dataset.mobileMenuOpen;
        };
    }, [isOpen]);

    return {
        isOpen,
        toggleMenu,
        closeMenu,
        menuRef,
        panelRef,
        triggerRef,
    };
}
