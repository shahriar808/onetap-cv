import sharp from 'sharp'

await sharp('public/og.svg')
  .resize(1200, 630, { fit: 'fill' })
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile('public/og.png')
