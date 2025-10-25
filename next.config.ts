import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ultimate-property-holdings.s3.us-east-1.amazonaws.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  experimental: {
    proxyClientMaxBodySize: 1024 * 1024 * 500,
    serverActions: {
      bodySizeLimit: '500mb',
    },
  },
};

export default nextConfig;
