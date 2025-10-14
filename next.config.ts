import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ❌ WARNING: This allows production builds to complete even if there are type errors.
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.watchOptions = {
      ignored: ['**/Application Data/**', '**/AppData/**'],
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
