// next.config.js
module.exports = {
    images: {
        domains: ["i.scdn.co"],
    },

    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"],
        });
        return config;
    },
};
