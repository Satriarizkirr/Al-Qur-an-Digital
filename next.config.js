// file: next.config.js

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // PWA tidak aktif saat development (npm run dev)
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Taruh konfigurasi Next.js lain yang mungkin kamu punya di sini
};

module.exports = withPWA(nextConfig);