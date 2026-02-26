import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard", "/modules", "/profile", "/settings", "/achievements", "/leaderboard", "/invest", "/hustle", "/games"],
      },
    ],
    sitemap: "https://kapaiputea.com/sitemap.xml",
  };
}
