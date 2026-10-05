import fs from "node:fs"
import path from "node:path"

const root = path.resolve(import.meta.dirname, "..")
const registryPath = path.join(root, "registry.json")
const base = "https://hextaui.com/r"

const versions = {
  "@base-ui/react": "@base-ui/react@^1.8.0",
  "@shadcn/react": "@shadcn/react@0.3.1",
  "@tabler/icons-react": "@tabler/icons-react",
  "@tanstack/react-table": "@tanstack/react-table@^9.2.6",
  "class-variance-authority": "class-variance-authority",
  cmdk: "cmdk@^1.1.1",
  cn: "cn",
  "date-fns": "date-fns@^4.4.0",
  "react-day-picker": "react-day-picker@^10.0.2",
  "react-resizable-panels": "react-resizable-panels@^4.14.2",
  recharts: "recharts@^3.10.1",
}

const peers = new Set(["react", "react-dom", "next"])

const companions = {
  "button-group": ["button"],
  message: ["avatar"],
  "message-scroller": ["message"],
}

const stockColors = new Set([
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "border",
  "input",
  "ring",
  "radius",
])

const isStockColor = (name) =>
  stockColors.has(name) || name.startsWith("sidebar")

const isStockTheme = (name) =>
  (name.startsWith("color-") && isStockColor(name.slice(6))) ||
  /^color-chart-\d+$/.test(name) ||
  name.startsWith("radius-") ||
  ["font-sans", "font-heading", "font-mono"].includes(name)

function parseCss(text) {
  const nodes = []
  let buffer = ""
  let parens = 0
  let quote = null
  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (quote) {
      buffer += char
      if (char === quote && text[i - 1] !== "\\") quote = null
    } else if (char === '"' || char === "'") {
      quote = char
      buffer += char
    } else if (char === "(") {
      parens++
      buffer += char
    } else if (char === ")") {
      parens--
      buffer += char
    } else if (char === "{" && parens === 0) {
      let depth = 1
      let j = i + 1
      for (; depth > 0; j++) {
        if (text[j] === "{") depth++
        else if (text[j] === "}") depth--
      }
      nodes.push({ prelude: clean(buffer), body: text.slice(i + 1, j - 1) })
      buffer = ""
      i = j - 1
    } else if (char === ";" && parens === 0) {
      pushDeclaration(nodes, buffer)
      buffer = ""
    } else {
      buffer += char
    }
  }
  pushDeclaration(nodes, buffer)
  return nodes
}

function pushDeclaration(nodes, text) {
  const colon = text.indexOf(":")
  if (colon === -1 || !text.trim()) return
  nodes.push({
    prop: text.slice(0, colon).trim(),
    value: clean(text.slice(colon + 1)),
  })
}

function clean(value) {
  return value
    .replace(/\s+/g, " ")
    .replace(/\( /g, "(")
    .replace(/ \)/g, ")")
    .trim()
}

function declarations(body) {
  return Object.fromEntries(
    parseCss(body)
      .filter((node) => node.prop)
      .map((node) => [node.prop, node.value])
  )
}

function keyframes(body) {
  return Object.fromEntries(
    parseCss(body)
      .filter((node) => node.prelude)
      .map((node) => [
        node.prelude.replace(/\s*,\s*/g, ", "),
        declarations(node.body),
      ])
  )
}

