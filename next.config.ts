import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    serverActions: {
      // receipt images are limited to 5MB by the API
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
