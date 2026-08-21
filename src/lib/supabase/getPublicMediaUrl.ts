import 'server-only';

import { supabase } from './server';

const PROJECT_MEDIA_BUCKET = 'project-media';

export function getPublicMediaUrl(storagePath: string): string | null {
    const normalizedPath = storagePath.trim();

    if (!normalizedPath) {
        return null;
    }

    const { data } = supabase.storage.from(PROJECT_MEDIA_BUCKET).getPublicUrl(normalizedPath);

    try {
        const publicUrl = new URL(data.publicUrl);

        if (publicUrl.protocol !== 'http:' && publicUrl.protocol !== 'https:') {
            return null;
        }

        return publicUrl.toString();
    } catch {
        return null;
    }
}
