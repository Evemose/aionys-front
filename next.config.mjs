/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'http://localhost:8080/'
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
