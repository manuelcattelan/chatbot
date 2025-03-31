import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.API_BASE_URL ?? "http://localhost:5000"}/api/:path*`,
      },
    ];
  },
  output: "standalone",
};

module.exports = nextConfig;
