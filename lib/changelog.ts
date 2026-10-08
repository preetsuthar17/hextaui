type ChangelogEntry = {
  date: string
  label?: string
  title: string
  body: string[]
}

const upcoming: ChangelogEntry[] = [
  {
    date: "2026-12-01",
    label: "December 2026",
    title: "Account and settings blocks",
    body: [
      "The screens every product needs once the chat works: profile, team members and invites, API keys, billing and usage, notification preferences, sessions and security.",
      "Unsaved changes, pending invites, revoking a key and downgrading a plan are handled, like every other block. Early-bird prices end on 30 November, and everyone who bought keeps every new block.",
    ],
  },
]

const changelog: ChangelogEntry[] = [
  {
    date: "2026-10-08",
    title: "Team plan and a free block",
    body: [
      "HextaUI Pro now comes in two plans. Solo covers one developer. Team covers up to 10 on one invoice: add and remove teammates by email from your account, and keep one shared token in CI.",
      "Prompt Input is free. Install it in your own project with no account or token, and see how a Pro block holds up before you buy. Refunds now run 30 days, no questions asked, and the early-bird price ends on 30 November 2026.",
    ],
  },
  {
    date: "2026-10-07",
    title: "Agent harness for Prompt Input",
    body: [
      "Prompt Input gained an inset footer for agent harnesses, with pickers for the mode, where it runs and which folder it works in, plus one control for the model and effort.",
      "The homepage now runs four Pro blocks live, and agents can read the whole site as Markdown.",
    ],
  },
  {
    date: "2026-10-06",
    title: "HextaUI Pro",
    body: [
      "The first 11 Pro blocks: Chat Thread, Chat Sidebar, Prompt Input, Streaming Text, Thinking, Tool Calls, Agent Todos, Code Block, Markdown, Voice Mode and the full Hexta AI assistant.",
      "Every block comes with an overview, anatomy, API reference, keyboard map, accessibility notes and AI SDK examples. Sign in with GitHub or Google, and install with the shadcn CLI.",
    ],
  },
  {
    date: "2026-10-05",
    title: "HextaUI v2",
    body: [
      "The component library, rebuilt on Base UI and Tailwind CSS v4 with tests for every component, docs with live examples for every state, the @hextaui shadcn registry and a hosted MCP server for AI coding agents.",
    ],
  },
]

export { changelog, upcoming, type ChangelogEntry }
