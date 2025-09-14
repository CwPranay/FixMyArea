import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  // Ensure proper handling of i18n routes on Vercel
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
    images: {
    domains: ['source.unsplash.com','media.istockphoto.com'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
     
  },
  
};

export default withNextIntl(nextConfig);
