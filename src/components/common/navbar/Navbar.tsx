'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';

import { SmartLink } from '@/utils/SmartLink';

import Logo from '@/assets/icons/Logo';

import { BurgerMenu } from './BurgerMenu';
import { NavItems } from './NavItems';
import { navbarMenu } from './navbarMenu';
import styles from './navbar.module.css';

export function Navbar() {
    const isMobile = useMediaQuery('(max-width: 991px)');

    return (
        <header className={styles.header}>
            <nav className={styles.navbar} aria-label="Navegación principal">
                <SmartLink href="/" className={styles.logoLink} aria-label="Ir al inicio" dataLink="navbar-logo-btn">
                    <Logo className={styles.logo} />
                </SmartLink>

                {!isMobile && (
                    <ul className={styles.desktopMenu}>
                        {navbarMenu.map((item) => (
                            <li key={item.id}>
                                <NavItems item={item} className={styles.navLink} />
                            </li>
                        ))}
                    </ul>
                )}

                {!isMobile && (
                    <SmartLink href="/contacto" className={styles.desktopContactButton} dataCta="navbar-contacto-btn">
                        Contacto
                    </SmartLink>
                )}

                {isMobile && <BurgerMenu />}
            </nav>
        </header>
    );
}
