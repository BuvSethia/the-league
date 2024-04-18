/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    webpack: (config, { isServer, webpack }) => {
        if (!isServer) {
            config.resolve.fallback.fs = false;
        }

        return config;
    },    
};

export default nextConfig;
