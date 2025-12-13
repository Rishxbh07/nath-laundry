import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development", // Disable PWA in dev mode
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  // 1. Enable Compression (Crucial for 4G/Slow Networks to fix Timeout errors)
  compress: true, 

  // 2. Reduce JS Bundle Size (Tree Shaking)
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns', 'html-to-image'],
  },

  // 3. Remove Console Logs in Production (Saves CPU)
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default withPWA(nextConfig);