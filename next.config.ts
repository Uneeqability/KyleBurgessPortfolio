import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the whole site out of search engines while remaining publicly
  // reachable by direct link (no password). The X-Robots-Tag response header
  // applies to every route — pages and /public assets alike — because Next
  // checks headers before the filesystem. `noindex` = don't index this URL;
  // `nofollow` = don't crawl links from it.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
