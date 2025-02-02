/* jshint esversion: 6 */

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
  
  export default nextConfig;
  