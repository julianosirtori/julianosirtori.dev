const withNextIntl = require('next-intl/plugin')(
  // This is the default (also the `src` folder is supported out of the box)
  './src/locales/index.ts'
);
 
/** @type {import('next').NextConfig} */
const nextConfig = withNextIntl({
  // Other Next.js configuration ...
});


module.exports = nextConfig
