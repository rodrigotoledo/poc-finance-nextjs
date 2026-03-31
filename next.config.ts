import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import path from "node:path";

const nextConfig: NextConfig = {
  output: "standalone",
  // Monorepo: evita aviso de lockfile fora desta pasta
  outputFileTracingRoot: path.join(process.cwd(), ".."),
  // Disable file watcher to avoid @parcel/watcher issues
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
