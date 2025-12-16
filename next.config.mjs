/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['img.clerk.com', 'utfs.io'],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizeCss: false,
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
}
  
export default nextConfig;