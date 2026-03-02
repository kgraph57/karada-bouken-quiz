import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/karada-bouken-quiz",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
