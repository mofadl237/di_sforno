import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

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
    const apiUrl = process.env.NEXT_PUBLIC_RESTORA_API_URL;

    if (!apiUrl) return [];

    return [
      {
        source: "/api/v1/public/:path*",
        destination: `${apiUrl}/api/v1/public/:path*`,
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);