import { fromBase64Url, toBase64Url } from "@/lib/base64url"
import { diffProps, type Props } from "@/lib/page-builder/fields"
import { getSection, sectionProps } from "@/lib/page-builder/registry"

type ProBlockInfo = { name: string; title: string; category: string }

type PlacedSection =
  | { key: string; type: "section"; sectionId: string; props: Props }
  | { key: string; type: "pro"; name: string; title: string }

type PageDoc = { sections: PlacedSection[] }

type EncodedEntry = [string] | [string, Props]

const docVersion = "1"
const maxSections = 40
const maxEncodedLength = 8000
const maxJsonBytes = 64 * 1024
const proPrefix = "pro:"

let keySeed = 0

function newKey() {
  keySeed += 1
  return `s${Date.now().toString(36)}${keySeed.toString(36)}`
}

function placeSection(
  sectionId: string,
  overrides: unknown = {}
): PlacedSection | null {
  if (!getSection(sectionId)) return null
  return {
    key: newKey(),
    type: "section",
    sectionId,
    props: sectionProps(sectionId, overrides),
  }
}

function placePro(block: ProBlockInfo): PlacedSection {
  return { key: newKey(), type: "pro", name: block.name, title: block.title }
}

function toEntries(doc: PageDoc): EncodedEntry[] {
  return doc.sections.slice(0, maxSections).map((placed) => {
    if (placed.type === "pro") return [`${proPrefix}${placed.name}`]
    const section = getSection(placed.sectionId)
    if (!section) return [placed.sectionId]
    const diff = diffProps(section.fields, placed.props, section.defaults)
    return Object.keys(diff).length
      ? [placed.sectionId, diff]
      : [placed.sectionId]
  })
}

function fromEntries(
  value: unknown,
  proBlocks: ProBlockInfo[]
): PageDoc | null {
  if (typeof value !== "object" || value === null) return null
  const entries = (value as { s?: unknown }).s
  if (!Array.isArray(entries)) return null
  const placed: PlacedSection[] = []
  for (const entry of entries.slice(0, maxSections)) {
    if (!Array.isArray(entry) || typeof entry[0] !== "string") continue
    const id = entry[0]
    if (id.startsWith(proPrefix)) {
      const block = proBlocks.find(
        (item) => item.name === id.slice(proPrefix.length)
      )
      if (block) placed.push(placePro(block))
      continue
    }
    const section = placeSection(id, entry[1] ?? {})
    if (section) placed.push(section)
  }
  return { sections: placed }
}

async function pipe(
  bytes: Uint8Array,
  stream: CompressionStream | DecompressionStream
) {
  const writer = stream.writable.getWriter()
  void writer.write(bytes as Uint8Array<ArrayBuffer>).catch(() => {})
  void writer.close().catch(() => {})
  const reader = stream.readable.getReader()
  const chunks: Uint8Array[] = []
  let total = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    total += value.byteLength
    if (total > maxJsonBytes) {
      await reader.cancel()
      return null
    }
    chunks.push(value)
  }
  const out = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) {
    out.set(chunk, offset)
    offset += chunk.byteLength
  }
  return out
}

async function encodeDoc(doc: PageDoc) {
  const json = JSON.stringify({ s: toEntries(doc) })
  const compressed = await pipe(
    new TextEncoder().encode(json),
    new CompressionStream("deflate-raw")
  )
  return `${docVersion}${toBase64Url(compressed ?? new Uint8Array())}`
}

async function decodeDoc(
  encoded: string,
  proBlocks: ProBlockInfo[]
): Promise<PageDoc | null> {
  if (!encoded || encoded.length > maxEncodedLength + 1) return null
  if (encoded[0] !== docVersion) return null
  const bytes = fromBase64Url(encoded.slice(1))
  if (!bytes || bytes.length === 0) return null
  try {
    const inflated = await pipe(bytes, new DecompressionStream("deflate-raw"))
    if (!inflated) return null
    return fromEntries(
      JSON.parse(new TextDecoder().decode(inflated)),
      proBlocks
    )
  } catch {
    return null
  }
}

function readHashParams(hash: string) {
  const params = new URLSearchParams(hash.replace(/^#/, ""))
  return { page: params.get("p"), theme: params.get("theme") }
}

function writeHashParams(current: string, page: string | null) {
  const params = new URLSearchParams(current.replace(/^#/, ""))
  if (page) params.set("p", page)
  else params.delete("p")
  const value = params.toString()
  return value ? `#${value}` : ""
}

export {
  decodeDoc,
  encodeDoc,
  maxEncodedLength,
  maxSections,
  newKey,
  placePro,
  placeSection,
  readHashParams,
  writeHashParams,
  type PageDoc,
  type PlacedSection,
  type ProBlockInfo,
}
