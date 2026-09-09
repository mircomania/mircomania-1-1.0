import { ROUTES, SOCIAL_LINKS } from '@/constants/routes';

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
                        Última actualización: <time dateTime="2026-09-09">9 de septiembre de 2026</time> · Versión 1.1
                    </p>
                </header>

                <div className={styles.content}>
                    <section className={styles.policySection}>
                        <h2>1. Responsable del tratamiento</h2>

                        <p>
                            El responsable del tratamiento es Mirco Rodríguez, quien gestiona Mircomania como su sitio profesional personal desde
                            Chile y decide para qué y cómo se utilizan los datos. Mircomania es el nombre del sitio y del proyecto profesional.
                        </p>

                        <p>La información enviada mediante este sitio es tratada únicamente para las finalidades descritas en esta política.</p>
                    </section>

                    <section className={styles.policySection}>
                        <h2>2. Información que recopilamos</h2>

                        <p>
                            Tratamos datos de quienes visitan el sitio y de quienes nos contactan por consultas, proyectos, trabajo o colaboración.
                            Los datos proceden de lo que nos proporcionas y de la información que genera tu navegador al interactuar con el sitio.
                            Mediante el formulario recibimos:
                        </p>

                        <ul>
                            <li>Nombre.</li>
                            <li>Dirección de correo electrónico.</li>
                            <li>Tipo de contacto o consulta.</li>
                            <li>Contenido del mensaje.</li>
                            <li>Aceptación de privacidad, cuya fecha se registra al recibir el mensaje.</li>
                        </ul>

                        <p>
                            Para identificar el origen de las consultas, registramos su procedencia del sitio, la ruta de la página cuando está
                            disponible y los parámetros de atribución utm_source, utm_medium y utm_campaign obtenidos de la URL o del almacenamiento
                            local del navegador.
                        </p>

                        <p>
                            Para prevenir abuso, el servidor utiliza transitoriamente la IP de la solicitud y la transforma en un identificador
                            seudonimizado antes de enviarlo al control de solicitudes en Supabase. Allí se guardan ese identificador, contadores y
                            fechas de control, sin enviar la IP original para esta función ni guardarla con el mensaje de contacto.
                        </p>

                        <p>
                            El sitio integra Google Tag Manager. Tras un envío confirmado, genera un evento de medición con el nombre del formulario
                            y el tipo de contacto; ese evento no incluye el nombre, correo ni contenido del mensaje.
                        </p>
                    </section>

                    <section className={styles.policySection}>
                        <h2>3. Finalidades y bases del tratamiento</h2>

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

                        <p>
                            El tratamiento de los datos del formulario para responder, evaluar propuestas y mantener comunicaciones se basa en tu
                            consentimiento. Los datos de origen asociados a la consulta permiten conocer cómo llegaste al sitio.
                        </p>

                        <p>
                            Los datos técnicos se utilizan para proteger el sitio y prevenir spam y abuso. Desde el 1 de diciembre de 2026, este
                            tratamiento podrá fundarse en el interés legítimo de mantener un servicio seguro, cuando sea necesario y no afecte tus
                            derechos y libertades, conforme al artículo 13 letra d) de la Ley N.º 19.628. Hasta esa fecha, se sujeta a las bases
                            habilitantes de la legislación vigente; esta política no anticipa la aplicación de esa nueva base legal.
                        </p>

                        {/* TODO: Revisar las etiquetas activas de GTM y documentar la base de licitud de la medición y del almacenamiento UTM,
                            incluidos los mecanismos de consentimiento que correspondan. La aceptación del formulario no cubre operaciones previas. */}
                        <p>
                            La medición del formulario y la atribución buscan conocer el origen de las consultas y mejorar el funcionamiento del
                            sitio. GTM se carga al visitar el sitio y los UTM pueden guardarse al abrir el formulario, antes de enviarlo. La aceptación
                            del formulario autoriza la gestión de tu solicitud; no constituye por sí sola consentimiento para toda la analítica ni
                            para operaciones anteriores. La medición que trate datos personales requiere una base legal válida y, cuando corresponda,
                            tu consentimiento específico.
                        </p>
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

                        <p>
                            Puedes retirar tu consentimiento mediante los canales de la sección 8. La retirada no afecta la licitud del tratamiento
                            anterior y puede impedir que continuemos gestionando tu solicitud. Solo podrán conservarse datos si existe otro fundamento
                            legal aplicable.
                        </p>
                    </section>

                    <section className={styles.policySection}>
                        <h2>5. Almacenamiento y proveedores tecnológicos</h2>

                        <p>
                            Mircomania utiliza servicios tecnológicos de terceros necesarios para operar el sitio, alojar su infraestructura y
                            almacenar la información recibida.
                        </p>

                        <ul>
                            <li>Bluehosting: alojamiento del sitio y procesamiento de las solicitudes que recibe su servidor.</li>
                            <li>Supabase: almacenamiento de contactos y del identificador seudonimizado y registros del control de solicitudes.</li>
                            <li>Make: recepción de nuevos contactos desde Supabase para generar notificaciones por correo.</li>
                            <li>
                                Servicio de correo del hosting: envío de notificaciones y recepción o reenvío de comunicaciones de contacto, con los
                                datos incluidos en esos mensajes.
                            </li>
                            <li>Google Tag Manager, de Google: gestión de etiquetas y del evento de medición descrito en la sección 2.</li>
                        </ul>

                        <p>Estos proveedores pueden procesar información únicamente en la medida necesaria para prestar sus respectivos servicios.</p>
                    </section>

                    <section className={styles.policySection}>
                        <h2>6. Tratamiento internacional de datos</h2>

                        <p>
                            Debido a la naturaleza de los servicios de infraestructura utilizados, parte de la información puede ser almacenada o
                            procesada mediante infraestructura ubicada fuera de Chile.
                        </p>

                        <p>
                            Algunos proveedores tecnológicos pueden utilizar infraestructura fuera de Chile. Las transferencias deberán sujetarse a
                            las condiciones y garantías exigidas por la normativa aplicable, incluidas las reglas de transferencia internacional que
                            entren en vigor el 1 de diciembre de 2026.
                        </p>
                    </section>

                    {/* TODO: Definir una política operativa concreta de retención y eliminación para contactos, notificaciones e identificadores
                        de seguridad, para cumplir completamente con el artículo 14 ter letra i) desde el 1 de diciembre de 2026. */}
                    <section className={styles.policySection}>
                        <h2>7. Conservación de la información</h2>

                        <p>
                            La información se conservará únicamente durante el tiempo necesario para atender la solicitud, mantener comunicaciones
                            relacionadas o cumplir obligaciones legales y de seguridad aplicables.
                        </p>

                        <p>Cuando los datos dejen de ser necesarios para estas finalidades, podrán ser eliminados o anonimizados.</p>

                        <p>
                            Los UTM guardados en el navegador tienen una vigencia de 15 días: al volver a consultarlos, se descartan si han vencido.
                            Puedes borrarlos desde los ajustes de almacenamiento de tu navegador. Este plazo no determina la conservación de los datos
                            ya enviados con una consulta, sus notificaciones por correo ni los registros de seguridad.
                        </p>
                    </section>

                    <section className={styles.policySection}>
                        <h2>8. Derechos sobre tus datos</h2>

                        <p>
                            Puedes ejercer gratuitamente tus derechos conforme a la legislación aplicable: acceso a tus datos, rectificación de
                            información incorrecta, supresión o eliminación, oposición al tratamiento y bloqueo cuando corresponda. Desde el 1 de
                            diciembre de 2026, también podrás ejercer el derecho a la portabilidad, que permite obtener tus datos en un formato
                            electrónico de uso común y transmitirlos a otro responsable, bajo las condiciones legales. La oposición y los demás
                            derechos se ejercerán con el alcance vigente en cada momento. También puedes retirar tu consentimiento.
                        </p>

                        <p>
                            Para realizar una solicitud relacionada con tus datos personales puedes utilizar la{' '}
                            <SmartLink href={ROUTES.contact} className={styles.link} dataCta="privacy-contacto-link">
                                página de contacto
                            </SmartLink>
                            {' '}o escribir a{' '}
                            <a href={`mailto:${SOCIAL_LINKS.emailContact}`} className={styles.link}>
                                {SOCIAL_LINKS.emailContact}
                            </a>
                            . Indica tu solicitud y los antecedentes necesarios para identificar los datos a los que se refiere.
                        </p>

                        <p>
                            A partir del 1 de diciembre de 2026, podrás recurrir ante la Agencia de Protección de Datos Personales cuando corresponda
                            conforme a la ley, especialmente si tu solicitud de derechos es rechazada o no recibe respuesta dentro del plazo legal.
                            Hasta entonces, se mantienen las vías de protección previstas por la legislación vigente.
                        </p>
                    </section>

                    <section className={styles.policySection}>
                        <h2>9. Seguridad</h2>

                        <p>
                            Se aplican medidas técnicas y organizativas razonables destinadas a reducir riesgos de acceso no autorizado, alteración,
                            pérdida o uso indebido de la información. Estas incluyen controles de acceso a los datos, limitación de solicitudes,
                            minimización de la información técnica y protección de credenciales mediante la separación entre navegador y servidor.
                        </p>

                        <p>Sin embargo, ningún sistema conectado a Internet puede garantizar seguridad absoluta.</p>
                    </section>

                    <section className={styles.policySection}>
                        <h2>10. Menores de edad</h2>

                        <p>
                            Este sitio profesional no está dirigido a niños, niñas o adolescentes ni busca recopilar intencionalmente sus datos.
                            Cuando corresponda, se respetarán las categorías especiales de protección previstas por la legislación chilena, incluidas
                            las garantías para sus datos y la intervención de sus representantes legales en los casos exigidos por la ley.
                        </p>
                    </section>

                    <section className={styles.policySection}>
                        <h2>11. Decisiones automatizadas</h2>

                        <p>
                            Mircomania no utiliza los datos enviados mediante el formulario para tomar decisiones automatizadas que produzcan efectos
                            jurídicos o te afecten significativamente. Las automatizaciones operativas, como las notificaciones por correo y los
                            controles de abuso, sirven para gestionar y proteger el servicio.
                        </p>
                    </section>

                    <section className={styles.policySection}>
                        <h2>12. Enlaces externos</h2>

                        <p>
                            El sitio puede contener enlaces hacia plataformas o sitios web de terceros. Mircomania no controla sus políticas de
                            privacidad ni sus prácticas de tratamiento de información.
                        </p>

                        <p>Al visitar un servicio externo, sus propias políticas y condiciones serán las aplicables.</p>
                    </section>

                    <section className={styles.policySection}>
                        <h2>13. Legislación aplicable</h2>

                        <p>
                            El tratamiento de datos realizado desde Chile se encuentra sujeto a la legislación chilena aplicable en materia de
                            privacidad y protección de datos personales, en particular la Ley N.º 19.628. Esta política contempla las modificaciones
                            introducidas por la Ley N.º 21.719 que entran en vigor el 1 de diciembre de 2026, sin presentarlas como exigibles antes de
                            esa fecha.
                        </p>

                        <p>
                            Cuando una normativa extranjera resulte aplicable debido a las circunstancias específicas de un usuario o servicio, podrán
                            existir derechos y obligaciones adicionales.
                        </p>
                    </section>

                    <section className={styles.policySection}>
                        <h2>14. Cambios en esta política</h2>

                        <p>
                            Esta política podrá actualizarse cuando cambien las funcionalidades del sitio, los servicios utilizados o las obligaciones
                            legales aplicables.
                        </p>

                        <p>Cuando se realicen cambios relevantes, se actualizarán la fecha y la versión indicadas al inicio de esta página.</p>
                    </section>
                </div>
            </div>
        </section>
    );
}
