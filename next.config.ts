import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Serve the original scientific figures without a runtime image service.
  images: { unoptimized: true },
};

export default nextConfig;
