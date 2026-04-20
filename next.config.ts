import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "peerlist.io",
        pathname: "/api/v1/projects/embed/**",
      },
    ],
  },
};

export default nextConfig;
