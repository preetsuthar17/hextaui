import { docsEntries } from "@/lib/docs"
import { readDocsSource } from "@/lib/docs-source"
import { absoluteUrl } from "@/lib/site"

type CssTree = { [key: string]: string | CssTree }

type ThemeItem = {
  name: string
  cssVars: Record<"theme" | "light" | "dark", Record<string, string>>
  css: CssTree
}

const indentUnit = "  "

function getRegistryItemUrl(name: string) {
  return absoluteUrl(`/r/${name}.json`)
}

function getRegistrySlug(files: string[]) {
  const slug = /^(?:components\/ui|hooks|lib)\/([^/]+)\.tsx?$/.exec(
    files[0] ?? ""
  )?.[1]

  if (!slug || !docsEntries.some((item) => item.slug === slug)) {
    throw new Error(`No registry item for ${files[0]}`)
  }

  return slug
}

function serializeCss(tree: CssTree, depth = 0): string[] {
  const indent = indentUnit.repeat(depth)

  return Object.entries(tree).flatMap(([key, value]) => {
    if (typeof value === "string") {
      return [`${indent}${key}: ${value};`]
    }
    if (Object.keys(value).length === 0) {
      return [`${indent}${key};`]
    }
    return [
      `${indent}${key} {`,
      ...serializeCss(value, depth + 1),
      `${indent}}`,
    ]
  })
}

function variables(selector: string, values: Record<string, string>) {
  return serializeCss({
    [selector]: Object.fromEntries(
      Object.entries(values).map(([key, value]) => [`--${key}`, value])
    ),
  })
}

async function getThemeCss() {
  const registry = JSON.parse(await readDocsSource("registry.json")) as {
    items: ThemeItem[]
  }
  const theme = registry.items.find((item) => item.name === "theme")

  if (!theme) {
    throw new Error("registry.json has no theme item")
  }

  const { css, cssVars } = theme
  const imports = Object.fromEntries(
    Object.entries(css).filter(([key]) => key.startsWith("@import"))
  )
  const rules = Object.fromEntries(
    Object.entries(css).filter(([key]) => !key.startsWith("@import"))
  )

  return [
    serializeCss(imports),
    variables("@theme inline", cssVars.theme),
    variables(":root", cssVars.light),
    variables(".dark", cssVars.dark),
    ...Object.entries(rules).map(([key, value]) =>
      serializeCss({ [key]: value })
    ),
  ]
    .map((block) => block.join("\n"))
    .join("\n\n")
}

function getRegistryKind(files: string[]) {
  const file = files[0] ?? ""
  if (file.startsWith("hooks/")) {
    return "hook"
  }
  if (file.startsWith("lib/")) {
    return "utility"
  }
  return "component"
}

export { getRegistryItemUrl, getRegistryKind, getRegistrySlug, getThemeCss }
