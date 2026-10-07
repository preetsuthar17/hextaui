import {
  createMcpHandler,
  McpServer,
  ResourceTemplate,
  type CallToolResult,
  type ToolAnnotations,
} from "@modelcontextprotocol/server"
import * as z from "zod"

import { mcpIcons } from "@/lib/agent-manifests"
import { agentNotes } from "@/lib/agent-notes"
import {
  createDocsSearch,
  docsPageHref,
  unpackDocsSearchIndex,
  type DocsSearchDocument,
  type PackedDocsSearchIndex,
} from "@/lib/docs-search-query"
import {
  getMcpEntryPath,
  mcpIndexPath,
  mcpSearchPath,
  type McpEntry,
  type McpEntryKind,
  type McpEntrySummary,
  type McpIndex,
} from "@/lib/mcp-manifest"
import {
  getCommand,
  packageManagers,
  type PackageManager,
} from "@/lib/package-manager"
import { absoluteUrl, siteName, siteUrl } from "@/lib/site"

type AssetLoader = (path: string) => Promise<Response>

type RegistryFile = {
  path: string
  content?: string
}

type RegistryItem = {
  name: string
  title?: string
  description?: string
  dependencies?: string[]
  registryDependencies?: string[]
  files?: RegistryFile[]
}

type SearchDocument = DocsSearchDocument & {
  slug: string
  href: string
  fallback?: string
}

type Search = (query: string) => { document: SearchDocument; score: number }[]

class McpLookupError extends Error {}

const serverVersion = "1.0.0"

const maxExamples = 6

const maxResultsPerPage = 3

const enoughResults = 5

const apiSections = new Set(["Composition", "API reference", "Keyboard"])

const stopWords = new Set(
  "a after an and any as at be before build can component components create do for from how i in into is it make me my need of on or show something that the then this to ui use using want way when while with without".split(
    " "
  )
)

const kindOrder: McpEntryKind[] = ["component", "hook", "utility"]

const toolAnnotations: ToolAnnotations = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
}

const instructions = [
  `${siteName} is a React component library you copy into a project, with the shadcn/ui API, Base UI behavior and Tailwind CSS v4 styling. Components are installed with the shadcn CLI and the project owns the code afterwards.`,
  "Workflow:",
  "1. Find what fits with search_docs (plain language works: 'date range input', 'toast with undo') or list_components.",
  "2. Read get_component or get_component_api before writing code. Do not assume shadcn/ui props: HextaUI adds its own, such as Button's `feedback` flow.",
  "3. Install with the command from get_install_command, run in the project root. It also adds the theme tokens and every HextaUI dependency.",
  "4. Adapt working code from get_examples instead of writing usage from scratch.",
  "Conventions:",
  ...agentNotes.map((note) => `- ${note}`),
].join("\n")

function createAssetStore(load: AssetLoader) {
  const cache = new Map<string, Promise<unknown>>()

  function read<T>(path: string, parse: (response: Response) => Promise<T>) {
    let request = cache.get(path) as Promise<T> | undefined
    if (!request) {
      request = load(path).then((response) => {
        if (response.status === 404) {
          throw new McpLookupError(`${path} does not exist.`)
        }
        if (!response.ok) {
          throw new Error(`${path} returned ${response.status}.`)
        }
        return parse(response)
      })
      cache.set(path, request)
      request.catch(() => cache.delete(path))
    }
    return request
  }

  const json = <T>(path: string) =>
    read<T>(path, (response) => response.json() as Promise<T>)

  let searchRequest: Promise<Search> | null = null

  return {
    index: () => json<McpIndex>(mcpIndexPath),
    entry: (slug: string) => json<McpEntry>(getMcpEntryPath(slug)),
    registryItem: (name: string) => json<RegistryItem>(`/r/${name}.json`),
    text: (path: string) => read(path, (response) => response.text()),
    search() {
      searchRequest ??= Promise.all([
        json<McpIndex>(mcpIndexPath),
        json<PackedDocsSearchIndex>(mcpSearchPath),
      ]).then(([index, packed]) => createSearch(index, packed))
      searchRequest.catch(() => {
        searchRequest = null
      })
      return searchRequest
    },
  }
}

