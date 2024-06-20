/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    defaultLocale: 'pt',
    locales: ['pt', 'en']
  },
  images: {
    domains: ['globo-aplauso.s3.amazonaws.com']
  },
  env: {
    API_URL: process.env.API_URL,
    NEXT_GTM_ID: process.env.NEXT_GTM_ID
  }
};

module.exports = nextConfig;
