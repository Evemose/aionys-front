/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'host.docker.internal'
            }
        ]
    },
    logging: {
        level: 'trace',
        fetches: {
            fullUrl: true,
        }
    }
};

export default nextConfig;
