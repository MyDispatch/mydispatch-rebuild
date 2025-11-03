/* ==================================================================================
   Sitemap Generator für MyDispatch
   ==================================================================================
   Generiert eine vollständige sitemap.xml mit allen relevanten URLs
   ================================================================================== */

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemap = (): string => {
  const baseUrl = 'https://www.my-dispatch.de';
  const today = new Date().toISOString().split('T')[0];

  const urls: SitemapUrl[] = [
    // Root & Marketing Pages (High Priority)
    { loc: `${baseUrl}/`, lastmod: today, changefreq: 'weekly', priority: 1.0 },
    { loc: `${baseUrl}/home`, lastmod: today, changefreq: 'weekly', priority: 1.0 },
    { loc: `${baseUrl}/pricing`, lastmod: today, changefreq: 'monthly', priority: 0.9 },
    { loc: `${baseUrl}/faq`, lastmod: today, changefreq: 'monthly', priority: 0.8 },
    { loc: `${baseUrl}/docs`, lastmod: today, changefreq: 'monthly', priority: 0.8 },
    { loc: `${baseUrl}/contact`, lastmod: today, changefreq: 'monthly', priority: 0.7 },
    
    // Legal Pages
    { loc: `${baseUrl}/impressum`, lastmod: today, changefreq: 'yearly', priority: 0.3 },
    { loc: `${baseUrl}/datenschutz`, lastmod: today, changefreq: 'yearly', priority: 0.3 },
    { loc: `${baseUrl}/agb`, lastmod: today, changefreq: 'yearly', priority: 0.3 },
    
    // Auth & Support
    { loc: `${baseUrl}/auth`, lastmod: today, changefreq: 'monthly', priority: 0.6 },
    { loc: `${baseUrl}/nexify-support`, lastmod: today, changefreq: 'monthly', priority: 0.5 },
    
    // Unternehmer-Landingpage
    { loc: `${baseUrl}/unternehmer`, lastmod: today, changefreq: 'weekly', priority: 0.7 },
  ];

  const xmlUrls = urls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority !== undefined ? `<priority>${url.priority}</priority>` : ''}
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${xmlUrls}
</urlset>`;
};

// Helper für dynamisches Sitemap-Download
export const downloadSitemap = () => {
  const sitemap = generateSitemap();
  const blob = new Blob([sitemap], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sitemap.xml';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
