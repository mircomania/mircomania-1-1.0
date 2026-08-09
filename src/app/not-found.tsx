import { SmartLink } from '@/utils/SmartLink';

import { ROUTES } from '@/constants/routes';

import StarryBackground from '@/utils/starryBackground/StarryBackground';
import styles from './not-found.module.css';

export default function NotFound() {
    return (
        <main className={`${styles.pageContainer} space-main`}>
            <StarryBackground />

            <h1>Error 404</h1>

            <p>La página que buscas no existe.</p>

            <SmartLink href={ROUTES.home} className={styles.buttonLink} dataLink="error-inicio-btn">
                Volver al inicio
            </SmartLink>
        </main>
    );
}
