'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

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
            if (event.key !== 'Escape') return;

            closeMenu();
            triggerRef.current?.focus();
        };

        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
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
