import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/beni": ["./lib/beni-ai/knowledge.md"],
    "/": ["./content/notes/**/*"],
    "/notes/[slug]": ["./content/notes/**/*"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lastfm.freetls.fastly.net" },
      { protocol: "https", hostname: "lastfm-img.freetls.fastly.net" },
    ],
  },
};

export default nextConfig;
