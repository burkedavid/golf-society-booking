/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs']
  },
  // Disable static optimization for API routes that use database
  async rewrites() {
    return []
  }
}

module.exports = nextConfig 