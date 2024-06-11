/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'http://localhost:8080/'
            }
        ]
    },
};

export default nextConfig;
