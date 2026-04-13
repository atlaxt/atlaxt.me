import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import sharp from 'sharp'

const rawArgs = process.argv.slice(2)
const args = new Set(rawArgs)

const force = args.has('--force')
const recursive = !args.has('--no-recursive')
const copyOnly = args.has('--copy')

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

const srcDir = path.resolve(projectRoot, srcFlag ?? path.join('temp', 'previews'))
const destDir = path.resolve(projectRoot, destFlag ?? path.join('public', 'previews'))

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

async function shouldConvert(src, dest) {
  if (force)
    return true
  if (!await exists(dest))
    return true
  const [srcStat, destStat] = await Promise.all([fs.stat(src), fs.stat(dest)])
  return destStat.mtimeMs < srcStat.mtimeMs
}

async function ensureDirForFile(filePath) {
  const dir = path.dirname(filePath)
  await fs.mkdir(dir, { recursive: true })
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

async function convertFile(srcPath) {
  const ext = path.extname(srcPath).toLowerCase()
  if (passThroughExts.has(ext)) {
    const rel = path.relative(srcDir, srcPath)
    const destPath = path.join(destDir, rel)

    if (!force && await exists(destPath)) {
      if (!copyOnly)
        await fs.unlink(srcPath)
      return { srcPath, destPath, status: 'up-to-date' }
    }

    if (copyOnly) {
      await ensureDirForFile(destPath)
      await fs.copyFile(srcPath, destPath)
      return { srcPath, destPath, status: 'converted' }
    }

    await moveFile(srcPath, destPath)
    return { srcPath, destPath, status: 'converted' }
  }

  if (!convertibleExts.has(ext))
    return { srcPath, status: 'skipped' }

  const rel = path.relative(srcDir, srcPath)
  const destRel = `${rel.slice(0, -ext.length)}.webp`
  const destPath = path.join(destDir, destRel)

  if (!await shouldConvert(srcPath, destPath)) {
    if (!copyOnly)
      await fs.unlink(srcPath)
    return { srcPath, destPath, status: 'up-to-date' }
  }

  await ensureDirForFile(destPath)

  await sharp(srcPath)
    .webp({ quality: 82 })
    .toFile(destPath)

  if (!copyOnly)
    await fs.unlink(srcPath)

  return { srcPath, destPath, status: 'converted' }
}

async function main() {
  const dirExists = await exists(srcDir)
  if (!dirExists) {
    if (!srcFlag) {
      await fs.mkdir(srcDir, { recursive: true })
      console.log(`[convert-previews-to-webp] Created: ${path.relative(projectRoot, srcDir)}`)
      console.log('[convert-previews-to-webp] Put images in ./temp/previews and re-run. Nothing to do yet.')
      return
    }

    console.error(`[convert-previews-to-webp] Source directory not found: ${srcDir}`)
    process.exitCode = 1
    return
  }

  await fs.mkdir(destDir, { recursive: true })

  const allFiles = await walk(srcDir)
  const candidates = allFiles.filter((f) => {
    const ext = path.extname(f).toLowerCase()
    return convertibleExts.has(ext) || passThroughExts.has(ext)
  })

  let converted = 0
  let skipped = 0
  let upToDate = 0
  let failed = 0

  for (const file of candidates) {
    try {
      const res = await convertFile(file)
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
