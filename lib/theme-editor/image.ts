import { rgbToOklch, toGamut, type Oklch } from "@/lib/theme-editor/color"

type Swatch = { color: Oklch; weight: number }

type Point = { L: number; A: number; B: number; c: number }

function toPoint(color: Oklch): Point {
  const rad = (color.h * Math.PI) / 180
  return {
    L: color.l,
    A: color.c * Math.cos(rad),
    B: color.c * Math.sin(rad),
    c: color.c,
  }
}

function fromPoint({ L, A, B }: Point): Oklch {
  const c = Math.hypot(A, B)
  const h = ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360
  return toGamut({ l: L, c, h: c < 1e-4 ? 0 : h, a: 1 })
}

function distance(a: Point, b: Point) {
  return (a.L - b.L) ** 2 + (a.A - b.A) ** 2 + (a.B - b.B) ** 2
}

function extractPalette(pixels: Uint8ClampedArray, count = 6): Swatch[] {
  const points: Point[] = []
  for (let index = 0; index < pixels.length; index += 4) {
    if (pixels[index + 3] < 200) continue
    points.push(
      toPoint(
        rgbToOklch({
          r: pixels[index] / 255,
          g: pixels[index + 1] / 255,
          b: pixels[index + 2] / 255,
          a: 1,
        })
      )
    )
  }
  if (points.length === 0) return []

  const centers: Point[] = [points[Math.floor(points.length / 2)]]
  while (centers.length < Math.min(count, points.length)) {
    let best = points[0]
    let bestDistance = -1
    for (const point of points) {
      const nearest = Math.min(...centers.map((center) => distance(point, center)))
      if (nearest > bestDistance) {
        bestDistance = nearest
        best = point
      }
    }
    if (bestDistance <= 0) break
    centers.push(best)
  }

  const assignments = new Array<number>(points.length).fill(0)
  for (let round = 0; round < 12; round += 1) {
    const sums = centers.map(() => ({ L: 0, A: 0, B: 0, n: 0 }))
    points.forEach((point, index) => {
      let nearest = 0
      let nearestDistance = Infinity
      centers.forEach((center, centerIndex) => {
        const value = distance(point, center)
        if (value < nearestDistance) {
          nearestDistance = value
          nearest = centerIndex
        }
      })
      assignments[index] = nearest
      const sum = sums[nearest]
      sum.L += point.L
      sum.A += point.A
      sum.B += point.B
      sum.n += 1
    })
    sums.forEach((sum, index) => {
      if (sum.n === 0) return
      const L = sum.L / sum.n
      const A = sum.A / sum.n
      const B = sum.B / sum.n
      centers[index] = { L, A, B, c: Math.hypot(A, B) }
    })
  }

  const weights = centers.map(() => 0)
  for (const assignment of assignments) weights[assignment] += 1

  return centers
    .map((center, index) => ({
      color: fromPoint(center),
      weight: weights[index] / points.length,
    }))
    .filter((swatch) => swatch.weight > 0)
    .sort((a, b) => b.weight - a.weight)
}

function pickBrand(swatches: Swatch[]): Oklch | null {
  if (swatches.length === 0) return null
  const score = ({ color, weight }: Swatch) => {
    const extreme = color.l < 0.2 || color.l > 0.95 ? 0.15 : 1
    return color.c * Math.sqrt(weight) * extreme
  }
  const best = [...swatches].sort((a, b) => score(b) - score(a))[0]
  return best.color.c < 0.03 ? swatches[0].color : best.color
}

export { extractPalette, pickBrand, type Swatch }
