import { docsComponents, docsHooks, docsUtilities } from "@/lib/docs"
import { agentNotes } from "@/lib/agent-notes"
import {
  absoluteUrl,
  siteAuthor,
  siteContactEmail,
  siteName,
  siteRepository,
  siteSummary,
  siteUrl,
} from "@/lib/site"

const agentWhenToUse = [
  "The user is building a React or Next.js interface with shadcn/ui and Tailwind CSS v4 and wants a component (dialog, select, combobox, data table, date picker, toast, sidebar, chat message, prompt input…) that already handles motion, keyboard, screen readers, touch targets and right-to-left layouts.",
  "The project already uses shadcn/ui and needs a drop-in replacement with the same API but finished states: loading, disabled, invalid, empty and reduced-motion fallbacks.",
  "The user asks for an AI chat or assistant UI: message bubbles, message scroller, prompt input with attachments, streaming text, tool calls or voice mode.",
  "The task needs the exact props, data attributes, keyboard map or install command of a HextaUI component: read its Markdown docs or call the MCP server instead of guessing.",
  "The user wants copy-and-own source code under the MIT license rather than an npm dependency.",
]

const agentWhenNotToUse = [
  "The project is not React, or does not use Tailwind CSS (Vue, Svelte, Angular, plain CSS or CSS-in-JS).",
  "The user wants a packaged design system installed from npm with versioned upgrades; HextaUI code is copied into the project.",
  "Native mobile apps (React Native, Flutter, SwiftUI).",
]

const agentHowToCall = [
  `Docs: append \`.md\` to any docs URL, for example ${absoluteUrl("/docs/button.md")}, or start from ${absoluteUrl("/llms.txt")}.`,
  `Install: \`npx shadcn@latest add ${siteUrl}/r/<name>.json\`. The catalog of names is ${absoluteUrl("/mcp/index.json")} and the registry index is ${absoluteUrl("/r/registry.json")}.`,
  `MCP: connect to ${absoluteUrl("/mcp")} (Streamable HTTP, read-only, no key) for search_docs, get_component, get_component_api, get_examples and get_install_command. Setup: ${absoluteUrl("/docs/mcp")}.`,
  `HTTP API: ${absoluteUrl("/openapi.json")} describes every endpoint; errors are RFC 9457 problem+json with a \`resolution\` hint. Docs: ${absoluteUrl("/docs/api")}.`,
  `Pro blocks: send \`Authorization: Bearer <token>\` with a token from ${absoluteUrl("/account")} to ${siteUrl}/r/pro/<name>.json.`,
]

const bullets = (items: string[]) => items.map((item) => `- ${item}`).join("\n")

function getAgentGuideMarkdown(level = 2) {
  const heading = "#".repeat(level)
  return [
    `${heading} When to use ${siteName}`,
    bullets(agentWhenToUse),
    `${heading} When not to use it`,
    bullets(agentWhenNotToUse),
    `${heading} How an agent should call ${siteName}`,
    bullets(agentHowToCall),
  ].join("\n\n")
}

function getHomeMarkdown() {
  return `${[
    `# ${siteName}: ready-to-use blocks and components built on top of shadcn/ui`,
    `> ${siteSummary}`,
    `${siteName} has ${docsComponents.length} components, ${docsHooks.length} hooks and ${docsUtilities.length} utilities for React, built on Base UI and Tailwind CSS v4. You add them with the shadcn CLI, the source lands in your project and it is yours to change. ${siteName} Pro adds paid, ready-made blocks for AI chat interfaces and app layouts.`,
    getAgentGuideMarkdown(2),
    "## Conventions",
    bullets(agentNotes),
    "## Links",
    bullets([
      `[Docs](${absoluteUrl("/docs")}): introduction, installation and every component (Markdown: ${absoluteUrl("/docs.md")})`,
      `[Components](${absoluteUrl("/components")}): live previews of every component`,
      `[Blocks](${absoluteUrl("/blocks")}): ${siteName} Pro blocks`,
      `[Installation](${absoluteUrl("/docs/installation.md")}): shadcn CLI setup and theme tokens`,
      `[MCP server](${absoluteUrl("/docs/mcp.md")}): connect Claude Code, Cursor, VS Code and other assistants`,
      `[API](${absoluteUrl("/docs/api.md")}): HTTP endpoints, authentication and errors; OpenAPI at ${absoluteUrl("/openapi.json")}`,
      `[llms.txt](${absoluteUrl("/llms.txt")}) and [llms-full.txt](${absoluteUrl("/llms-full.txt")})`,
      `[About](${absoluteUrl("/about")}), [Contact](${absoluteUrl("/contact")}), [Privacy](${absoluteUrl("/legal/privacy")}), [Terms](${absoluteUrl("/legal/terms")})`,
      `[Source on GitHub](${siteRepository})`,
    ]),
  ].join("\n\n")}\n`
}

function getNotFoundMarkdown() {
  return `${[
    "# Page not found",
    `There is no ${siteName} page at this URL. It may have moved, or the link may have a typo.`,
    "## Where to go instead",
    bullets([
      `[llms.txt](${absoluteUrl("/llms.txt")}): every docs page as Markdown`,
      `[Docs](${absoluteUrl("/docs.md")}): introduction and quick start`,
      `[Sitemap](${absoluteUrl("/sitemap.xml")}): every public page`,
      `[OpenAPI](${absoluteUrl("/openapi.json")}): HTTP endpoints`,
      `[MCP server](${absoluteUrl("/mcp")}): search the docs as tools`,
    ]),
    `Component docs live at ${siteUrl}/docs/<name>.md, for example ${absoluteUrl("/docs/button.md")}.`,
  ].join("\n\n")}\n`
}

function getSkillMarkdown() {
  return `${[
    "---",
    "name: hextaui",
    `description: Build React interfaces with ${siteName}, accessible shadcn/ui-compatible components on Base UI and Tailwind CSS v4. Use when adding or customizing dialogs, selects, comboboxes, data tables, toasts, sidebars or AI chat UI in a shadcn/ui project, or when you need a ${siteName} component's props, examples or install command.`,
    "---",
    `# ${siteName}`,
    `${siteSummary} Maintained by ${siteAuthor} (${siteContactEmail}).`,
    getAgentGuideMarkdown(2),
    "## Conventions",
    bullets(agentNotes),
    "## Workflow",
    bullets([
      `Find the component: fetch ${absoluteUrl("/mcp/index.json")} or call the MCP tool search_docs.`,
      `Read its docs before writing code: ${siteUrl}/docs/<name>.md lists props, data attributes, keyboard support and examples.`,
      `Install it: \`npx shadcn@latest add ${siteUrl}/r/<name>.json\`.`,
      "Compose with the `render` prop and the documented data attributes instead of rewriting the component.",
    ]),
  ].join("\n\n")}\n`
}

export {
  agentHowToCall,
  agentWhenNotToUse,
  agentWhenToUse,
  getAgentGuideMarkdown,
  getHomeMarkdown,
  getNotFoundMarkdown,
  getSkillMarkdown,
}
