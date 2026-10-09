import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const siteUrl = process.env.VITE_SITE_URL?.replace(/\/$/, '')
if (!siteUrl || !URL.canParse(siteUrl) || !siteUrl.startsWith('https://')) {
  console.warn('VITE_SITE_URL is unset; sitemap.xml and robots.txt were not generated.')
  process.exit(0)
}

const output = resolve('dist')
await mkdir(output, { recursive: true })
const indexPath = resolve(output, 'index.html')
let index = await readFile(indexPath, 'utf8')
index = index.replace(/\s*<meta property="og:image"[^>]*>/g, '')
  .replace(/\s*<meta name="twitter:image"[^>]*>/g, '')
  .replace(/\s*<meta property="og:image:width"[^>]*>/g, '')
  .replace(/\s*<meta property="og:image:height"[^>]*>/g, '')
  .replace(/\s*<meta property="og:url"[^>]*>/g, '')
  .replace(/\s*<link rel="canonical"[^>]*>/g, '')
if (siteUrl) {
  index = index.replace('</head>', `    <meta property="og:image" content="${siteUrl}/og.png" />\n    <meta property="og:image:width" content="1200" />\n    <meta property="og:image:height" content="630" />\n    <meta property="og:url" content="${siteUrl}/" />\n    <meta name="twitter:image" content="${siteUrl}/og.png" />\n    <link rel="canonical" href="${siteUrl}/" />\n  </head>`)
}
await writeFile(indexPath, index)
await writeFile(
  resolve(output, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${siteUrl}/</loc></url><url><loc>${siteUrl}/privacy</loc></url></urlset>\n`,
)
await writeFile(
  resolve(output, 'robots.txt'),
  `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`,
)
