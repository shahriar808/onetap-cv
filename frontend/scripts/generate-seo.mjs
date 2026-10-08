import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const siteUrl = process.env.VITE_SITE_URL?.replace(/\/$/, '')
if (!siteUrl || !URL.canParse(siteUrl) || !siteUrl.startsWith('https://')) {
  console.warn('VITE_SITE_URL is unset; sitemap.xml and robots.txt were not generated.')
  process.exit(0)
}

const output = resolve('dist')
await mkdir(output, { recursive: true })
await writeFile(
  resolve(output, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${siteUrl}/</loc></url><url><loc>${siteUrl}/privacy</loc></url></urlset>\n`,
)
await writeFile(
  resolve(output, 'robots.txt'),
  `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`,
)
