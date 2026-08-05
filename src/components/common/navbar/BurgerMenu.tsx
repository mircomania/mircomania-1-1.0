'use client';

import { Menu } from '@/assets/icons/Menu';

import { useBurgerMenu } from '@/hooks/useBurgerMenu';

import { navbarMenu } from '@/components/common/navbar/navbarMenu';
import { NavItems } from '@/components/common/navbar/NavItems';
import { SmartLink } from '@/utils/SmartLink';

import styles from './navbar.module.css';

export function BurgerMenu() {
    const { isOpen, toggleMenu, closeMenu, menuRef, triggerRef } = useBurgerMenu();

    const menuButtonLabel = isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación';

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

            <div id="mobile-menu" className={`${styles.mobileMenuPanel} ${isOpen ? styles.mobileMenuPanelOpen : ''}`} aria-hidden={!isOpen}>
                <ul className={styles.mobileMenuList}>
                    {navbarMenu.map((item) => (
                        <li key={item.id}>
                            <NavItems item={item} className={styles.mobileNavLink} onAfterNavigate={closeMenu} />
                        </li>
                    ))}
                </ul>

                <div className={styles.mobileMenuBottom}>
                    <SmartLink href="/contacto" className={styles.mobileContactButton} dataCta="burger-contacto-btn" onClick={closeMenu}>
                        Contacto
                    </SmartLink>
                </div>
            </div>
        </div>
    );
}
