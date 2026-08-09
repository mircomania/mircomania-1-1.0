'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useNavbarScroll } from '@/hooks/useNavbarScroll';

import { ROUTES } from '@/constants/routes';

import { SmartLink } from '@/utils/SmartLink';

import Logo from '@/assets/icons/Logo';
import { Arrow } from '@/assets/icons/Arrow';

import { BurgerMenu } from './BurgerMenu';
import { NavItems } from './NavItems';
import { navbarMenu } from './navbarMenu';

import styles from './navbar.module.css';

export function Navbar() {
    const isMobile = useMediaQuery('(max-width: 991px)');
    const scrollState = useNavbarScroll();

    return (
        <header className={styles.header} data-scroll-state={scrollState}>
            <nav className={styles.navbar} aria-label="Navegación principal">
                <SmartLink href={ROUTES.home} className={styles.logoLink} aria-label="Ir al inicio" dataLink="navbar-logo-btn">
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
                    <SmartLink href={ROUTES.contact} className={styles.desktopContactButton} dataCta="navbar-contacto-btn">
                        <span>Contacto</span>
                        <Arrow className={styles.contactArrow} />
                    </SmartLink>
                )}

                {isMobile && <BurgerMenu />}
            </nav>
        </header>
    );
}
