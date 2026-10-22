import items from "@/lib/pro/generated/items.json"
import { decodeCompactHtml, type CompactHtml } from "@/lib/pro/compact-html"

type ProFile = { path: string; code: string; html: string }

type StoredFile = { path: string; code: string; html?: string; compact?: CompactHtml }

type RegistryFile = { path: string; type: string; target: string }

type StoredItem = {
  free: boolean
  registry: Record<string, unknown> & { files: RegistryFile[] }
  files: StoredFile[]
}

const proItems = items as unknown as Record<string, StoredItem>

function fileHtml(file: StoredFile) {
  if (file.html !== undefined) return file.html
  return file.compact ? decodeCompactHtml(file.code, file.compact) : ""
}

function getProItem(name: string) {
  if (!Object.hasOwn(proItems, name)) return undefined
  const item = proItems[name]
  const code = new Map(item.files.map((file) => [file.path, file.code]))
  return {
    free: item.free,
    registry: {
      ...item.registry,
      files: item.registry.files.map((file) => ({
        ...file,
        content: code.get(file.path) ?? "",
      })),
    },
    files: item.files.map(
      (file): ProFile => ({ path: file.path, code: file.code, html: fileHtml(file) })
    ),
  }
}

export { getProItem, type ProFile }
