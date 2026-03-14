#!/usr/bin/env node
// Comprime imagens JPEG/PNG em /public/images usando sharp.
// Faz backup dos originais em /public/images/_originals/
// Uso: node scripts/optimize-images.js

const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images')
const BACKUP_DIR = path.join(IMAGES_DIR, '_originals')

// Pastas a ignorar (ícones, logos — já são pequenos ou têm transparência)
const SKIP_DIRS = ['icons', 'logo', '_originals']

// Qualidade JPEG — 82 é o sweet-spot (boa qualidade, ~40-60% menor)
const JPEG_QUALITY = 82
const PNG_QUALITY = { compressionLevel: 9 }

function getAllImages(dir, results = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      const relativePart = path.relative(IMAGES_DIR, fullPath)
      const topFolder = relativePart.split(path.sep)[0]
      if (SKIP_DIRS.includes(topFolder)) continue
      getAllImages(fullPath, results)
    } else if (/\.(jpe?g|png)$/i.test(entry.name)) {
      results.push(fullPath)
    }
  }
  return results
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function backupPath(originalPath) {
  const relative = path.relative(IMAGES_DIR, originalPath)
  return path.join(BACKUP_DIR, relative)
}

async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  const backupFile = backupPath(filePath)

  // Criar backup se ainda não existe
  if (!fs.existsSync(backupFile)) {
    ensureDir(path.dirname(backupFile))
    fs.copyFileSync(filePath, backupFile)
  }

  const originalSize = fs.statSync(filePath).size
  const tmpFile = filePath + '.tmp'

  try {
    if (ext === '.jpg' || ext === '.jpeg') {
      await sharp(filePath)
        .jpeg({ quality: JPEG_QUALITY, mozjpeg: true, progressive: true })
        .toFile(tmpFile)
    } else if (ext === '.png') {
      await sharp(filePath)
        .png(PNG_QUALITY)
        .toFile(tmpFile)
    }

    const newSize = fs.statSync(tmpFile).size

    if (newSize < originalSize) {
      fs.renameSync(tmpFile, filePath)
      const saving = ((1 - newSize / originalSize) * 100).toFixed(1)
      const savedKB = ((originalSize - newSize) / 1024).toFixed(0)
      console.log(`✓ ${path.relative(IMAGES_DIR, filePath).padEnd(50)} ${(originalSize/1024).toFixed(0)}KB → ${(newSize/1024).toFixed(0)}KB  (-${saving}%, -${savedKB}KB)`)
    } else {
      fs.unlinkSync(tmpFile)
      console.log(`~ ${path.relative(IMAGES_DIR, filePath).padEnd(50)} já otimizado`)
    }
  } catch (err) {
    if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile)
    console.error(`✗ ${path.relative(IMAGES_DIR, filePath)}: ${err.message}`)
  }
}

async function main() {
  console.log('=== Otimização de Imagens — Arcadas do Fado ===\n')

  const images = getAllImages(IMAGES_DIR)
  console.log(`Encontradas ${images.length} imagens para otimizar.\n`)

  let totalBefore = 0
  let totalAfter = 0

  for (const img of images) {
    totalBefore += fs.statSync(img).size
    await optimizeImage(img)
    totalAfter += fs.statSync(img).size
  }

  const totalSaved = totalBefore - totalAfter
  const pct = ((totalSaved / totalBefore) * 100).toFixed(1)
  console.log(`\n=== Resumo ===`)
  console.log(`Antes:    ${(totalBefore / 1024 / 1024).toFixed(2)} MB`)
  console.log(`Depois:   ${(totalAfter / 1024 / 1024).toFixed(2)} MB`)
  console.log(`Poupança: ${(totalSaved / 1024 / 1024).toFixed(2)} MB (-${pct}%)`)
  console.log(`\nBackup dos originais em: public/images/_originals/`)
}

main().catch(console.error)
