import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import sharp from 'sharp'

const rawArgs = process.argv.slice(2)
const args = new Set(rawArgs)

const force = args.has('--force')
const recursive = !args.has('--no-recursive')
const copyOnly = args.has('--copy')
const maxWidthRaw = Number.parseInt(readFlagValue('--max-width') ?? '2400', 10)
const maxWidth = Number.isFinite(maxWidthRaw) ? maxWidthRaw : 2400

function readFlagValue(flag) {
  const withEquals = rawArgs.find(a => a.startsWith(`${flag}=`))
  if (withEquals)
    return withEquals.slice(flag.length + 1)
  const idx = rawArgs.indexOf(flag)
  if (idx !== -1 && rawArgs[idx + 1] && !rawArgs[idx + 1].startsWith('--'))
    return rawArgs[idx + 1]
  return null
}

const projectRoot = process.cwd()

const srcFlag = readFlagValue('--src')
const destFlag = readFlagValue('--dest')

const defaultSrcCandidates = [
  path.join('temp', 'photos'),
  path.join('public', 'photos', 'temp'),
  'temp',
]

const srcDir = path.resolve(projectRoot, srcFlag ?? defaultSrcCandidates[0] ?? path.join('temp', 'photos'))
const destDir = path.resolve(projectRoot, destFlag ?? path.join('public', 'photos'))

const convertibleExts = new Set(['.png', '.jpg', '.jpeg'])
const passThroughExts = new Set(['.webp'])

async function exists(p) {
  try {
    await fs.access(p)
    return true
  }
  catch {
    return false
  }
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (recursive)
        files.push(...await walk(fullPath))
      continue
    }
    if (entry.isFile())
      files.push(fullPath)
  }
  return files
}

async function ensureDirForFile(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
}

async function moveFile(src, dest) {
  await ensureDirForFile(dest)
  try {
    await fs.rename(src, dest)
  }
  catch (err) {
    if (err && typeof err === 'object' && err.code === 'EXDEV') {
      await fs.copyFile(src, dest)
      await fs.unlink(src)
      return
    }
    throw err
  }
}

async function shouldWrite(src, dest) {
  if (force)
    return true
  if (!await exists(dest))
    return true
  const [srcStat, destStat] = await Promise.all([fs.stat(src), fs.stat(dest)])
  return destStat.mtimeMs < srcStat.mtimeMs
}

async function writeWebp(srcPath, destPath) {
  if (!await shouldWrite(srcPath, destPath))
    return { destPath, status: 'up-to-date' }

  await ensureDirForFile(destPath)
  await sharp(srcPath)
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(destPath)
  return { destPath, status: 'written' }
}

async function processPhoto(srcPath, baseDir) {
  const ext = path.extname(srcPath).toLowerCase()
  const rel = path.relative(baseDir, srcPath)
  const relNoExt = rel.slice(0, -ext.length)

  const destPath = path.join(destDir, `${relNoExt}.webp`)

  if (passThroughExts.has(ext)) {
    if (await shouldWrite(srcPath, destPath)) {
      if (copyOnly) {
        await ensureDirForFile(destPath)
        await fs.copyFile(srcPath, destPath)
      }
      else {
        await moveFile(srcPath, destPath)
      }
    }
    else if (!copyOnly) {
      await fs.unlink(srcPath)
    }

    return { srcPath, destPath, status: 'converted' }
  }

  if (!convertibleExts.has(ext))
    return { srcPath, status: 'skipped' }

  await writeWebp(srcPath, destPath)

  if (!copyOnly)
    await fs.unlink(srcPath)

  return { srcPath, destPath, status: 'converted' }
}

async function main() {
  let effectiveSrcDir = srcDir

  if (!srcFlag) {
    const firstExisting = await (async () => {
      for (const rel of defaultSrcCandidates) {
        const abs = path.resolve(projectRoot, rel)
        if (await exists(abs))
          return abs
      }
      return null
    })()

    if (firstExisting) {
      effectiveSrcDir = firstExisting
    }
    else {
      const primary = path.resolve(projectRoot, defaultSrcCandidates[0] ?? path.join('public', 'photos', 'temp'))
      await fs.mkdir(primary, { recursive: true })
      console.log(`[convert:photos] Created: ${path.relative(projectRoot, primary)}`)
      console.log('[convert:photos] Put images in temp/photos and re-run. Nothing to do yet.')
      return
    }
  }
  else {
    const dirExists = await exists(effectiveSrcDir)
    if (!dirExists) {
      console.error(`[convert:photos] Source directory not found: ${effectiveSrcDir}`)
      process.exitCode = 1
      return
    }
  }

  await fs.mkdir(destDir, { recursive: true })

  const allFiles = await walk(effectiveSrcDir)
  const candidates = allFiles.filter((f) => {
    const ext = path.extname(f).toLowerCase()
    return convertibleExts.has(ext) || passThroughExts.has(ext)
  })

  let converted = 0
  let upToDate = 0
  let skipped = 0
  let failed = 0

  for (const file of candidates) {
    try {
      const res = await processPhoto(file, effectiveSrcDir)
      if (res.status === 'converted') {
        converted += 1
        console.log(`converted: ${path.relative(projectRoot, res.destPath)}`)
      }
      else if (res.status === 'up-to-date') {
        upToDate += 1
      }
      else {
        skipped += 1
      }
    }
    catch (err) {
      failed += 1
      console.error(`failed: ${path.relative(projectRoot, file)}`)
      console.error(err)
    }
  }

  console.log(`done: converted=${converted} upToDate=${upToDate} skipped=${skipped} failed=${failed}`)
  if (failed > 0)
    process.exitCode = 1
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
