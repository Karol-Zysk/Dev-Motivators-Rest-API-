/** @type {import('next').NextConfig} */
const dotenv = require("dotenv");
dotenv.config();

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com"],
  },
  swcMinify: true,
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
