import type { NextConfig } from "next";
import path from "node:path";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  output: "standalone",
  // Monorepo: evita aviso de lockfile fora desta pasta
  outputFileTracingRoot: path.join(process.cwd(), ".."),
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
