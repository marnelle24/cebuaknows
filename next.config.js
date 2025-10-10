/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable SSR for client-only components to prevent hydration issues
  experimental: {
    esmExternals: true,
  },
  // Optimize for client-side rendering
  swcMinify: true,
  // Enable React strict mode
  reactStrictMode: true,
  // Image optimization
  images: {
    domains: [],
    unoptimized: false,
  },
}

module.exports = nextConfig

