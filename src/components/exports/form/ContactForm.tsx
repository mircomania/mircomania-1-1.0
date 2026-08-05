'use client';

import { Spinner } from '@/assets/icons/Spinner';
import { useContactForm } from '@/hooks/useContactForm';

import type { ContactFormValues } from '@/types/contact';

import ContactFormStatus from './ContactFormStatus';
import styles from './contactForm.module.css';

export default function ContactForm() {
    const { values, errors, isSubmitting, successMessage, submitError, handleTextChange, updateContactType, updatePrivacyAccepted, handleSubmit } =
        useContactForm();

    return (
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.field}>
                <label htmlFor="contact-name">Nombre</label>

                <input
                    id="contact-name"
                    name="name"
                    type="text"
                    placeholder="Tu nombre"
                    value={values.name}
                    onChange={handleTextChange}
                    autoComplete="name"
                    minLength={2}
                    maxLength={100}
                    required
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'contact-name-error' : undefined}
                />

                {errors.name && (
                    <p id="contact-name-error" className={styles.fieldError}>
                        {errors.name}
                    </p>
                )}
            </div>

            <div className={styles.field}>
                <label htmlFor="contact-email">Correo electrónico</label>

                <input
                    id="contact-email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={values.email}
                    onChange={handleTextChange}
                    autoComplete="email"
                    maxLength={320}
                    required
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'contact-email-error' : undefined}
                />

                {errors.email && (
                    <p id="contact-email-error" className={styles.fieldError}>
                        {errors.email}
                    </p>
                )}
            </div>

            <div className={styles.field}>
                <label htmlFor="contact-type">Motivo de contacto</label>

                <select
                    id="contact-type"
                    name="contactType"
                    value={values.contactType}
                    required
                    aria-invalid={Boolean(errors.contactType)}
                    aria-describedby={errors.contactType ? 'contact-type-error' : undefined}
                    onChange={(event) => {
                        const contactType = event.target.value as ContactFormValues['contactType'];

                        updateContactType(contactType);
                    }}
                >
                    <option value="" disabled hidden>
                        Selecciona una opción
                    </option>

                    <option value="project">Proyecto o servicio</option>
                    <option value="job">Oportunidad laboral</option>
                    <option value="collaboration">Colaboración</option>
                    <option value="general">Consulta general</option>
                </select>

                {errors.contactType && (
                    <p id="contact-type-error" className={styles.fieldError}>
                        {errors.contactType}
                    </p>
                )}
            </div>

            <div className={styles.field}>
                <label htmlFor="contact-message">Mensaje</label>

                <textarea
                    id="contact-message"
                    name="message"
                    placeholder="Cuéntame sobre tu proyecto, oportunidad o consulta..."
                    value={values.message}
                    onChange={handleTextChange}
                    minLength={10}
                    maxLength={3000}
                    rows={7}
                    required
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'contact-message-help contact-message-error' : 'contact-message-help'}
                />

                <p id="contact-message-help" className={styles.fieldHelp}>
                    Entre 10 y 3000 caracteres.
                </p>

                {errors.message && (
                    <p id="contact-message-error" className={styles.fieldError}>
                        {errors.message}
                    </p>
                )}
            </div>

            <div className={styles.checkboxField}>
                <input
                    id="contact-privacy"
                    name="privacyAccepted"
                    type="checkbox"
                    checked={values.privacyAccepted}
                    required
                    aria-invalid={Boolean(errors.privacyAccepted)}
                    aria-describedby={errors.privacyAccepted ? 'contact-privacy-error' : undefined}
                    onChange={(event) => {
                        updatePrivacyAccepted(event.target.checked);
                    }}
                />

                <label htmlFor="contact-privacy">Acepto que mis datos sean utilizados para responder esta consulta.</label>

                {errors.privacyAccepted && (
                    <p id="contact-privacy-error" className={styles.fieldError}>
                        {errors.privacyAccepted}
                    </p>
                )}
            </div>

            <div className={styles.honeypot} aria-hidden="true">
                <label htmlFor="contact-website">Sitio web</label>

                <input
                    id="contact-website"
                    name="website"
                    type="text"
                    value={values.website}
                    autoComplete="off"
                    tabIndex={-1}
                    onChange={handleTextChange}
                />
            </div>

            {submitError && <ContactFormStatus type="error" message={submitError} />}

            {successMessage && <ContactFormStatus type="success" message={successMessage} />}

            <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
                {isSubmitting ? (
                    <>
                        <Spinner />
                        <span>Enviando...</span>
                    </>
                ) : (
                    'Enviar mensaje'
                )}
            </button>
        </form>
    );
}
