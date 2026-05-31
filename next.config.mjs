/** @type {import('next').NextConfig} */
const nextConfig = {

    eslint: {
        ignoreDuringBuilds: true,
    },


    experimental: {
        serverActions: {
            bodySizeLimit: '20mb',
        },
    },

    resolve: {
        alias: {
            "@": "/src",
            "@/src": "/src",
        },
    },

    images: {

        unoptimized: true,
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
            {
                protocol: 'https',
                hostname: '**.supabase.co',
            },
        ],
    },

};

export default nextConfig;
