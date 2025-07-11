/* jshint esversion: 6 */
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['firebasestorage.googleapis.com', 'lh3.googleusercontent.com'], 
    },  
    experimental: {
      serverActions: {
        bodySizeLimit: '1000MB',
      },
    },
  };
  export default withNextIntl(nextConfig);
  