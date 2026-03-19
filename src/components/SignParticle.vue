<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import signSvgRaw from '@/assets/sign_white.svg?raw'
import { useColorMode } from '@/composables/useColorMode'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const { isDark } = useColorMode()

const REPEL_RADIUS = 55
const REPEL_FORCE = 1.6
const SPRING = 0.007 // çok düşük → yavaş, organik dönüş
const DAMPING = 0.94 // biraz daha fazla sürtünme → yavaş hareket
const SCALE = 0.78
const OFFSCREEN = 700

// SVG'den ana path'i ve transform'u parse et
function parseSvgPath() {
  const parser = new DOMParser()
  const doc = parser.parseFromString(signSvgRaw, 'image/svg+xml')
  const path = doc.querySelector('path[fill="#F1F1F1"]')
  const d = path?.getAttribute('d') ?? ''
  const t = path?.getAttribute('transform') ?? ''
  const m = t.match(/translate\(\s*([^,]+),\s*([^)]+)\)/)
  return {
    d,
    tx: m ? Number.parseFloat(m[1] ?? '332') : 332,
    ty: m ? Number.parseFloat(m[2] ?? '9') : 9,
  }
}

// Offscreen canvas'a path'i çiz, piksel örnekle
function buildParticlePoints(): [number, number][] {
  const { d, tx, ty } = parseSvgPath()

  const off = document.createElement('canvas')
  off.width = OFFSCREEN
  off.height = OFFSCREEN
  const octx = off.getContext('2d')!

  octx.save()
  octx.translate(tx * SCALE + (OFFSCREEN - 589 * SCALE) / 2, ty * SCALE)
  octx.scale(SCALE, SCALE)
  octx.strokeStyle = '#fff'
  octx.lineWidth = 14
  octx.lineJoin = 'round'
  octx.lineCap = 'round'
  octx.stroke(new Path2D(d))
  octx.restore()

  const data = octx.getImageData(0, 0, OFFSCREEN, OFFSCREEN).data
  const pts: [number, number][] = []
  const STEP = 4
  for (let y = 0; y < OFFSCREEN; y += STEP) {
    for (let x = 0; x < OFFSCREEN; x += STEP) {
      if ((data[(y * OFFSCREEN + x) * 4 + 3] ?? 0) > 128)
        pts.push([x, y])
    }
  }

  return pts
}

class Particle {
  hx: number; hy: number
  x: number; y: number
  vx = 0; vy = 0
  size: number
  baseAlpha: number
  delay: number

  constructor(hx: number, hy: number, canvasW: number, canvasH: number) {
    this.hx = hx; this.hy = hy
    // Home'dan biraz uzakta, rastgele yönde başla
    const angle = Math.random() * Math.PI * 2
    const dist = Math.random() * 60 + 20
    this.x = hx + Math.cos(angle) * dist
    this.y = hy + Math.sin(angle) * dist
    this.vx = (Math.random() - 0.5) * 1.5
    this.vy = (Math.random() - 0.5) * 1.5
    this.size = Math.random() * 1.4 + 0.4
    this.baseAlpha = Math.random() * 0.35 + 0.5
    this.delay = 0
  }

  update(mx: number, my: number, ox: number, oy: number) {
    const dx = mx - this.x; const dy = my - this.y
    const dist = Math.hypot(dx, dy)
    if (dist < REPEL_RADIUS && dist > 0) {
      const f = (REPEL_RADIUS - dist) / REPEL_RADIUS
      const a = Math.atan2(dy, dx)
      this.vx -= Math.cos(a) * f * REPEL_FORCE
      this.vy -= Math.sin(a) * f * REPEL_FORCE
    }
    this.vx += (this.hx + ox - this.x) * SPRING
    this.vy += (this.hy + oy - this.y) * SPRING
    this.vx *= DAMPING; this.vy *= DAMPING
    this.x += this.vx; this.y += this.vy
  }

  draw(ctx: CanvasRenderingContext2D, ox: number, oy: number, dark: boolean) {
    const dx = this.x - (this.hx + ox)
    const dy = this.y - (this.hy + oy)
    const glow = Math.min(Math.hypot(dx, dy) / 15, 1)

    let r: number, g: number, b: number
    if (dark) {
      r = Math.round(210 + 45 * glow)
      g = Math.round(210 + 45 * glow)
      b = Math.round(225 + 30 * glow)
    }
    else {
      r = Math.round(30 - 15 * glow)
      g = Math.round(30 - 15 * glow)
      b = Math.round(50 - 20 * glow)
    }

    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size + glow * 0.3, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(this.baseAlpha + glow * 0.3, 1)})`
    ctx.fill()
  }
}

onMounted(() => {
  const canvas = canvasRef.value!
  const ctx = canvas.getContext('2d')!

  const rawPts = buildParticlePoints()
  const xs = rawPts.map(p => p[0]); const ys = rawPts.map(p => p[1])
  const minX = Math.min(...xs); const maxX = Math.max(...xs)
  const minY = Math.min(...ys); const maxY = Math.max(...ys)
  const shapeW = maxX - minX; const shapeH = maxY - minY

  let offsetX = 0; let offsetY = 0

  function resize() {
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    offsetX = canvas.width / 2 - minX - shapeW / 2
    offsetY = canvas.height / 2 - minY - shapeH / 2
  }
  resize()

  const particles = rawPts.map(([x, y]) => new Particle(x, y, canvas.width, canvas.height))
  const mouse = { x: -9999, y: -9999 }

  function onMove(e: MouseEvent) {
    const r = canvas.getBoundingClientRect()
    mouse.x = e.clientX - r.left
    mouse.y = e.clientY - r.top
  }
  function onLeave() {
    mouse.x = -9999; mouse.y = -9999
  }

  canvas.addEventListener('mousemove', onMove)
  canvas.addEventListener('mouseleave', onLeave)
  window.addEventListener('resize', resize)

  let animId: number
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const dark = isDark.value

    for (const p of particles) {
      p.update(mouse.x, mouse.y, offsetX, offsetY)
      p.draw(ctx, offsetX, offsetY, dark)
    }

    animId = requestAnimationFrame(animate)
  }
  animate()

  onUnmounted(() => {
    cancelAnimationFrame(animId)
    canvas.removeEventListener('mousemove', onMove)
    canvas.removeEventListener('mouseleave', onLeave)
    window.removeEventListener('resize', resize)
  })
})
</script>

<template>
  <canvas ref="canvasRef" class="w-full h-full" />
</template>
