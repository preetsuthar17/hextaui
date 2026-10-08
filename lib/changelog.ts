type ChangelogEntry = {
  date: string
  title: string
  body: string[]
  added?: string[]
  changed?: string[]
  removed?: string[]
}

const changelogGroups = [
  { key: "added", heading: "Added" },
  { key: "changed", heading: "Changed" },
  { key: "removed", heading: "Removed" },
] as const

const changelog: ChangelogEntry[] = [
  {
    date: "2026-10-08",
    title: "Settings blocks, Diff Review and Artifact",
    body: [
      "11 new Pro blocks, a Team plan, a free Prompt Input, and a round of touch and focus fixes across the components.",
    ],
    added: [
      "Settings blocks for AI products: a Settings shell plus Profile, Appearance, Models, Notifications, API keys, Billing, Security and Team pages.",
      "Diff Review: review an agent's edits across files, accept or reject each change, comment on lines and send them back to the agent, with unified and split views.",
      "Artifact: the panel beside a chat for generated pages, documents and code, with a sandboxed preview and versions you can compare and restore. HextaAI now opens artifacts from its chat.",
      "Team plan for up to 10 developers on one invoice. Add and remove teammates by email from your account, and keep one shared token in CI.",
      "Prompt Input is free. Install it with no account or token, and see how a Pro block holds up before you buy.",
      "Release emails for new changelog entries, with one-click unsubscribe and a switch on your account page.",
      "A sponsor slot under the table of contents on docs and block pages, from /sponsor.",
      "Button: a ghost-destructive variant for quiet row actions like Sign out or Remove.",
      "This changelog, and Pricing in the header.",
    ],
    changed: [
      "Pro is now split into Solo and Team plans. The early-bird price ends on 30 November 2026.",
      "Refunds now run 30 days, up from 14, no questions asked.",
      "Code Block lines gain gutter bars, a comment slot and hanging indents, and Prompt Input's effort slider has a labelled standalone variant.",
      "Code is set in Paper Mono.",
      "Button: xs and sm sizes get larger hit areas on touch screens without changing how they look.",
      "Switch: controlled switches flip right away, and the spinner only shows when saving takes longer than 400ms.",
      "Collapsible keeps sticky content pinned while it animates, and Resizable stops animating with reduced motion.",
      "Focus rings stay visible inside scrolling Tabs, Navigation Menu, Table and the docs table of contents.",
    ],
  },
  {
    date: "2026-10-07",
    title: "Agent harness for Prompt Input",
    body: [
      "Prompt Input learned to drive coding agents, the homepage went live, and the whole site became readable by AI agents.",
    ],
    added: [
      "Prompt Input: an inset footer for agent harnesses, with pickers for the mode, where it runs and which folder it works in, plus one control for the model and effort.",
      "Grid, one-per-row and list views on Components and Blocks.",
      "Agents can read every page as Markdown, plus an OpenAPI spec, /pricing.md, per-section llms.txt files, read-only WebMCP tools and an Agent Plugin.",
    ],
    changed: [
      "The homepage now runs four Pro blocks and a set of component demos live.",
      "Previews load as they come into view, and pages with block previews no longer freeze while scrolling.",
      "Upgraded to Next.js 16.4.",
    ],
    removed: ["/auth.md. Authentication is documented in the API reference."],
  },
  {
    date: "2026-10-06",
    title: "HextaUI Pro",
    body: [
      "The first Pro blocks, accounts to unlock them, and a batch of new component options.",
    ],
    added: [
      "11 Pro blocks: Chat Thread, Chat Sidebar, Prompt Input, Streaming Text, Thinking, Tool Calls, Agent Todos, Code Block, Markdown, Voice Mode and the full Hexta AI assistant.",
      "Block pages with an overview, anatomy, API reference, keyboard map, accessibility notes and AI SDK examples. Install with the shadcn CLI.",
      "Sign in with GitHub or Google. Accounts with the same verified email are linked.",
      "Privacy, terms, refund and Pro license pages.",
      "Badge: muted appearance and pill shape. Button and Toggle: pill shape. Button: icon-xl size.",
      'DropdownMenu: indicator="end" for checkbox and radio items. Card: flush size. Sidebar: gap and full-screen mobile options.',
      "A text-shimmer utility with reduced-motion and forced-colors fallbacks.",
    ],
    changed: [
      "HoverCard keeps the side it first opened on instead of flipping when space runs out.",
      "Apple devices use the system font. Everything else keeps Inter.",
      "Analytics only load after you allow them in the cookie banner.",
    ],
  },
  {
    date: "2026-10-05",
    title: "HextaUI v2",
    body: ["The component library, rebuilt on Base UI and Tailwind CSS v4."],
    added: [
      "Tests for every component, and docs with live examples for every state.",
      "The @hextaui shadcn registry.",
      "A hosted MCP server, llms.txt and Markdown docs for AI coding agents.",
    ],
  },
]

export { changelog, changelogGroups, type ChangelogEntry }
