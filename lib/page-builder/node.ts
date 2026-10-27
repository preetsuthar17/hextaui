type PropValue = string | number | boolean | Element

type Element = {
  tag: string
  props: Record<string, PropValue>
  children: Node[]
}

type Node = Element | string | null | false

type ModuleSpec = { from: string; registry?: string; dependency?: string }

const uiModules: Record<string, ModuleSpec> = {
  Button: { from: "@/components/ui/button", registry: "button" },
  Badge: { from: "@/components/ui/badge", registry: "badge" },
  Separator: { from: "@/components/ui/separator", registry: "separator" },
  Avatar: { from: "@/components/ui/avatar", registry: "avatar" },
  AvatarFallback: { from: "@/components/ui/avatar", registry: "avatar" },
  Accordion: { from: "@/components/ui/accordion", registry: "accordion" },
  AccordionItem: { from: "@/components/ui/accordion", registry: "accordion" },
  AccordionTrigger: {
    from: "@/components/ui/accordion",
    registry: "accordion",
  },
  AccordionContent: {
    from: "@/components/ui/accordion",
    registry: "accordion",
  },
}

const iconModule: ModuleSpec = {
  from: "@tabler/icons-react",
  dependency: "@tabler/icons-react",
}

function moduleFor(tag: string): ModuleSpec | null {
  if (uiModules[tag]) return uiModules[tag]
  if (/^Icon[A-Z0-9]/.test(tag)) return iconModule
  return null
}

function h(
  tag: string,
  props: Record<string, PropValue | undefined | null> | null = null,
  ...children: (Node | Node[])[]
): Element {
  const clean: Record<string, PropValue> = {}
  for (const [key, value] of Object.entries(props ?? {})) {
    if (value !== undefined && value !== null && value !== "") {
      clean[key] = value
    }
  }
  return {
    tag,
    props: clean,
    children: children
      .flat()
      .filter((child) => child !== null && child !== false && child !== ""),
  }
}

function isElement(value: unknown): value is Element {
  return typeof value === "object" && value !== null && "tag" in value
}

function collectTags(node: Node, tags = new Set<string>()) {
  if (!isElement(node)) return tags
  tags.add(node.tag)
  for (const value of Object.values(node.props)) {
    if (isElement(value)) collectTags(value, tags)
  }
  for (const child of node.children) collectTags(child, tags)
  return tags
}

function needsExpression(text: string) {
  return /[{}<>&"'`\\]|^\s|\s$|\n/.test(text)
}

function printText(text: string) {
  return needsExpression(text) ? `{${JSON.stringify(text)}}` : text
}

function printProp(name: string, value: PropValue, indent: string): string {
  if (value === true) return name
  if (typeof value === "number" || value === false) return `${name}={${value}}`
  if (isElement(value)) return `${name}={${printNode(value, indent).trim()}}`
  return /["\\\n]/.test(value)
    ? `${name}={${JSON.stringify(value)}}`
    : `${name}="${value}"`
}

const lineWidth = 80

function printNode(node: Node, indent = ""): string {
  if (!isElement(node)) return node ? `${indent}${printText(node)}` : ""
  const props = Object.entries(node.props).map(([name, value]) =>
    printProp(name, value, indent)
  )
  const inlineProps = props.length ? ` ${props.join(" ")}` : ""
  const multilineProps = props.length
    ? `\n${props.map((prop) => `${indent}  ${prop}`).join("\n")}\n${indent}`
    : ""
  const children = node.children
  const fitsInline = (open: string) =>
    !open.includes("\n") && indent.length + open.length <= lineWidth
  const opensInline = (open: string) => props.length <= 1 || fitsInline(open)

  if (children.length === 0) {
    const open = `<${node.tag}${inlineProps} />`
    return opensInline(open)
      ? `${indent}${open}`
      : `${indent}<${node.tag}${multilineProps}/>`
  }

  const open = opensInline(`<${node.tag}${inlineProps}>`)
    ? `<${node.tag}${inlineProps}>`
    : `<${node.tag}${multilineProps}>`
  const close = `</${node.tag}>`

  if (children.length === 1 && typeof children[0] === "string") {
    const single = `${open}${printText(children[0])}${close}`
    if (fitsInline(single)) return `${indent}${single}`
  }

  const body = children
    .map((child) => printNode(child, `${indent}  `))
    .filter(Boolean)
    .join("\n")
  return `${indent}${open}\n${body}\n${indent}${close}`
}

function printImports(tags: Iterable<string>) {
  const byModule = new Map<string, Set<string>>()
  for (const tag of tags) {
    const spec = moduleFor(tag)
    if (!spec) continue
    const names = byModule.get(spec.from) ?? new Set<string>()
    names.add(tag)
    byModule.set(spec.from, names)
  }
  const external = [...byModule.keys()].filter((from) => !from.startsWith("@/"))
  const local = [...byModule.keys()].filter((from) => from.startsWith("@/"))
  const line = (from: string) => {
    const names = [...(byModule.get(from) ?? [])].sort()
    const single = `import { ${names.join(", ")} } from "${from}"`
    return single.length <= lineWidth
      ? single
      : `import {\n${names.map((name) => `  ${name},`).join("\n")}\n} from "${from}"`
  }
  return [
    external.sort().map(line).join("\n"),
    local.sort().map(line).join("\n"),
  ]
    .filter(Boolean)
    .join("\n\n")
}

function registryNames(tags: Iterable<string>) {
  return [
    ...new Set(
      [...tags].flatMap((tag) => {
        const registry = moduleFor(tag)?.registry
        return registry ? [registry] : []
      })
    ),
  ].sort()
}

function dependencyNames(tags: Iterable<string>) {
  return [
    ...new Set(
      [...tags].flatMap((tag) => {
        const dependency = moduleFor(tag)?.dependency
        return dependency ? [dependency] : []
      })
    ),
  ].sort()
}

export {
  collectTags,
  dependencyNames,
  h,
  isElement,
  moduleFor,
  printImports,
  printNode,
  registryNames,
  type Element,
  type Node,
  type PropValue,
}
