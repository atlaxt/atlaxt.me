<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import signSvgRaw from '@/assets/sign_white.svg?raw'
import { useColorMode } from '@/composables/useColorMode'
import { oncePerLoad } from '@/runtimeFlags'

const wrapRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const { isDark } = useColorMode()

const REPEL_RADIUS = 55
const REPEL_FORCE = 1.6
const SPRING = 0.007 // çok düşük → yavaş, organik dönüş
const DAMPING = 0.94 // biraz daha fazla sürtünme → yavaş hareket

// Hedef noktasından uzaklaştıkça saydamlaşsın; biraz ötesinde tamamen kaybolsun
const ALPHA_FADE_OUT_DIST = 700

// İlk yükleme animasyonu: en geç 2sn içinde son parçacık da yerine gelsin
const INTRO_TOTAL_MS = 2000
const INTRO_DELAY_MAX_MS = 600
const INTRO_MOVE_MS = INTRO_TOTAL_MS - INTRO_DELAY_MAX_MS
const INTRO_SPRING = 0.04
const INTRO_DAMPING = 0.9

// Canvas'ı konteynerden büyük çiz → parçacıklar kenarlarda kırpılmasın
const CANVAS_BLEED_PX = 360
const SCALE = 0.78
const OFFSCREEN = 700

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3
}

