/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export: the prod frontend is served entirely by nginx (no Node
  // runtime needed for the frontend container). All data fetching happens
  // client-side via tRPC, so a fully static export works fine here.
  output: 'export',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