function readTheme() {
  const source = fs
    .readFileSync(path.join(root, "app/globals.css"), "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
  const theme = {}
  const light = {}
  const dark = {}
  const rootOnly = {}
  const media = {}
  const frames = {}
  const utilities = {}
  const properties = {}

  for (const node of parseCss(source)) {
    if (!node.prelude) continue
    const { prelude, body } = node
    if (prelude === "@theme" || prelude === "@theme inline") {
      for (const child of parseCss(body)) {
        if (child.prop) {
          const name = child.prop.slice(2)
          if (!isStockTheme(name)) theme[name] = child.value
        } else if (child.prelude.startsWith("@keyframes ")) {
          frames[child.prelude] = keyframes(child.body)
        }
      }
    } else if (prelude.startsWith("@keyframes ")) {
      frames[prelude] = keyframes(body)
    } else if (prelude.startsWith("@utility ")) {
      utilities[prelude] = declarations(body)
    } else if (prelude.startsWith("@property ")) {
      properties[prelude] = declarations(body)
    } else if (prelude === ":root" || prelude === ".dark") {
      for (const child of parseCss(body)) {
        if (child.prop) {
          const name = child.prop.slice(2)
          if (prelude === ".dark") dark[name] = child.value
          else light[name] = child.value
        } else if (child.prelude.startsWith("@media ")) {
          media[child.prelude] = { ":root": declarations(child.body) }
        }
      }
    }
  }

  const cssVars = { theme, light: {}, dark: {} }
  const chart = { light: {}, dark: {} }
  for (const [name, value] of Object.entries(light)) {
    if (/^chart-\d+$/.test(name)) {
      chart.light[name] = value
      chart.dark[name] = dark[name] ?? value
    } else if (isStockColor(name)) {
      continue
    } else if (name in dark) {
      cssVars.light[name] = value
      cssVars.dark[name] = dark[name]
    } else {
      rootOnly[`--${name}`] = value
    }
  }

  return {
    cssVars,
    chart,
    properties,
    css: {
      '@import "tw-animate-css"': {},
      '@import "shadcn/tailwind.css"': {},
      ...frames,
      ...utilities,
      ...(Object.keys(rootOnly).length ? { ":root": rootOnly } : {}),
      ...media,
      "@layer base": {
        body: { position: "relative" },
        ':where(a, button, input, label, select, summary, textarea, [role="button"])':
          { "touch-action": "manipulation" },
      },
    },
  }
}

const themeSource = readTheme()

const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"))
const previous = new Map(registry.items.map((item) => [item.name, item]))

const docs = fs.readFileSync(path.join(root, "lib/docs.ts"), "utf8")
const meta = new Map()
for (const match of docs.matchAll(
  /name:\s*"([^"]+)",\s*slug:\s*"([^"]+)",\s*description:\s*"([^"]+)",(?:\s*category:\s*"([^"]+)",)?/g
)) {
  meta.set(match[2], {
    title: match[1],
    description: match[3],
    ...(match[4] ? { category: match[4] } : {}),
  })
}

function analyze(file) {
  const source = fs.readFileSync(path.join(root, file), "utf8")
  const dependencies = new Set()
  const registryDependencies = new Set()
  const libs = new Set()
  const hooks = new Set()
  for (const [, spec] of source.matchAll(/from "([^"]+)"/g)) {
    if (spec.startsWith("@/components/ui/")) {
      registryDependencies.add(spec.slice("@/components/ui/".length))
    } else if (spec.startsWith("@/hooks/")) {
      const hook = spec.slice("@/hooks/".length)
      hooks.add(hook)
      registryDependencies.add(hook)
    } else if (spec.startsWith("@/lib/")) {
      const lib = spec.slice("@/lib/".length)
      libs.add(lib)
      registryDependencies.add(lib)
    } else if (spec.startsWith("@/")) {
      throw new Error(`${file} imports ${spec}, which the registry cannot ship`)
    } else {
      const pkg = spec.startsWith("@")
        ? spec.split("/").slice(0, 2).join("/")
        : spec.split("/")[0]
      if (peers.has(pkg)) continue
      if (!versions[pkg]) {
        throw new Error(`${file} imports ${pkg}; add it to versions`)
      }
      dependencies.add(versions[pkg])
    }
  }
  return {
    dependencies: [...dependencies].sort(),
    registryDependencies: [...registryDependencies].sort(),
    libs: [...libs],
    hooks: [...hooks],
  }
}

function describe(name) {
  const known = meta.get(name) ?? previous.get(name)
  if (!known?.title || !known?.description) {
    throw new Error(`${name} needs a title and description in lib/docs.ts`)
  }
  const category = meta.get(name)?.category
  return {
    title: known.title,
    description: known.description,
    ...(category ? { categories: [category] } : {}),
  }
}

function styles(name, source) {
  const css = Object.fromEntries(
    Object.entries(themeSource.properties).filter(([prelude]) =>
      source.includes(prelude.slice("@property ".length))
    )
  )
  return {
    ...(name === "chart" ? { cssVars: themeSource.chart } : {}),
    ...(Object.keys(css).length ? { css } : {}),
  }
}

const url = (name) => `${base}/${name}.json`

const uiNames = fs
  .readdirSync(path.join(root, "components/ui"))
  .filter((file) => file.endsWith(".tsx") && !file.endsWith(".test.tsx"))
  .map((file) => file.replace(/\.tsx$/, ""))
  .sort()

const libNames = new Set()
const hookNames = fs
  .readdirSync(path.join(root, "hooks"))
  .filter((file) => file.endsWith(".ts") && !file.endsWith(".test.ts"))
  .map((file) => file.replace(/\.ts$/, ""))
  .sort()

