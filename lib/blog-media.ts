import { existsSync, readFileSync } from "node:fs"
import path from "node:path"

type ImageSize = { width: number; height: number }

const publicDir = path.join(process.cwd(), "public")
const scale = 2

function publicFile(src: string) {
  if (!src.startsWith("/") || src.startsWith("//")) {
    throw new Error(`blog: image ${src} must be a site path under public/`)
  }
  return path.join(publicDir, src)
}

function webpSize(data: Buffer): ImageSize | undefined {
  const chunk = data.toString("ascii", 12, 16)
  if (chunk === "VP8X") {
    return {
      width: 1 + data.readUIntLE(24, 3),
      height: 1 + data.readUIntLE(27, 3),
    }
  }
  if (chunk === "VP8 ") {
    return {
      width: data.readUInt16LE(26) & 0x3fff,
      height: data.readUInt16LE(28) & 0x3fff,
    }
  }
  if (chunk === "VP8L") {
    const bits = data.readUInt32LE(21)
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 }
  }
  return undefined
}

function imageSize(src: string): ImageSize {
  const data = readFileSync(publicFile(src))
  let size: ImageSize | undefined
  if (data.toString("ascii", 1, 4) === "PNG") {
    size = { width: data.readUInt32BE(16), height: data.readUInt32BE(20) }
  } else if (
    data.toString("ascii", 0, 4) === "RIFF" &&
    data.toString("ascii", 8, 12) === "WEBP"
  ) {
    size = webpSize(data)
  }
  if (!size) throw new Error(`blog: can't read the size of ${src}`)
  return {
    width: Math.round(size.width / scale),
    height: Math.round(size.height / scale),
  }
}

function darkVariant(src: string) {
  const dark = src.replace(/(\.[a-z]+)$/, "-dark$1")
  return existsSync(publicFile(dark)) ? dark : undefined
}

export { darkVariant, imageSize }
