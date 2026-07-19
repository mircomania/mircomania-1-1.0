import { supabase } from './server';

export function getPublicMediaUrl(storagePath: string): string {
    const { data } = supabase.storage.from('project-media').getPublicUrl(storagePath);

    return data.publicUrl;
}