const hookItems = hookNames.map((name) => {
  const file = `hooks/${name}.ts`
  const { dependencies, registryDependencies, libs } = analyze(file)
  libs.forEach((lib) => libNames.add(lib))
  return {
    name,
    type: "registry:hook",
    ...describe(name),
    ...(dependencies.length ? { dependencies } : {}),
    ...(registryDependencies.length
      ? { registryDependencies: registryDependencies.map(url) }
      : {}),
    files: [{ path: file, type: "registry:hook" }],
  }
})

const uiItems = uiNames.map((name) => {
  const file = `components/ui/${name}.tsx`
  const { dependencies, registryDependencies, libs } = analyze(file)
  libs.forEach((lib) => libNames.add(lib))
  return {
    name,
    type: "registry:ui",
    ...describe(name),
    dependencies,
    registryDependencies: [
      "theme",
      ...new Set([...registryDependencies, ...(companions[name] ?? [])]),
    ].map(url),
    files: [{ path: file, type: "registry:ui" }],
    ...styles(name, fs.readFileSync(path.join(root, file), "utf8")),
  }
})

const libItems = [...libNames].sort().map((name) => {
  const file = `lib/${name}.ts`
  const { dependencies, registryDependencies } = analyze(file)
  return {
    name,
    type: "registry:lib",
    ...describe(name),
    ...(dependencies.length ? { dependencies } : {}),
    ...(registryDependencies.length
      ? { registryDependencies: registryDependencies.map(url) }
      : {}),
    files: [{ path: file, type: "registry:lib" }],
  }
})

const exampleTitles = new Map()
for (const page of fs.readdirSync(path.join(root, "app/docs"))) {
  const file = path.join(root, "app/docs", page, "page.tsx")
  if (!fs.existsSync(file)) continue
  const source = fs.readFileSync(file, "utf8")
  for (const [, attributes] of source.matchAll(
    /<DocsExample\b([\s\S]*?)>\s*</g
  )) {
    const example = /file="([^"]+)"/.exec(attributes)?.[1]
    const title = /title="([^"]+)"/.exec(attributes)?.[1]
    if (example && title) exampleTitles.set(example, title)
  }
}

const installableNames = new Set([
  "theme",
  "all",
  ...libNames,
  ...hookNames,
  ...uiNames,
])
const exampleNames = new Set()
const exampleItems = fs
  .readdirSync(path.join(root, "components/examples"))
  .sort()
  .flatMap((slug) => {
    const owner = describe(slug).title
    return fs
      .readdirSync(path.join(root, "components/examples", slug))
      .filter((file) => file.endsWith(".tsx"))
      .sort()
      .map((file) => {
        const example = file.replace(/\.tsx$/, "")
        const name = `${slug}-${example}`
        if (exampleNames.has(name) || installableNames.has(name)) {
          throw new Error(`Example ${name} collides with another item`)
        }
        exampleNames.add(name)
        const filePath = `components/examples/${slug}/${file}`
        const { dependencies, registryDependencies } = analyze(filePath)
        const title = exampleTitles.get(`${slug}/${example}`)
        return {
          name,
          type: "registry:example",
          title: title ? `${owner}: ${title}` : `${owner} demo`,
          description: title
            ? `The ${title} example from the ${owner} docs.`
            : `The main ${owner} demo from the docs.`,
          ...(dependencies.length ? { dependencies } : {}),
          ...(registryDependencies.length
            ? { registryDependencies: registryDependencies.map(url) }
            : {}),
          files: [{ path: filePath, type: "registry:example" }],
        }
      })
  })

registry.items = [
  {
    name: "theme",
    type: "registry:theme",
    title: "Theme",
    description:
      "HextaUI design tokens: status colors, easing curves, hairline borders, type scale and the keyframes every component animates with.",
    dependencies: ["tw-animate-css", "shadcn"],
    cssVars: themeSource.cssVars,
    css: themeSource.css,
  },
  ...libItems,
  ...hookItems,
  ...uiItems,
  {
    name: "all",
    type: "registry:item",
    title: "All components",
    description:
      "Every HextaUI component, the theme, shared libs and hooks in one install.",
    registryDependencies: [...uiNames, ...hookNames].map(url),
  },
  ...exampleItems,
]

const itemNames = new Set(registry.items.map((item) => item.name))
for (const item of registry.items) {
  for (const dependency of item.registryDependencies ?? []) {
    const name = dependency.slice(base.length + 1, -".json".length)
    if (!itemNames.has(name)) {
      throw new Error(`${item.name} depends on ${name}, which is not an item`)
    }
  }
}

fs.writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`)
console.log(`registry.json: ${registry.items.length} items`)
