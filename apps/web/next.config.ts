import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@remo-code/adapters", "@remo-code/sdk"],
};

export default nextConfig;
