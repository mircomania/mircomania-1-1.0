import { ROUTES } from '@/constants/routes';

import { SmartLink } from '@/utils/SmartLink';

import styles from './privacy1.module.css';

export default function Privacy1() {
    return (
        <section className={styles.sectionContainer} aria-labelledby="privacy-title">
            <div className={styles.container}>
                <header className={styles.header}>
                    <span className={styles.eyebrow}>LEGAL · PRIVACIDAD</span>

                    <h1 id="privacy-title">POLÍTICA DE PRIVACIDAD</h1>

                    <p className={styles.introduction}>
                        Esta política explica cómo{' '}
                        <SmartLink href={ROUTES.home} className={styles.link} dataLink="privacy-inicio-link">
                            Mircomania
                        </SmartLink>{' '}
                        recopila, utiliza y protege la información proporcionada a través de este sitio web.
                    </p>

                    <p className={styles.updated}>
                        Última actualización: <time dateTime="2026-08-10">10 de agosto de 2026</time>
                    </p>
                </header>

                <div className={styles.content}>
                    <section className={styles.policySection}>
                        <h2>1. Responsable del tratamiento</h2>

                        <p>
                            Mircomania es un sitio profesional operado desde Chile y orientado a la presentación de servicios, proyectos, experiencia
                            profesional y oportunidades de contacto.
                        </p>

                        <p>La información enviada mediante este sitio es tratada únicamente para las finalidades descritas en esta política.</p>
                    </section>

                    <section className={styles.policySection}>
                        <h2>2. Información que recopilamos</h2>

                        <p>Cuando utilizas el formulario de contacto, podemos recopilar información proporcionada directamente por ti, incluyendo:</p>

                        <ul>
                            <li>Nombre.</li>
                            <li>Dirección de correo electrónico.</li>
                            <li>Tipo de contacto o consulta.</li>
                            <li>Contenido del mensaje.</li>
                        </ul>

                        <p>
                            También podemos registrar información relacionada con el origen de una visita, como parámetros UTM presentes en la URL,
                            cuando estén disponibles.
                        </p>
                    </section>

                    <section className={styles.policySection}>
                        <h2>3. Finalidad de la información</h2>

                        <p>La información recopilada puede utilizarse para:</p>

                        <ul>
                            <li>Responder consultas enviadas mediante el formulario.</li>
                            <li>Evaluar propuestas de proyectos, trabajo o colaboración.</li>
                            <li>Mantener comunicación relacionada con una solicitud.</li>
                            <li>Identificar el origen de determinadas consultas o campañas.</li>
                            <li>Detectar y prevenir spam, abuso o uso indebido del formulario.</li>
                            <li>Mejorar el funcionamiento y la seguridad del sitio.</li>
                        </ul>

                        <p>Los datos no serán utilizados para finalidades incompatibles con aquellas para las que fueron recopilados.</p>
                    </section>

                    <section className={styles.policySection}>
                        <h2>4. Consentimiento</h2>

                        <p>
                            Al enviar voluntariamente información mediante el formulario y aceptar esta política de privacidad, autorizas el
                            tratamiento de los datos proporcionados para gestionar y responder tu solicitud.
                        </p>

                        <p>
                            No estás obligado a proporcionar esta información, pero algunos datos son necesarios para poder responder correctamente
                            una consulta.
                        </p>
                    </section>

                    <section className={styles.policySection}>
                        <h2>5. Almacenamiento y proveedores tecnológicos</h2>

                        <p>
                            Mircomania utiliza servicios tecnológicos de terceros necesarios para operar el sitio, alojar su infraestructura y
                            almacenar la información recibida.
                        </p>

                        <p>
                            Entre estos servicios pueden encontrarse proveedores de hosting, infraestructura cloud y bases de datos, como Vercel y
                            Supabase.
                        </p>

                        <p>Estos proveedores pueden procesar información únicamente en la medida necesaria para prestar sus respectivos servicios.</p>
                    </section>

                    <section className={styles.policySection}>
                        <h2>6. Tratamiento internacional de datos</h2>

                        <p>
                            Debido a la naturaleza de los servicios de infraestructura utilizados, parte de la información puede ser almacenada o
                            procesada mediante infraestructura ubicada fuera de Chile.
                        </p>

                        <p>
                            En estos casos se procurará utilizar proveedores tecnológicos reconocidos y aplicar medidas razonables para proteger la
                            información.
                        </p>
                    </section>

                    <section className={styles.policySection}>
                        <h2>7. Conservación de la información</h2>

                        <p>
                            La información se conservará únicamente durante el tiempo necesario para atender la solicitud, mantener comunicaciones
                            relacionadas o cumplir obligaciones legales y de seguridad aplicables.
                        </p>

                        <p>Cuando los datos dejen de ser necesarios para estas finalidades, podrán ser eliminados o anonimizados.</p>
                    </section>

                    <section className={styles.policySection}>
                        <h2>8. Derechos sobre tus datos</h2>

                        <p>
                            Puedes solicitar información respecto de los datos personales almacenados sobre ti y, cuando corresponda conforme a la
                            legislación aplicable, solicitar su acceso, actualización, rectificación, eliminación o bloqueo.
                        </p>

                        <p>
                            Para realizar una solicitud relacionada con tus datos personales puedes utilizar la{' '}
                            <SmartLink href={ROUTES.contact} className={styles.link} dataCta="privacy-contacto-link">
                                página de contacto
                            </SmartLink>
                            .
                        </p>
                    </section>

                    <section className={styles.policySection}>
                        <h2>9. Seguridad</h2>

                        <p>
                            Se aplican medidas técnicas y organizativas razonables destinadas a reducir riesgos de acceso no autorizado, alteración,
                            pérdida o uso indebido de la información.
                        </p>

                        <p>Sin embargo, ningún sistema conectado a Internet puede garantizar seguridad absoluta.</p>
                    </section>

                    <section className={styles.policySection}>
                        <h2>10. Menores de edad</h2>

                        <p>
                            Este sitio no está dirigido específicamente a menores de edad ni busca recopilar intencionalmente información personal de
                            menores.
                        </p>
                    </section>

                    <section className={styles.policySection}>
                        <h2>11. Enlaces externos</h2>

                        <p>
                            El sitio puede contener enlaces hacia plataformas o sitios web de terceros. Mircomania no controla sus políticas de
                            privacidad ni sus prácticas de tratamiento de información.
                        </p>

                        <p>Al visitar un servicio externo, sus propias políticas y condiciones serán las aplicables.</p>
                    </section>

                    <section className={styles.policySection}>
                        <h2>12. Legislación aplicable</h2>

                        <p>
                            El tratamiento de datos realizado desde Chile se encuentra sujeto a la legislación chilena aplicable en materia de
                            privacidad y protección de datos personales.
                        </p>

                        <p>
                            Cuando una normativa extranjera resulte aplicable debido a las circunstancias específicas de un usuario o servicio, podrán
                            existir derechos y obligaciones adicionales.
                        </p>
                    </section>

                    <section className={styles.policySection}>
                        <h2>13. Cambios en esta política</h2>

                        <p>
                            Esta política podrá actualizarse cuando cambien las funcionalidades del sitio, los servicios utilizados o las obligaciones
                            legales aplicables.
                        </p>

                        <p>Cuando se realicen cambios relevantes, se actualizará la fecha indicada al inicio de esta página.</p>
                    </section>
                </div>
            </div>
        </section>
    );
}
