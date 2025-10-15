import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  webpack: (config, { dir }) => {
    config.snapshot = config.snapshot || {};
    config.snapshot.managedPaths = [path.join(dir, "node_modules")];

    // Restrict file resolution to your project only
    config.resolve.modules = [path.resolve(dir, "src"), "node_modules"];

    // Stop following symlinks outside your project
    config.resolve.symlinks = false;

    // Ignore system folders
    config.watchOptions = {
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        'C:/Users/**',
        '**/AppData/**',
        '**/Application Data/**',
        '**/Cookies/**',
      ],
    };

    return config;
  },
};

export default nextConfig;
