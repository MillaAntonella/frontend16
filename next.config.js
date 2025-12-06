/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  // Asegura que las páginas con useSearchParams sean dinámicas
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
}

module.exports = nextConfig
