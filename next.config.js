const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  staticPageGenerationTimeout: 100,
  webpack: (config) => {
    // design-react-kit@4.0.2 ships its actual CommonJS bundle under dist/cjs,
    // while its package entry point references files that are not published.
    config.resolve.alias['design-react-kit$'] = path.resolve(
      __dirname,
      'node_modules/design-react-kit/dist/cjs/index.js'
    )
    return config
  },
}

module.exports = nextConfig
