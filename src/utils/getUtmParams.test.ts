import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { EMPTY_UTM_PARAMS, getUtmParams } from './getUtmParams';

const STORAGE_KEY = 'mircomania_utm_params';
const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.UTC(2026, 10, 1);
const campaign = { utmSource: 'google', utmMedium: 'cpc', utmCampaign: 'prueba' };

let storage: Map<string, string>;
let localStorageMock: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function visit(path: string) {
    vi.stubGlobal('window', { location: new URL(path, 'https://mircomania.cl') });
}

beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    storage = new Map();
    localStorageMock = {
        getItem: vi.fn((key: string) => storage.get(key) ?? null),
        setItem: vi.fn((key: string, value: string) => { storage.set(key, value); }),
        removeItem: vi.fn((key: string) => { storage.delete(key); }),
    };
    vi.stubGlobal('localStorage', localStorageMock);
    visit('/');
});

afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
});

describe('atribución UTM durante la navegación', () => {
    it.each([
        ['/ads', 'ads_servicios', ['/contacto?servicio=marketing']],
        ['/ads/mejoravit', 'mejoravit', ['/ads', '/contacto']],
        ['/', 'home', ['/ads', '/ads/mejoravit', '/contacto']],
    ])('conserva la campaña que llegó por %s antes de abrir el formulario', (entry, name, destinations) => {
        const expected = { ...campaign, utmCampaign: name };
        visit(`${entry}?utm_source=google&utm_medium=cpc&utm_campaign=${name}`);
        expect(getUtmParams()).toEqual(expected);
        expect(JSON.parse(storage.get(STORAGE_KEY)!)).toEqual({ ...expected, timestamp: NOW });

        vi.setSystemTime(NOW + DAY);
        for (const destination of destinations) {
            visit(destination);
            expect(getUtmParams()).toEqual(expected);
        }

        expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
        expect(JSON.parse(storage.get(STORAGE_KEY)!).timestamp).toBe(NOW);
    });

    it('reemplaza la campaña completa al aparecer nuevos UTM durante una navegación', () => {
        visit('/ads?utm_source=google&utm_medium=cpc&utm_campaign=anterior');
        getUtmParams();
        vi.setSystemTime(NOW + DAY);
        visit('/ads?utm_campaign=nueva');

        const expected = { utmSource: '', utmMedium: '', utmCampaign: 'nueva' };
        expect(getUtmParams()).toEqual(expected);
        expect(JSON.parse(storage.get(STORAGE_KEY)!)).toEqual({ ...expected, timestamp: NOW + DAY });
        visit('/contacto?servicio=marketing');
        expect(getUtmParams()).toEqual(expected);
    });

    it('recorta los valores y conserva vacíos los parámetros ausentes de una nueva campaña', () => {
        storage.set(STORAGE_KEY, JSON.stringify({ ...campaign, timestamp: NOW }));
        visit('/?utm_source=%20newsletter%20&utm_medium=%20');

        expect(getUtmParams()).toEqual({ utmSource: 'newsletter', utmMedium: '', utmCampaign: '' });
    });

    it.each(['/', '/contacto?servicio=marketing', '/?utm_source=%20&utm_medium=&utm_campaign='])(
        'no inventa atribución para %s', (path) => {
            visit(path);
            expect(getUtmParams()).toEqual(EMPTY_UTM_PARAMS);
            expect(storage.size).toBe(0);
            expect(localStorageMock.setItem).not.toHaveBeenCalled();
        },
    );

    it('reutiliza una campaña vigente sin renovar su vencimiento y la descarta después de 15 días', () => {
        const stored = JSON.stringify({ ...campaign, timestamp: NOW });
        storage.set(STORAGE_KEY, stored);
        vi.setSystemTime(NOW + 15 * DAY);
        expect(getUtmParams()).toEqual(campaign);
        expect(storage.get(STORAGE_KEY)).toBe(stored);
        expect(localStorageMock.setItem).not.toHaveBeenCalled();

        vi.setSystemTime(NOW + 15 * DAY + 1);
        expect(getUtmParams()).toEqual(EMPTY_UTM_PARAMS);
        expect(storage.has(STORAGE_KEY)).toBe(false);
    });
});

describe('tolerancia a almacenamiento inválido o bloqueado', () => {
    it.each([
        'no es JSON',
        'null',
        '[]',
        '{}',
        JSON.stringify({ ...campaign, timestamp: '2026-11-01' }),
        JSON.stringify({ ...campaign, timestamp: NOW, utmSource: 123 }),
        JSON.stringify({ ...campaign, timestamp: NOW, utmMedium: null }),
        JSON.stringify({ utmSource: 'google', utmMedium: 'cpc', timestamp: NOW }),
        '{"utmSource":"google","utmMedium":"cpc","utmCampaign":"prueba","timestamp":1e999}',
    ])('descarta datos inválidos: %s', (stored) => {
        storage.set(STORAGE_KEY, stored);
        expect(getUtmParams()).toEqual(EMPTY_UTM_PARAMS);
        expect(storage.has(STORAGE_KEY)).toBe(false);
    });

    it('devuelve los UTM de la URL aunque no pueda guardarlos', () => {
        vi.mocked(localStorageMock.setItem).mockImplementation(() => { throw new Error('Storage bloqueado'); });
        visit('/ads?utm_source=google&utm_medium=cpc&utm_campaign=prueba');
        expect(getUtmParams()).toEqual(campaign);
    });

    it('devuelve atribución vacía sin lanzar si no puede leer el almacenamiento', () => {
        vi.mocked(localStorageMock.getItem).mockImplementation(() => { throw new Error('Storage bloqueado'); });
        expect(getUtmParams()).toEqual(EMPTY_UTM_PARAMS);
    });

    it('no lanza si falla la eliminación de datos expirados', () => {
        storage.set(STORAGE_KEY, JSON.stringify({ ...campaign, timestamp: NOW - 16 * DAY }));
        vi.mocked(localStorageMock.removeItem).mockImplementation(() => { throw new Error('Storage bloqueado'); });
        expect(getUtmParams()).toEqual(EMPTY_UTM_PARAMS);
    });
});
