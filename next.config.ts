import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const RESTORA_API_URL = process.env.NEXT_PUBLIC_RESTORA_API_URL ?? "";

const nextConfig: NextConfig = {
  output: "standalone",

  transpilePackages: ["next-themes"],

  turbopack: {
    root: __dirname,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },

  async rewrites() {
    if (!RESTORA_API_URL) return [];
    return [
      {
        source: "/api/v1/public/:path*",
        destination: `${RESTORA_API_URL}/api/v1/public/:path*`,
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);