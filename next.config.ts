import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const repoName = 'circuit-pal'; // Replace with your repo name if different

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? `/${repoName}` : "",
  images: {
    unoptimized: true,
  },
  reactCompiler: true,
};

export default nextConfig;
