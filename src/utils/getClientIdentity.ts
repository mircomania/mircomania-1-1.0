import 'server-only';

import { isIP } from 'node:net';

const PASSENGER_CLIENT_ADDRESS_HEADER = '!~Passenger-Client-Address';
const LOCAL_CLIENT_ADDRESS = '127.0.0.1';

export type ClientIdentityResult = { success: true; identity: string } | { success: false };

function normalizeIpAddress(value: string | null): string | null {
    const address = value?.trim();

    if (!address || isIP(address) === 0) {
        return null;
    }

    return address;
}

function getForwardedAddress(request: Request): string | null {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const firstForwardedAddress = forwardedFor?.split(',', 1)[0] ?? null;

    return normalizeIpAddress(firstForwardedAddress) ?? normalizeIpAddress(request.headers.get('x-real-ip'));
}

export function getClientIdentity(request: Request): ClientIdentityResult {
    const passengerAddress = normalizeIpAddress(request.headers.get(PASSENGER_CLIENT_ADDRESS_HEADER));

    if (passengerAddress) {
        return {
            success: true,
            identity: passengerAddress,
        };
    }

    if (process.env.NODE_ENV === 'production') {
        return {
            success: false,
        };
    }

    return {
        success: true,
        identity: getForwardedAddress(request) ?? LOCAL_CLIENT_ADDRESS,
    };
}
