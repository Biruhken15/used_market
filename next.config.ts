import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    reactCompiler: true,
    serverActions: {
      bodySizeLimit: '50mb',
      allowedOrigins: ['localhost:3000', 'ethiousedmarket.up.railway.app', 'kesewejmarket-production.up.railway.app'],
    },
  },
};

export default nextConfig;