type AssetStore = ReturnType<typeof createAssetStore>

function createSearch(index: McpIndex, packed: PackedDocsSearchIndex): Search {
  const titles = new Map<string, string>([
    ...index.guides.map((guide) => [guide.slug, guide.title] as const),
    ...index.entries.map((entry) => [entry.slug, entry.title] as const),
  ])
  const documents: SearchDocument[] = [
    ...index.guides.map((guide) => ({
      id: `page:${guide.slug}`,
      slug: guide.slug,
      href: docsPageHref(guide.slug),
      title: guide.title,
      kind: "guide" as const,
      text: guide.description,
    })),
    ...index.entries.map((entry) => ({
      id: `page:${entry.slug}`,
      slug: entry.slug,
      href: docsPageHref(entry.slug),
      title: entry.title,
      kind: entry.kind,
      keywords: entry.keywords,
      text: entry.description,
    })),
  ]
  const guides = new Set(index.guides.map((guide) => guide.slug))
  const seen = new Set<string>()

  for (const record of unpackDocsSearchIndex(packed).records) {
    const id = `${record.kind}:${record.href}:${record.title}`
    if (
      seen.has(id) ||
      guides.has(record.page) ||
      (record.kind === "section" && record.title === "Installation")
    ) {
      continue
    }
    seen.add(id)
    documents.push({
      id,
      slug: record.page,
      href: record.href,
      title: record.title,
      kind: record.kind,
      page: titles.get(record.page) ?? record.page,
      trail: record.trail,
      text: record.text,
      detail: record.type,
      fallback: record.default,
    })
  }

  return createDocsSearch(documents)
}

function searchDocs(search: Search, query: string) {
  const words = query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 1 && !stopWords.has(word))
  const strict = search(words.length > 0 ? words.join(" ") : query).map(
    (result) => result.document
  )
  if (strict.length >= enoughResults) {
    return { loose: false, documents: strict }
  }
  const totals = new Map<
    string,
    { document: SearchDocument; matched: number; score: number }
  >()
  for (const word of new Set(words)) {
    for (const result of search(word)) {
      const total = totals.get(result.document.id) ?? {
        document: result.document,
        matched: 0,
        score: 0,
      }
      total.matched += 1
      total.score += result.score
      totals.set(result.document.id, total)
    }
  }
  const ids = new Set(strict.map((document) => document.id))
  return {
    loose: strict.length === 0,
    documents: [
      ...strict,
      ...[...totals.values()]
        .filter((total) => !ids.has(total.document.id))
        .sort((a, b) => b.matched - a.matched || b.score - a.score)
        .map((total) => total.document),
    ],
  }
}

