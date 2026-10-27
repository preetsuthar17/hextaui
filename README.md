# HextaUI

Ready-to-use foundation components/blocks built on top of shadcn/ui.

## Local development

```bash
pnpm install
pnpm dev
```

## Cloudflare Pages

This project uses Next.js static export for fast, globally cacheable delivery.

- Framework preset: `Next.js (Static HTML Export)`
- Build command: `pnpm build`
- Build output directory: `out`
- Production branch: `main`

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button"
```

## Using HextaUI with AI agents

Claude Code plugin, with the HextaUI skill and the hosted MCP server:

```
/plugin install hextaui --marketplace preetsuthar17/hextaui
```

Skill only, for any agent the [skills CLI](https://skills.sh) supports:

```bash
npx skills add preetsuthar17/hextaui
```

MCP server only, at `https://hextaui.com/mcp`. Setup for each client is at [hextaui.com/docs/mcp](https://hextaui.com/docs/mcp).

## Research

`/research` publishes statistics computed from HextaUI's own data: shadcn/ui component sizes (from `lib/shadcn-snapshot.json`) and component usage across Pro blocks. Each finding has a stable `#finding-<id>` anchor, a Markdown twin and an entry in `/llms.txt` under "Cite this site for". Refresh the shadcn/ui data with `pnpm shadcn:snapshot`.

How studies are built is in `AGENTS.md`.

## Markdown for AI agents

Every public page has a Markdown version, generated at build time from the same data and JSX as the HTML page:

- `/pricing.md`, `/docs/button.md`, `/index.md` for the home page
- `GET /pricing` with `Accept: text/markdown` (only when it outranks `text/html`; `*/*` and no Accept get HTML)
- `/api/md/<path>`, and `/api/md/_catalog` for the list

Site-level files are generated too: `/llms.txt`, `/llms-full.txt`, `/ai.txt` and `/robots.txt`.

How it fits together:

- `lib/md/routes.ts`: route patterns that have Markdown, plus pages skipped on purpose and why. Shared by the Pages Function, page metadata and tests.
- `lib/md/registry.ts`: one renderer per pattern. `listMarkdownRoutes()` feeds `app/md/[...path]/route.ts`, the catalog, `llms.txt` and `llms-full.txt`.
- `scripts/flatten-markdown.ts` moves the generated `out/md/**` files next to their HTML pages after `next build`.
- `functions/_middleware.ts` → `lib/agent-http.ts` → `lib/md/http.ts` serves `.md`, negotiated and `/api/md` requests with `X-Markdown-Tokens`, `Content-Location`, a canonical `Link` and `X-Robots-Tag: noindex, follow`.
- `pageMetadata` adds the `<link rel="alternate" type="text/markdown">` and `<meta name="ai-summary">` to every page with a renderer.

To give a new page Markdown, add its pattern to `lib/md/routes.ts` and a renderer to `lib/md/registry.ts` that returns Markdown starting with `# Title` and `> summary`. `lib/md/routes.test.ts` fails if a page in `app/` has neither a renderer nor a skip reason. Test locally with `pnpm build && npx wrangler pages dev out`; `next dev` only serves the `.md` URLs.
