import { fromBase64Url } from "@/lib/base64url"
import {
  defaultWallOptions,
  normalizeWallState,
  type WallState,
} from "@/lib/testimonial-wall/model"

const shareVersion = "w1"
const shareHashKey = "wall"
const maxShareLength = 60_000

async function pipe(
  bytes: Uint8Array,
  stream: CompressionStream | DecompressionStream
) {
  const input = new Response(bytes as BodyInit).body
  if (!input) throw new Error("Streams are not supported")
  return new Uint8Array(
    await new Response(input.pipeThrough(stream)).arrayBuffer()
  )
}

function toBinary(bytes: Uint8Array) {
  let binary = ""
  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000))
  }
  return binary
}

function compactState(state: WallState) {
  const options: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(state.options)) {
    const fallback = defaultWallOptions[key as keyof typeof defaultWallOptions]
    if (JSON.stringify(value) !== JSON.stringify(fallback)) {
      options[key] = value
    }
  }
  return { testimonials: state.testimonials, options }
}

async function encodeWallState(state: WallState) {
  const json = JSON.stringify(compactState(state))
  const compressed = await pipe(
    new TextEncoder().encode(json),
    new CompressionStream("deflate-raw")
  )
  const base64 = btoa(toBinary(compressed))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/, "")
  return `${shareVersion}.${base64}`
}

async function decodeWallState(value: string): Promise<WallState | null> {
  if (value.length > maxShareLength) return null
  const [version, payload] = value.split(".", 2)
  if (version !== shareVersion || !payload) return null
  const bytes = fromBase64Url(payload)
  if (!bytes) return null
  try {
    const json = new TextDecoder().decode(
      await pipe(bytes, new DecompressionStream("deflate-raw"))
    )
    if (json.length > maxShareLength * 20) return null
    return normalizeWallState(JSON.parse(json))
  } catch {
    return null
  }
}

function readShareHash(hash: string) {
  const params = new URLSearchParams(hash.replace(/^#/, ""))
  return params.get(shareHashKey)
}

function shareHash(encoded: string) {
  return `#${shareHashKey}=${encoded}`
}

export {
  decodeWallState,
  encodeWallState,
  maxShareLength,
  readShareHash,
  shareHash,
}
