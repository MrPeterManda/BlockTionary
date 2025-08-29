/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Explicitly set project root for Vercel builds
  experimental: {
    appDir: true,
    externalDir: true
  }
};

module.exports = nextConfig;