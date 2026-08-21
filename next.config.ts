import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'nsckplnrhhbsjfklxzis.supabase.co',
                pathname: '/storage/v1/object/public/project-media/**',
            },
        ],
    },

    output: process.env.VERCEL ? undefined : 'standalone',
};

export default nextConfig;
