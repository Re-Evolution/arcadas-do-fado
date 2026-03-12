import { NextResponse } from 'next/server'

const siteUrl = 'https://arcadasdofado.com'
const locales = ['pt', 'en', 'fr', 'de', 'es']

const staticPages = [
  { path: '', priority: '1.0', changefreq: 'weekly' },
  { path: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms-of-service', priority: '0.3', changefreq: 'yearly' },
  { path: '/cookie-policy', priority: '0.3', changefreq: 'yearly' },
  { path: '/cancellation-policy', priority: '0.3', changefreq: 'yearly' },
]

export function GET() {
  const urls = staticPages.flatMap(({ path, priority, changefreq }) => {
    const alternates = locales
      .map((loc) => `    <xhtml:link rel="alternate" hreflang="${loc}" href="${siteUrl}/${loc}${path}"/>`)
      .join('\n')
    const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/pt${path}"/>`

    return locales.map((loc) => `  <url>
    <loc>${siteUrl}/${loc}${path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${alternates}
${xDefault}
  </url>`)
  })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' },
  })
}
