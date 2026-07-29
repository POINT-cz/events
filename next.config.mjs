/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};
export default nextConfig; // (nebo module.exports = nextConfig; pokud nemáš .mjs)