import 'server-only';

import { createHmac } from 'node:crypto';

export type RateLimitIdentifierHashResult = { success: true; identifierHash: string } | { success: false };

export function hashRateLimitIdentifier(identifier: string): RateLimitIdentifierHashResult {
    const secret = process.env.RATE_LIMIT_SECRET;

    if (!secret || secret.trim().length === 0) {
        return {
            success: false,
        };
    }

    return {
        success: true,
        identifierHash: createHmac('sha256', secret).update(identifier, 'utf8').digest('hex'),
    };
}
