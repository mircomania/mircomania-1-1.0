import { SmartLink } from '@/utils/SmartLink';

import { ROUTES, SOCIAL_LINKS } from '@/constants/routes';

import { legalLinks, navigationLinks, socialLinks } from './footerLinks';

import Logo from '@/assets/icons/Logo';
import styles from './footer.module.css';

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.horizon} aria-hidden="true" />

            <div className={styles.container}>
                <div className={styles.mainContent}>
                    <section className={styles.brand} aria-labelledby="footer-brand-title">
                        <SmartLink
                            href={ROUTES.home}
                            className={styles.logoLink}
                            aria-label="Ir al inicio de Mircomania"
                            dataLink="footer-inicio-icon"
                        >
                            <Logo className={styles.logo} />

                            <span id="footer-brand-title" className={styles.brandName}>
                                MIRCOMANIA
                            </span>
                        </SmartLink>

                        <p>Desarrollo web, automatización y productos digitales.</p>
                    </section>

                    <nav className={styles.navigation} aria-label="Navegación del pie de página">
                        <p className={styles.groupTitle}>Navegación</p>

                        <ul className={styles.linkList}>
                            {navigationLinks.map((link) => (
                                <li key={link.href}>
                                    <SmartLink href={link.href} className={styles.link} dataLink={link.dataLink}>
                                        {link.label}
                                    </SmartLink>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <section className={styles.social} aria-labelledby="footer-social-title">
                        <div className={styles.socialWeb}>
                            <p id="footer-social-title" className={styles.groupTitle}>
                                Conecta
                            </p>

                            <ul className={styles.linkList}>
                                {socialLinks.map(({ label, href, ariaLabel, icon: Icon, dataLink }) => (
                                    <li key={href}>
                                        <a
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={ariaLabel}
                                            className={styles.socialLink}
                                            data-link={dataLink}
                                        >
                                            <Icon className={styles.socialIcon} />

                                            <span>{label}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <a href="mailto:hola@mircomania.cl" className={styles.emailLink} data-link="footer-email-link">
                            {SOCIAL_LINKS.emailContact}
                        </a>
                    </section>
                </div>

                <div className={styles.bottomBar}>
                    <p className={styles.copyright}>© {currentYear} Mircomania. Todos los derechos reservados.</p>

                    <nav className={styles.legalNavigation} aria-label="Información legal">
                        <ul className={styles.legalList}>
                            {legalLinks.map((link) => (
                                <li key={link.href}>
                                    <SmartLink href={link.href} className={styles.legalLink} dataLink={link.dataLink}>
                                        {link.label}
                                    </SmartLink>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        </footer>
    );
};
