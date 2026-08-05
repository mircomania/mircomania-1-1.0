import styles from './contactForm.module.css';

type ContactFormStatusProps = Readonly<{
    type: 'success' | 'error';
    message: string;
}>;

export default function ContactFormStatus({ type, message }: ContactFormStatusProps) {
    const isError = type === 'error';

    return (
        <div
            className={isError ? styles.submitError : styles.successMessage}
            role={isError ? 'alert' : 'status'}
            aria-live={isError ? 'assertive' : 'polite'}
        >
            <p>{message}</p>
        </div>
    );
}