// SVG'den ana path'i ve transform'u parse et
function parseSvgPath() {
  const parser = new DOMParser()
  const doc = parser.parseFromString(signSvgRaw, 'image/svg+xml')
  const path = doc.querySelector('path[fill="#F1F1F1"]')
  const d = path?.getAttribute('d') ?? ''
  const t = path?.getAttribute('transform') ?? ''
  // Not: daha dar bir pattern → regexp backtracking riskini azaltır
  const m = t.match(/translate\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)/)
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
  hx: number
  hy: number
  x: number
  y: number
  vx = 0
  vy = 0
  size: number
  baseAlpha: number

  introStartAt = 0
  introEndAt = 0
  introSnapped = false

  constructor(hx: number, hy: number) {
    this.hx = hx
    this.hy = hy
    // spawn() ile ilk konum set edilecek
    this.x = hx
    this.y = hy
    this.size = Math.random() * 1.4 + 0.4
    this.baseAlpha = Math.random() * 0.35 + 0.5
  }

  spawn(ox: number, oy: number, canvasW: number, canvasH: number, startAt: number, endAt: number) {
    const homeX = this.hx + ox
    const homeY = this.hy + oy

    // Ekranın dışından, çok daha uzaktan gelsin
    const angle = Math.random() * Math.PI * 2
    // Başlangıç mesafesi (kısaltıldı)
    const dist = Math.max(canvasW, canvasH) * 0.4
    this.x = homeX + Math.cos(angle) * dist
    this.y = homeY + Math.sin(angle) * dist

    this.vx = (Math.random() - 0.5) * 2
    this.vy = (Math.random() - 0.5) * 2

    this.introStartAt = startAt
    this.introEndAt = endAt
    this.introSnapped = false
  }

  setToHome(ox: number, oy: number) {
    this.x = this.hx + ox
    this.y = this.hy + oy
    this.vx = 0
    this.vy = 0
    this.introStartAt = 0
    this.introEndAt = 0
    this.introSnapped = true
  }

  update(mx: number, my: number, ox: number, oy: number, now: number) {
    if (now < this.introStartAt)
      return

    const homeX = this.hx + ox
    const homeY = this.hy + oy

    const introDuration = Math.max(1, this.introEndAt - this.introStartAt)
    const rawT = (now - this.introStartAt) / introDuration
    const introT = clamp(rawT, 0, 1)

    // En geç 2sn içinde garantili olarak yerine otursun
    if (introT >= 1 && !this.introSnapped) {
      this.x = homeX
      this.y = homeY
      this.vx = 0
      this.vy = 0
      this.introSnapped = true
    }

    const inIntro = !this.introSnapped && introT < 1
    const easedT = inIntro ? easeOutCubic(introT) : 1
    const spring = inIntro ? lerp(INTRO_SPRING, SPRING, easedT) : SPRING
    const damping = inIntro ? lerp(INTRO_DAMPING, DAMPING, easedT) : DAMPING

    // Intro bitene kadar repel uygulama (yerine varmayı bozmasın)
    if (!inIntro) {
      const dx = mx - this.x
      const dy = my - this.y
      const dist = Math.hypot(dx, dy)
      if (dist < REPEL_RADIUS && dist > 0) {
        const f = (REPEL_RADIUS - dist) / REPEL_RADIUS
        const a = Math.atan2(dy, dx)
        this.vx -= Math.cos(a) * f * REPEL_FORCE
        this.vy -= Math.sin(a) * f * REPEL_FORCE
      }
    }

    this.vx += (homeX - this.x) * spring
    this.vy += (homeY - this.y) * spring
    this.vx *= damping
    this.vy *= damping
    this.x += this.vx
    this.y += this.vy
  }

  draw(ctx: CanvasRenderingContext2D, ox: number, oy: number, dark: boolean) {
    const dx = this.x - (this.hx + ox)
    const dy = this.y - (this.hy + oy)
    const homeDist = Math.hypot(dx, dy)
    const glow = Math.min(homeDist / 15, 1)

    // 0..1: yakında 1, uzakta 0 (biraz yumuşatılmış)
    const fade = clamp(1 - homeDist / ALPHA_FADE_OUT_DIST, 0, 1) ** 2

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
    const alpha = Math.min(this.baseAlpha + glow * 0.3, 1) * fade
    if (alpha <= 0.001)
      return
    ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`
    ctx.fill()
  }
}

onMounted(() => {
  const wrap = wrapRef.value!
  const canvas = canvasRef.value!
  const ctx = canvas.getContext('2d')!

  const rawPts = buildParticlePoints()
  const xs = rawPts.map(p => p[0])
  const ys = rawPts.map(p => p[1])
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const shapeW = maxX - minX
  const shapeH = maxY - minY

  let offsetX = 0
  let offsetY = 0

  function resize() {
    const w = wrap.offsetWidth + CANVAS_BLEED_PX * 2
    const h = wrap.offsetHeight + CANVAS_BLEED_PX * 2

    canvas.style.left = `${-CANVAS_BLEED_PX}px`
    canvas.style.top = `${-CANVAS_BLEED_PX}px`
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    canvas.width = w
    canvas.height = h

    offsetX = canvas.width / 2 - minX - shapeW / 2
    offsetY = canvas.height / 2 - minY - shapeH / 2
  }
  resize()

  const particles = rawPts.map(([x, y]) => new Particle(x, y))

  const shouldRunIntro = oncePerLoad('signParticle:intro:v1')

  if (shouldRunIntro) {
    const introBase = performance.now()
    const lastIndex = Math.max(1, particles.length - 1)
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]!
      // Deterministik gecikme → son parçacık da 600ms içinde başlar, 2sn içinde yerine oturur
      const baseDelay = (i / lastIndex) * INTRO_DELAY_MAX_MS
      const jitter = (Math.random() - 0.5) * 120
      const delay = clamp(baseDelay + jitter, 0, INTRO_DELAY_MAX_MS)
      const startAt = introBase + delay
      const endAt = startAt + INTRO_MOVE_MS
      p.spawn(offsetX, offsetY, canvas.width, canvas.height, startAt, endAt)
    }
  }
  else {
    for (const p of particles)
      p.setToHome(offsetX, offsetY)
  }
  const mouse = { x: -9999, y: -9999 }

  function onMove(e: MouseEvent) {
    // Sadece imzanın kendi alanındayken etkileşime girsin
    const wr = wrap.getBoundingClientRect()
    const inside = e.clientX >= wr.left && e.clientX <= wr.right && e.clientY >= wr.top && e.clientY <= wr.bottom
    if (!inside) {
      mouse.x = -9999
      mouse.y = -9999
      return
    }

    const cr = canvas.getBoundingClientRect()
    mouse.x = e.clientX - cr.left
    mouse.y = e.clientY - cr.top
  }
  function onLeave() {
    mouse.x = -9999
    mouse.y = -9999
  }

  // Canvas pointer-events:none olacağı için mouse'u globalden takip ediyoruz
  window.addEventListener('mousemove', onMove, { passive: true })
  window.addEventListener('blur', onLeave)
  window.addEventListener('resize', resize)

  let animId: number
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const dark = isDark.value

    const now = performance.now()

    for (const p of particles) {
      p.update(mouse.x, mouse.y, offsetX, offsetY, now)
      p.draw(ctx, offsetX, offsetY, dark)
    }

    animId = requestAnimationFrame(animate)
  }
  animate()

  onUnmounted(() => {
    cancelAnimationFrame(animId)
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('blur', onLeave)
    window.removeEventListener('resize', resize)
  })
})
</script>

<template>
  <div ref="wrapRef" class="relative w-full h-full overflow-visible pointer-events-none">
    <canvas ref="canvasRef" class="absolute overflow-visible pointer-events-none" />
  </div>
</template>
