/** @type {import('next').NextConfig} */
const nextConfig = {

    experimental: {
        serverActions: {
            bodySizeLimit: '20mb',
        },
    },

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'picsum.photos',
            },
            {
                protocol: 'https',
                hostname: 'picsum.photos',
                pathname: '/id/**',
            },
            {
                protocol: 'https',
                hostname: 'htfngurhtimmmdqhsdsm.supabase.co',
            },
            {
                protocol: 'https',
                hostname: '*.supabase.co',
            },
        ],
    },

};

export default nextConfig;
