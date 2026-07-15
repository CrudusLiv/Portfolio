// Pure scene math for the space canvases (starfield + solar system).
// No React, no canvas context — keeps this unit-testable in jsdom.

export interface Star {
  /** Position as fraction of canvas size (0..1) so layers survive resize. */
  x: number
  y: number
  /** Radius in CSS pixels. */
  size: number
  baseAlpha: number
  twinkleAmp: number
  twinklePhase: number
  /** Radians per second. */
  twinkleSpeed: number
  /** Bright stars get a soft glow sprite instead of a plain dot. */
  bright: boolean
}

export interface StarLayer {
  stars: Star[]
  /** Fraction of scrollY this layer moves by (depth illusion). */
  parallax: number
  /** Horizontal drift in CSS px per second. */
  drift: number
}

/** Deterministic PRNG — same seed, same sky, every visit. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const STARFIELD_SEED = 20260714

/** Total star budget scaled by viewport area, clamped for phones/ultrawides. */
export function starCount(width: number, height: number): number {
  return Math.round(Math.min(400, Math.max(120, (width * height) / 9000)))
}

const LAYER_SHARES = [
  { share: 0.5, parallax: 0.02, drift: 0.6, sizeRange: [0.4, 0.9], alphaRange: [0.2, 0.5] },
  { share: 0.3, parallax: 0.05, drift: 1.2, sizeRange: [0.7, 1.3], alphaRange: [0.3, 0.65] },
  { share: 0.2, parallax: 0.1, drift: 2.2, sizeRange: [1.0, 1.8], alphaRange: [0.45, 0.85] },
] as const

export function createStarLayers(width: number, height: number, rng: () => number = mulberry32(STARFIELD_SEED)): StarLayer[] {
  const total = starCount(width, height)
  return LAYER_SHARES.map(({ share, parallax, drift, sizeRange, alphaRange }) => {
    const count = Math.round(total * share)
    const stars: Star[] = Array.from({ length: count }, () => {
      const baseAlpha = alphaRange[0] + rng() * (alphaRange[1] - alphaRange[0])
      return {
        x: rng(),
        y: rng(),
        size: sizeRange[0] + rng() * (sizeRange[1] - sizeRange[0]),
        baseAlpha,
        twinkleAmp: baseAlpha * (0.25 + rng() * 0.45),
        twinklePhase: rng() * Math.PI * 2,
        twinkleSpeed: 0.3 + rng() * 1.4,
        bright: rng() < 0.15,
      }
    })
    return { stars, parallax, drift }
  })
}

export interface OrbitSpec {
  /** Semi-major axis as a fraction of min(canvas width, height). */
  radius: number
  /** Ellipse squash: semi-minor = radius * squash. */
  squash: number
  /** Radians per second (negative = retrograde). */
  speed: number
  /** Planet radius in CSS px. */
  size: number
  /** Palette token the component resolves at mount. */
  color: 'accent' | 'glow' | 'foreground'
  /** Starting angle in radians. */
  phase: number
  /** Trail length in sampled positions. */
  trail: number
}

export const PLANETS: OrbitSpec[] = [
  { radius: 0.16, squash: 0.42, speed: 0.42, size: 2.4, color: 'glow', phase: 0.8, trail: 14 },
  { radius: 0.26, squash: 0.44, speed: 0.27, size: 3.4, color: 'accent', phase: 2.6, trail: 18 },
  { radius: 0.37, squash: 0.46, speed: 0.18, size: 2.8, color: 'foreground', phase: 4.4, trail: 16 },
  { radius: 0.49, squash: 0.48, speed: 0.12, size: 4.2, color: 'accent', phase: 5.7, trail: 22 },
  { radius: 0.62, squash: 0.5, speed: 0.08, size: 3.0, color: 'glow', phase: 1.9, trail: 20 },
]

/** Shared tilt so all orbits read as one ecliptic plane. */
export const ORBIT_TILT = -0.28

export interface Point {
  x: number
  y: number
}

/** Position on a tilted ellipse centered at (cx, cy); scale = min(w, h). */
export function orbitPoint(spec: OrbitSpec, angle: number, cx: number, cy: number, scale: number, tilt: number = ORBIT_TILT): Point {
  const a = spec.radius * scale
  const b = a * spec.squash
  const ex = Math.cos(angle) * a
  const ey = Math.sin(angle) * b
  const cos = Math.cos(tilt)
  const sin = Math.sin(tilt)
  return {
    x: cx + ex * cos - ey * sin,
    y: cy + ex * sin + ey * cos,
  }
}

/** Cap device pixel ratio — retina fidelity is invisible for 1px stars. */
export function clampDpr(dpr: number, isSmallViewport: boolean): number {
  return Math.min(dpr, isSmallViewport ? 1.5 : 2)
}

/** Parse #RGB/#RRGGBB into an `r, g, b` string for rgba() interpolation. */
export function hexToRgb(hex: string): string {
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16)
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`
}
