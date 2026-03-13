import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    reactCompiler: true,
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
