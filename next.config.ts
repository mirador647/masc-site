/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // 🔥 ignore ESLint sur Vercel
  },
};

module.exports = nextConfig;
