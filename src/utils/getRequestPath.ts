export function getRequestPath(request: Request): string | null {
    const referer = request.headers.get('referer');

    if (!referer) {
        return null;
    }

    try {
        const refererUrl = new URL(referer);

        const requestHost = request.headers.get('x-forwarded-host') ?? request.headers.get('host');

        if (!requestHost || refererUrl.host !== requestHost) {
            return null;
        }

        const pathname = refererUrl.pathname;

        return pathname === '/' ? '/' : pathname.replace(/\/$/, '');
    } catch {
        return null;
    }
}
