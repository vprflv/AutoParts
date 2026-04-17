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
                pathname: '/id/**',   // для твоих ссылок вида /id/1015/300/300
            },
        ],
    },

};

export default nextConfig;
