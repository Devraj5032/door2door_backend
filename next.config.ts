import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  webpack: (config, { dir }) => {
    config.snapshot = config.snapshot || {};
    config.snapshot.managedPaths = [path.join(dir, "node_modules")];

    // Restrict file resolution to your project only
    config.resolve.modules = [path.resolve(dir, "src"), "node_modules"];

    // Stop following symlinks outside your project
    config.resolve.symlinks = false;

    // Ignore common project-local folders only
    config.watchOptions = {
      ignored: ['**/node_modules/**', '**/.git/**'],
    };

    return config;
  },
};

export default nextConfig;
