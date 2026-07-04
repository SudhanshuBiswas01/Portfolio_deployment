/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // For a fully static export (Cloud Storage + Cloud CDN), uncomment:
  // output: 'export',
  // images: { unoptimized: true },
};
export default nextConfig;
