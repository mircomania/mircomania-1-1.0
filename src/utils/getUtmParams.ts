import type { StoredUtmParams, UtmParams } from '@/types/contact';

const STORAGE_KEY = 'mircomania_utm_params';
const UTM_EXPIRATION_DAYS = 15;
const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

export const EMPTY_UTM_PARAMS: UtmParams = {
    utmSource: '',
    utmMedium: '',
    utmCampaign: '',
};

function hasUtmParams(params: UtmParams): boolean {
    return Boolean(params.utmSource || params.utmMedium || params.utmCampaign);
}

function readUtmParamsFromUrl(): UtmParams {
    const searchParams = new URLSearchParams(window.location.search);

    return {
        utmSource: searchParams.get('utm_source')?.trim() ?? '',
        utmMedium: searchParams.get('utm_medium')?.trim() ?? '',
        utmCampaign: searchParams.get('utm_campaign')?.trim() ?? '',
    };
}

function readStoredUtmParams(): UtmParams {
    const storedValue = localStorage.getItem(STORAGE_KEY);

    if (!storedValue) {
        return EMPTY_UTM_PARAMS;
    }

    try {
        const parsedValue = JSON.parse(storedValue) as Partial<StoredUtmParams>;

        if (
            typeof parsedValue.timestamp !== 'number' ||
            typeof parsedValue.utmSource !== 'string' ||
            typeof parsedValue.utmMedium !== 'string' ||
            typeof parsedValue.utmCampaign !== 'string'
        ) {
            localStorage.removeItem(STORAGE_KEY);
            return EMPTY_UTM_PARAMS;
        }

        const ageInDays = (Date.now() - parsedValue.timestamp) / MILLISECONDS_PER_DAY;

        if (ageInDays > UTM_EXPIRATION_DAYS) {
            localStorage.removeItem(STORAGE_KEY);
            return EMPTY_UTM_PARAMS;
        }

        return {
            utmSource: parsedValue.utmSource,
            utmMedium: parsedValue.utmMedium,
            utmCampaign: parsedValue.utmCampaign,
        };
    } catch {
        localStorage.removeItem(STORAGE_KEY);
        return EMPTY_UTM_PARAMS;
    }
}

export function getUtmParams(): UtmParams {
    const urlUtmParams = readUtmParamsFromUrl();

    if (hasUtmParams(urlUtmParams)) {
        const storedParams: StoredUtmParams = {
            ...urlUtmParams,
            timestamp: Date.now(),
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(storedParams));

        return urlUtmParams;
    }

    return readStoredUtmParams();
}
