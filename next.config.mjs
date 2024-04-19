/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: "/the-league",
    output: 'export',
    webpack: (config, { isServer, webpack }) => {
        if (!isServer) {
            config.resolve.fallback.fs = 'empty';
        }

        config.plugins.push(
            new webpack.IgnorePlugin({
                checkResource(resource, context) {
                    if (resource.includes('/db/') && !context.includes('node_modules')) {
                        return true;
                    }
                    
                    return false;
                },
            }),
        );

        return config;
    },    
};

export default nextConfig;
