export async function GET() {
  const baseUrl = "https://whatif.diy";
  const lastModified = new Date().toISOString();

  // Define all your pages with their priorities and change frequencies
  const pages = [
    {
      url: "",
      lastmod: lastModified,
      changefreq: "daily",
      priority: "1.0",
    },
    {
      url: "/privacy",
      lastmod: lastModified,
      changefreq: "monthly",
      priority: "0.5",
    },
    {
      url: "/terms",
      lastmod: lastModified,
      changefreq: "monthly",
      priority: "0.5",
    },
    {
      url: "/cookies",
      lastmod: lastModified,
      changefreq: "monthly",
      priority: "0.5",
    },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${pages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "max-age=3600", // Cache for 1 hour
    },
  });
}
