import items from "@/lib/pro/generated/items.json"

type ProFile = { path: string; code: string; html: string }

type ProItem = {
  registry: Record<string, unknown>
  files: ProFile[]
}

const proItems = items as Record<string, ProItem>

function getProItem(name: string) {
  return Object.hasOwn(proItems, name) ? proItems[name] : undefined
}

export { getProItem, type ProFile }
