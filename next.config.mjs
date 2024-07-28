/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            allowedOrigins: ["tenant1.localhost:3000", "tenant2.localhost:3000"],
        },
    },
    reactStrictMode: false
};

export default nextConfig;
