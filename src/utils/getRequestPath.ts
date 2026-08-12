export function getRequestPath(request: Request): string | null {
    const referer = request.headers.get('referer');

    if (!referer) {
        return null;
    }

    try {
        const refererUrl = new URL(referer);
        const requestUrl = new URL(request.url);

        if (refererUrl.origin !== requestUrl.origin) {
            return null;
        }

        const pathname = refererUrl.pathname;

        if (pathname === '/') {
            return '/';
        }

        return pathname.replace(/\/$/, '');
    } catch {
        return null;
    }
}
