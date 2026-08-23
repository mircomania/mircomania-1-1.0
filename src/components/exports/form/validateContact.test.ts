import { describe, expect, it } from 'vitest';

import type { ContactFormPayload } from '@/types/contact';

import { validateContactPayload } from './validateContact';

const createValidPayload = (overrides: Partial<ContactFormPayload> = {}): ContactFormPayload => ({
    name: 'Mirco',
    email: 'mirco@example.com',
    contactType: 'project',
    message: 'Mensaje válido para contactar.',
    privacyAccepted: true,
    ...overrides,
});

describe('validateContactPayload', () => {
    it('acepta un payload válido, normaliza los campos principales y convierte UTMs vacías o inválidas en null', () => {
        const result = validateContactPayload(
            createValidPayload({
                name: '  Mirco Rodríguez  ',
                email: '  MIRCO@EXAMPLE.COM  ',
                message: '  Mensaje válido para contactar.  ',
                utmSource: '   ',
                utmMedium: 42,
            }),
        );

        expect(result).toEqual({
            success: true,
            data: {
                name: 'Mirco Rodríguez',
                email: 'mirco@example.com',
                contactType: 'project',
                message: 'Mensaje válido para contactar.',
                utmSource: null,
                utmMedium: null,
                utmCampaign: null,
            },
        });
    });

    it('recorta y limita las UTMs a sus longitudes máximas', () => {
        const result = validateContactPayload(
            createValidPayload({
                utmSource: `  ${'s'.repeat(160)}  `,
                utmMedium: `  ${'m'.repeat(160)}  `,
                utmCampaign: `  ${'c'.repeat(210)}  `,
            }),
        );

        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.data.utmSource).toBe('s'.repeat(150));
            expect(result.data.utmMedium).toBe('m'.repeat(150));
            expect(result.data.utmCampaign).toBe('c'.repeat(200));
        }
    });

    it.each(['project', 'job', 'collaboration', 'general'] as const)('acepta el tipo de contacto %s', (contactType) => {
        const result = validateContactPayload(createValidPayload({ contactType }));

        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.data.contactType).toBe(contactType);
        }
    });

    it.each([
        ['menos de 2 caracteres', 'a'],
        ['más de 100 caracteres', 'a'.repeat(101)],
    ])('rechaza un nombre con %s', (_case, name) => {
        const result = validateContactPayload(createValidPayload({ name }));

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(result.errors.name).toBeDefined();
        }
    });

    it.each([
        ['formato incorrecto', 'correo-invalido'],
        ['más de 254 caracteres', `${'a'.repeat(243)}@example.com`],
    ])('rechaza un email con %s', (_case, email) => {
        const result = validateContactPayload(createValidPayload({ email }));

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(result.errors.email).toBeDefined();
        }
    });

    it('rechaza un tipo de contacto no soportado', () => {
        const result = validateContactPayload(createValidPayload({ contactType: 'support' }));

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(result.errors.contactType).toBeDefined();
        }
    });

    it.each([
        ['menos de 10 caracteres', 'a'.repeat(9)],
        ['más de 3000 caracteres', 'a'.repeat(3001)],
    ])('rechaza un mensaje con %s', (_case, message) => {
        const result = validateContactPayload(createValidPayload({ message }));

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(result.errors.message).toBeDefined();
        }
    });

    it.each([false, null, 'true', 1])('rechaza privacyAccepted cuando su valor es %j', (privacyAccepted) => {
        const result = validateContactPayload(createValidPayload({ privacyAccepted }));

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(result.errors.privacyAccepted).toBeDefined();
        }
    });

    it('devuelve errores sin lanzar ante tipos inesperados', () => {
        const validateUnexpectedPayload = () =>
            validateContactPayload({
                name: 42,
                email: null,
                contactType: {},
                message: [],
                privacyAccepted: 'true',
            });

        expect(validateUnexpectedPayload).not.toThrow();

        const result = validateUnexpectedPayload();

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(result.errors).toEqual({
                name: expect.any(String),
                email: expect.any(String),
                contactType: expect.any(String),
                message: expect.any(String),
                privacyAccepted: expect.any(String),
            });
        }
    });
});