function compact(value: string) {
  return value
    .trim()
    .replace(/^@hextaui\//i, "")
    .replace(/^https?:\/\/[^/]+\/(?:r|docs)\//i, "")
    .replace(/\.(?:json|md)$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
}

function findEntry(index: McpIndex, name: string) {
  const query = compact(name)
  if (!query) {
    return undefined
  }
  const exact = index.entries.find(
    (entry) => compact(entry.slug) === query || compact(entry.title) === query
  )
  if (exact) {
    return exact
  }
  return index.entries
    .filter((entry) => query.startsWith(compact(entry.slug)))
    .sort((a, b) => b.slug.length - a.slug.length)[0]
}

async function suggest(store: AssetStore, name: string) {
  const search = await store.search()
  const pages = searchDocs(search, name)
    .documents.filter((document) => document.slug !== "")
    .map((document) => document.slug)
  return [...new Set(pages)].slice(0, 5)
}

async function resolveEntry(store: AssetStore, name: string) {
  const index = await store.index()
  const entry = findEntry(index, name)
  if (entry) {
    return entry
  }
  const suggestions = await suggest(store, name)
  throw new McpLookupError(
    [
      `${siteName} has no component, hook or utility called "${name}".`,
      suggestions.length > 0
        ? `Closest matches: ${suggestions.map((slug) => `\`${slug}\``).join(", ")}.`
        : "",
      "Use search_docs or list_components to find the right name.",
    ]
      .filter(Boolean)
      .join(" ")
  )
}

function code(value: string) {
  const fence = value.includes("`") ? "``" : "`"
  const pad = value.startsWith("`") || value.endsWith("`") ? " " : ""
  return `${fence}${pad}${value}${pad}${fence}`
}

function fence(source: string, lang: string, title?: string) {
  const body = source.trimEnd()
  const ticks = body.includes("```") ? "````" : "```"
  return `${ticks}${lang}${title ? ` title="${title}"` : ""}\n${body}\n${ticks}`
}

function language(path: string) {
  return path.split(".").at(-1) ?? "tsx"
}

function kindLabel(kind: McpEntryKind) {
  return { component: "Component", hook: "Hook", utility: "Utility" }[kind]
}

function categoryLabel(category: string) {
  const label = category.replace(/-/g, " ")
  return `${label.charAt(0).toUpperCase()}${label.slice(1)}`
}

function registryUrl(name: string) {
  return absoluteUrl(`/r/${name}.json`)
}

function docsUrl(slug: string) {
  return absoluteUrl(docsPageHref(slug))
}

function installCommand(names: string[], manager: PackageManager) {
  return getCommand(
    manager,
    ["shadcn@latest", "add", ...names.map(registryUrl)],
    "dlx"
  )
}

function list(values: string[]) {
  return values.map(code).join(", ")
}

function installSection(entry: McpEntry, manager: PackageManager) {
  const internal = entry.registryDependencies.filter((name) => name !== "theme")
  return [
    "## Installation",
    fence(installCommand([entry.slug], manager), "bash"),
    [
      `Adds ${list(entry.files)}`,
      entry.registryDependencies.includes("theme")
        ? ", the HextaUI theme tokens"
        : "",
      internal.length > 0 ? ` and the ${siteName} items ${list(internal)}` : "",
      ". The CLI installs everything it depends on.",
    ].join(""),
    entry.dependencies.length > 0
      ? `npm packages: ${list(entry.dependencies)}.`
      : "",
    "Call get_component_source to read the code.",
  ]
    .filter(Boolean)
    .join("\n\n")
}

function entryHeader(entry: McpEntry | McpEntrySummary) {
  return [
    `# ${entry.title}`,
    `> ${entry.description}`,
    [
      kindLabel(entry.kind),
      entry.category ? categoryLabel(entry.category) : "",
      `Docs: ${docsUrl(entry.slug)}`,
    ]
      .filter(Boolean)
      .join(" — "),
  ].join("\n\n")
}

function renderComponent(entry: McpEntry, manager: PackageManager) {
  const sections = entry.sections.map((section) =>
    section.title === "Installation" && entry.installable
      ? installSection(entry, manager)
      : section.markdown
  )
  const demo = entry.examples.find((example) => example.title === "Demo")
  const next = [
    entry.examples.length > 0
      ? `- get_examples with component \`${entry.slug}\` returns example code${demo ? ` (the demo is \`${demo.name}\`)` : ""}.`
      : "",
    entry.installable
      ? `- get_component_source with name \`${entry.slug}\` returns the source files.`
      : "",
  ].filter(Boolean)

  return [
    entryHeader(entry),
    ...sections,
    ...(next.length > 0 ? ["## Next", next.join("\n")] : []),
  ].join("\n\n")
}

function renderSearchResult(document: SearchDocument) {
  const url = absoluteUrl(document.href)
  if (document.id.startsWith("page:")) {
    const label =
      document.kind === "guide"
        ? "guide"
        : `${document.kind} \`${document.slug}\``
    return `- **${document.title}** (${label}): ${document.text ?? ""} ${url}`.trimEnd()
  }
  const where = [document.page, ...(document.trail ?? [])]
    .filter(Boolean)
    .join(" › ")
  const type = document.detail ? `: ${code(document.detail)}` : ""
  const fallback = document.fallback
    ? `, default ${code(document.fallback)}`
    : ""
  const text = document.text ? ` ${document.text}` : ""
  return `- **${document.title}** (${document.kind} in ${where}${type}${fallback}, \`${document.slug}\`).${text} ${url}`
}

function renderList(
  index: McpIndex,
  kind: McpEntryKind | undefined,
  category: string | undefined
) {
  const entries = index.entries.filter(
    (entry) =>
      (!kind || entry.kind === kind) &&
      (!category || entry.category === category)
  )
  if (entries.length === 0) {
    return `No entries match. Categories: ${list(index.categories)}.`
  }
  const line = (entry: McpEntrySummary) =>
    `- \`${entry.slug}\` ${entry.title}: ${entry.description}`
  const groups: string[] = []

  for (const group of kindOrder) {
    const members = entries.filter((entry) => entry.kind === group)
    if (members.length === 0) {
      continue
    }
    if (group !== "component") {
      groups.push(`## ${kindLabel(group)}s`, members.map(line).join("\n"))
      continue
    }
    for (const name of index.categories) {
      const inCategory = members.filter((entry) => entry.category === name)
      if (inCategory.length > 0) {
        groups.push(
          `## ${categoryLabel(name)}`,
          inCategory.map(line).join("\n")
        )
      }
    }
    const other = members.filter(
      (entry) => !entry.category || !index.categories.includes(entry.category)
    )
    if (other.length > 0) {
      groups.push("## Other components", other.map(line).join("\n"))
    }
  }

  return [
    `${entries.length} ${siteName} ${entries.length === 1 ? "entry" : "entries"}. Pass a slug to get_component for its docs.`,
    ...groups,
  ].join("\n\n")
}

function renderSource(item: RegistryItem) {
  const internal = (item.registryDependencies ?? [])
    .map((url) => url.replace(/^.*\/r\//, "").replace(/\.json$/, ""))
    .filter((name) => name !== "theme")
  return [
    `# ${item.title ?? item.name} source`,
    [
      item.dependencies?.length
        ? `npm packages: ${list(item.dependencies)}.`
        : "",
      internal.length > 0
        ? `${siteName} dependencies: ${list(internal)}. Their source is available from get_component_source too.`
        : "",
    ]
      .filter(Boolean)
      .join("\n"),
    ...(item.files ?? []).map((file) =>
      fence(file.content ?? "", language(file.path), file.path)
    ),
  ]
    .filter(Boolean)
    .join("\n\n")
}

function exampleName(entry: McpEntry, name: string) {
  const value = name
    .trim()
    .replace(/^@hextaui\//i, "")
    .toLowerCase()
  const known = entry.examples.find(
    (example) =>
      example.name === value ||
      example.name === `${entry.slug}-${value}` ||
      example.title.toLowerCase() === value
  )
  if (!known) {
    throw new McpLookupError(
      `${entry.title} has no example called "${name}". Its examples: ${list(entry.examples.map((example) => example.name))}.`
    )
  }
  return known
}

function text(value: string): CallToolResult {
  return { content: [{ type: "text", text: value }] }
}

async function run(work: () => Promise<string>): Promise<CallToolResult> {
  try {
    return text(await work())
  } catch (error) {
    const message =
      error instanceof McpLookupError
        ? error.message
        : `${siteName} docs could not be loaded: ${error instanceof Error ? error.message : String(error)}`
    return { isError: true, content: [{ type: "text", text: message }] }
  }
}

const packageManagerSchema = z
  .enum(packageManagers)
  .default("npm")
  .describe(
    "Package manager of the user's project, used to format CLI commands. Check the lockfile: pnpm-lock.yaml, yarn.lock, bun.lock, otherwise npm."
  )

function createServer(store: AssetStore) {
  const server = new McpServer(
    {
      name: "hextaui",
      title: siteName,
      version: serverVersion,
      websiteUrl: siteUrl,
      icons: mcpIcons,
    },
    { instructions }
  )

  server.registerTool(
    "search_docs",
    {
      title: "Search HextaUI docs",
      description:
        "Search HextaUI components, hooks, utilities, examples, props and data attributes. Use plain language or a prop name, e.g. 'confirm before delete', 'chat message list', 'loading button' or 'onOpenChange'. Returns ranked matches with the slug to pass to other tools.",
      inputSchema: z.object({
        query: z.string().min(1).describe("What to look for."),
        limit: z
          .number()
          .int()
          .min(1)
          .max(30)
          .default(10)
          .describe("Maximum number of results."),
      }),
      annotations: toolAnnotations,
    },
    ({ query, limit }) =>
      run(async () => {
        const search = await store.search()
        const { loose, documents } = searchDocs(search, query)
        const perPage = new Map<string, number>()
        const results = documents
          .filter((document) => {
            const count = perPage.get(document.slug) ?? 0
            perPage.set(document.slug, count + 1)
            return count < maxResultsPerPage
          })
          .slice(0, limit)
        if (results.length === 0) {
          return `Nothing in the ${siteName} docs matches "${query}". Try other words, or list_components.`
        }
        return [
          loose
            ? `No entry matches every word of "${query}". Closest matches:`
            : `${results.length} ${results.length === 1 ? "match" : "matches"} for "${query}":`,
          results.map(renderSearchResult).join("\n"),
          "Pass a slug to get_component for the full docs.",
        ].join("\n\n")
      })
  )

  server.registerTool(
    "list_components",
    {
      title: "List HextaUI components",
      description:
        "List every HextaUI component, hook and utility with a one-line description, grouped by category. Filter by kind or category to keep the list short.",
      inputSchema: z.object({
        kind: z
          .enum(["component", "hook", "utility"])
          .optional()
          .describe("Only list this kind of entry."),
        category: z
          .string()
          .optional()
          .describe(
            "Only list components in this category: actions, forms, overlays, navigation, feedback, data-display, layout, chat or media."
          ),
      }),
      annotations: toolAnnotations,
    },
    ({ kind, category }) =>
      run(async () => renderList(await store.index(), kind, category))
  )

  server.registerTool(
    "get_component",
    {
      title: "Get HextaUI component docs",
      description:
        "Full docs for one component, hook or utility: what it is for, the install command, usage, examples, keyboard support, accessibility notes and the API reference. Read this before using a component.",
      inputSchema: z.object({
        name: z
          .string()
          .min(1)
          .describe(
            "Slug or name, e.g. 'alert-dialog', 'Alert dialog', 'useAutosize'. A part name like 'DialogContent' resolves to its component."
          ),
        packageManager: packageManagerSchema,
      }),
      annotations: toolAnnotations,
    },
    ({ name, packageManager }) =>
      run(async () => {
        const summary = await resolveEntry(store, name)
        return renderComponent(await store.entry(summary.slug), packageManager)
      })
  )

  server.registerTool(
    "get_component_api",
    {
      title: "Get HextaUI component API",
      description:
        "Only the API of a component: how its parts nest, every part with its props, types, defaults and data attributes, and keyboard support. Cheaper than get_component when you already know what the component does.",
      inputSchema: z.object({
        name: z.string().min(1).describe("Slug or name, e.g. 'select'."),
      }),
      annotations: toolAnnotations,
    },
    ({ name }) =>
      run(async () => {
        const summary = await resolveEntry(store, name)
        const entry = await store.entry(summary.slug)
        const sections = entry.sections.filter((section) =>
          apiSections.has(section.title)
        )
        if (sections.length === 0) {
          return `${entry.title} has no API reference. Call get_component for its docs.`
        }
        return [
          `# ${entry.title} API`,
          ...sections.map((section) => section.markdown),
        ].join("\n\n")
      })
  )

  server.registerTool(
    "get_component_source",
    {
      title: "Get HextaUI source code",
      description:
        "The source files of a component, hook or utility exactly as the shadcn CLI installs them, with their npm and HextaUI dependencies. Prefer installing with get_install_command; use this to read how something works or to copy it by hand.",
      inputSchema: z.object({
        name: z.string().min(1).describe("Slug or name, e.g. 'button'."),
      }),
      annotations: toolAnnotations,
    },
    ({ name }) =>
      run(async () => {
        const index = await store.index()
        const entry = findEntry(index, name)
        if (entry && !entry.installable) {
          return `${entry.title} ships with the ${siteName} theme tokens instead of its own files. Call get_component with \`${entry.slug}\` to see how to set it up.`
        }
        const slug =
          entry?.slug ??
          name
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")
        try {
          return renderSource(await store.registryItem(slug))
        } catch (error) {
          if (!entry && error instanceof McpLookupError) {
            await resolveEntry(store, name)
          }
          throw error
        }
      })
  )

  server.registerTool(
    "get_examples",
    {
      title: "Get HextaUI examples",
      description:
        "Working example code for a component, taken from its docs. Without `examples` it returns the main demo and lists the other examples by name. Pass names from that list, or from get_component, to get their code.",
      inputSchema: z.object({
        component: z.string().min(1).describe("Slug or name, e.g. 'dialog'."),
        examples: z
          .array(z.string().min(1))
          .max(maxExamples)
          .optional()
          .describe(
            `Example names such as 'dialog-form' or just 'form'. At most ${maxExamples} per call.`
          ),
      }),
      annotations: toolAnnotations,
    },
    ({ component, examples }) =>
      run(async () => {
        const summary = await resolveEntry(store, component)
        const entry = await store.entry(summary.slug)
        if (entry.examples.length === 0) {
          return `${entry.title} has no examples. Call get_component for its usage.`
        }
        const picked = examples?.length
          ? [...new Set(examples.map((name) => exampleName(entry, name)))]
          : [entry.examples[0]]
        const items = await Promise.all(
          picked.map((example) => store.registryItem(example.name))
        )
        const rest = entry.examples.filter(
          (example) => !picked.includes(example)
        )
        return [
          `# ${entry.title} examples`,
          ...picked.flatMap((example, position) => [
            `## ${example.title} (\`${example.name}\`)`,
            ...(example.description ? [example.description] : []),
            ...(items[position].files ?? []).map((file) =>
              fence(file.content ?? "", language(file.path), file.path)
            ),
          ]),
          ...(rest.length > 0
            ? [
                "## More examples",
                rest
                  .map((example) => `- \`${example.name}\`: ${example.title}`)
                  .join("\n"),
              ]
            : []),
        ].join("\n\n")
      })
  )

  server.registerTool(
    "get_install_command",
    {
      title: "Get HextaUI install command",
      description:
        "One shadcn CLI command that installs several HextaUI components, hooks or utilities into the user's project, with the theme tokens and every dependency. Run it in the project root.",
      inputSchema: z.object({
        items: z
          .array(z.string().min(1))
          .min(1)
          .max(50)
          .describe("Slugs or names, e.g. ['dialog', 'field', 'input']."),
        packageManager: packageManagerSchema,
      }),
      annotations: toolAnnotations,
    },
    ({ items, packageManager }) =>
      run(async () => {
        const resolved = await Promise.all(
          items.map((item) => resolveEntry(store, item))
        )
        const unique = [
          ...new Map(resolved.map((entry) => [entry.slug, entry])).values(),
        ]
        const installable = unique.filter((entry) => entry.installable)
        const themeOnly = unique.filter((entry) => !entry.installable)
        return [
          installable.length > 0
            ? fence(
                installCommand(
                  installable.map((entry) => entry.slug),
                  packageManager
                ),
                "bash"
              )
            : "",
          installable.length > 0
            ? `If components.json registers the namespace (\`"registries": { "@hextaui": "${siteUrl}/r/{name}.json" }\`), the short form works too: ${code(
                getCommand(
                  packageManager,
                  [
                    "shadcn@latest",
                    "add",
                    ...installable.map((entry) => `@hextaui/${entry.slug}`),
                  ],
                  "dlx"
                )
              )}`
            : "",
          themeOnly.length > 0
            ? `${list(themeOnly.map((entry) => entry.slug))} ${themeOnly.length === 1 ? "comes" : "come"} with the theme tokens, which any component install adds. See get_component for setup.`
            : "",
          installable.length > 0
            ? `Files land in \`components/ui\`, \`hooks\` and \`lib\` under the aliases in components.json. Run \`shadcn init\` first if the project has no components.json.`
            : "",
        ]
          .filter(Boolean)
          .join("\n\n")
      })
  )

  server.registerTool(
    "get_setup",
    {
      title: "Get HextaUI setup guide",
      description:
        "How to add HextaUI to a project: requirements, the shadcn CLI, the @hextaui namespace, theme tokens for manual installs, and the conventions generated code should follow. Use this when the project has no HextaUI components yet.",
      inputSchema: z.object({ packageManager: packageManagerSchema }),
      annotations: toolAnnotations,
    },
    ({ packageManager }) =>
      run(async () =>
        [
          (await store.text("/docs/installation.md")).replace(
            /^npx (.+)$/gm,
            (_, command: string) =>
              getCommand(packageManager, command.split(" "), "dlx")
          ),
          "## Conventions",
          agentNotes.map((note) => `- ${note}`).join("\n"),
        ].join("\n\n")
      )
  )

  server.registerPrompt(
    "build-ui",
    {
      title: "Build UI with HextaUI",
      description:
        "Plan and build a piece of UI from HextaUI components, reading their docs before writing code.",
      argsSchema: z.object({
        task: z.string().describe("What to build, e.g. 'a settings page'."),
      }),
    },
    ({ task }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: [
              `Build this with ${siteName} components: ${task}`,
              "1. Use search_docs or list_components to pick the components that fit. Prefer an existing component over custom markup.",
              "2. Read get_component (or get_component_api) for each one before using it. Use only props that the API reference documents.",
              "3. Check which components the project already has in components/ui, then install the missing ones with get_install_command.",
              "4. Start from get_examples where an example is close to the task.",
              "5. Follow the conventions: compose with the `render` prop, not `asChild`; merge classes with `cn`; use `@tabler/icons-react` icons and theme tokens instead of raw colors.",
            ].join("\n"),
          },
        },
      ],
    })
  )

  server.registerResource(
    "docs",
    new ResourceTemplate("hextaui://docs/{slug}", {
      list: async () => {
        const index = await store.index()
        return {
          resources: index.entries.map((entry) => ({
            uri: `hextaui://docs/${entry.slug}`,
            name: entry.slug,
            title: entry.title,
            description: entry.description,
            mimeType: "text/markdown",
          })),
        }
      },
      complete: {
        slug: async (value) => {
          const index = await store.index()
          return index.entries
            .map((entry) => entry.slug)
            .filter((slug) => slug.startsWith(value.toLowerCase()))
        },
      },
    }),
    {
      title: `${siteName} docs`,
      description: "The docs for one HextaUI component, hook or utility.",
      mimeType: "text/markdown",
    },
    async (uri, variables) => {
      const slug = String(variables.slug)
      const summary = await resolveEntry(store, slug)
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "text/markdown",
            text: renderComponent(await store.entry(summary.slug), "npm"),
          },
        ],
      }
    }
  )

  return server
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Expose-Headers": "*",
  "Access-Control-Max-Age": "86400",
}

function withCors(response: Response) {
  const headers = new Headers(response.headers)
  for (const [name, value] of Object.entries(corsHeaders)) {
    headers.set(name, value)
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

function createMcpFetch(load: AssetLoader) {
  const store = createAssetStore(load)
  const handler = createMcpHandler(() => createServer(store))

  return async function fetch(request: Request) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders })
    }
    if (
      request.method === "GET" &&
      request.headers.get("accept")?.includes("text/html")
    ) {
      return Response.redirect(new URL("/docs/mcp", request.url), 302)
    }
    return withCors(await handler.fetch(request))
  }
}

export { createMcpFetch, findEntry }
export type { AssetLoader }
