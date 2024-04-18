/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: "/the-league",
    output: 'export',
    distDir: 'docs',
    webpack: (config, { isServer, webpack }) => {
        if (!isServer) {
            config.resolve.fallback.fs = false;
        }

        return config;
    },    
};

export default nextConfig;
