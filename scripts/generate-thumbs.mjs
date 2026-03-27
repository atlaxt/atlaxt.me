import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const srcDir = path.resolve(__dirname, '../public/photos')
const outDir = path.resolve(__dirname, '../public/photos/thumbs')

fs.mkdirSync(outDir, { recursive: true })

const files = fs.readdirSync(srcDir).filter(f => /\.(jpg|jpeg|png)$/i.test(f))

for (const file of files) {
  const src = path.join(srcDir, file)
  const out = path.join(outDir, file)

  if (fs.existsSync(out)) {
    console.log(`${file}: zaten var, atlandı`)
    continue
  }

  const before = fs.statSync(src).size

  await sharp(src)
    .resize({ width: 1400, withoutEnlargement: true })
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(out)

  const after = fs.statSync(out).size
  console.log(`${file}: ${(before / 1024 / 1024).toFixed(1)}MB → ${(after / 1024 / 1024).toFixed(1)}MB`)
}
