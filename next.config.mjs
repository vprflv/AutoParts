/** @type {import('next').NextConfig} */
const nextConfig = {

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
