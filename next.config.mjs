/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'https://cdn.worldvectorlogo.com/'
            }
        ]
    }
};

export default nextConfig;
