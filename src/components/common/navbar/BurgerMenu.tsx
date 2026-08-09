'use client';

import { createPortal } from 'react-dom';

import { ROUTES } from '@/constants/routes';

import { Menu } from '@/assets/icons/Menu';
import { Arrow } from '@/assets/icons/Arrow';

import { useBurgerMenu } from '@/hooks/useBurgerMenu';

import { navbarMenu } from './navbarMenu';
import { NavItems } from './NavItems';
import { SmartLink } from '@/utils/SmartLink';

import styles from './navbar.module.css';

export function BurgerMenu() {
    const { isOpen, toggleMenu, closeMenu, menuRef, panelRef, triggerRef } = useBurgerMenu();

    const menuButtonLabel = isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación';

    const mobilePanel = (
        <div
            ref={panelRef}
            id="mobile-menu"
            className={`${styles.mobileMenuPanel} ${isOpen ? styles.mobileMenuPanelOpen : ''}`}
            aria-hidden={!isOpen}
        >
            <ul className={styles.mobileMenuList}>
                {navbarMenu.map((item) => (
                    <li key={item.id}>
                        <NavItems item={item} className={styles.mobileNavLink} onAfterNavigate={closeMenu} />
                    </li>
                ))}
            </ul>

            <div className={styles.mobileMenuBottom}>
                <SmartLink href={ROUTES.contact} className={styles.mobileContactButton} dataCta="burger-contacto-btn" onClick={closeMenu}>
                    <span>Contacto</span>
                    <Arrow className={styles.contactArrow} />
                </SmartLink>
            </div>
        </div>
    );

    return (
        <div ref={menuRef} className={styles.burgerMenu}>
            <Menu
                ref={triggerRef}
                className={`${styles.menuButton} ${isOpen ? styles.menuButtonOpen : ''}`}
                aria-label={menuButtonLabel}
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
                onClick={toggleMenu}
            />

            {typeof document !== 'undefined' && createPortal(mobilePanel, document.body)}
        </div>
    );
}
