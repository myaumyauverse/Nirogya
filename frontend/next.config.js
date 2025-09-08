/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8002/api/:path*', // Proxy to Backend
      },
    ]
  },
}

module.exports = nextConfig
