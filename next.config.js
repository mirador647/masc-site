// next.config.js
const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // IMPORTANT : pas d'options invalides (ex: experimental.appDir)
  experimental: {},
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    return config;
  },
  images: { remotePatterns: [] }, // si tu affiches des images distantes, ajoute les domaines ici
};

module.exports = nextConfig;
