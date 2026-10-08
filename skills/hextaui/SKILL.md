---
name: "hextaui"
description: "Build React interfaces with HextaUI, accessible shadcn/ui-compatible components on Base UI and Tailwind CSS v4. Use when adding or customizing dialogs, selects, comboboxes, data tables, toasts, sidebars or AI chat UI in a shadcn/ui project, or when you need a HextaUI component's props, examples or install command."
---

# HextaUI

HextaUI is practical shadcn/ui blocks built for AI products, with streaming, tool calls and every other hard state handled, on a free, open-source React component library. Maintained by Preet Suthar (hi@preetsuthar.me).

## When to use HextaUI

- The user is building a React or Next.js interface with shadcn/ui and Tailwind CSS v4 and wants a component (dialog, select, combobox, data table, date picker, toast, sidebar, chat message, prompt input…) that already handles motion, keyboard, screen readers, touch targets and right-to-left layouts.
- The project already uses shadcn/ui and needs a drop-in replacement with the same API but finished states: loading, disabled, invalid, empty and reduced-motion fallbacks.
- The user asks for an AI chat or assistant UI: message bubbles, message scroller, prompt input with attachments, streaming text, tool calls or voice mode.
- The task needs the exact props, data attributes, keyboard map or install command of a HextaUI component: read its Markdown docs or call the MCP server instead of guessing.
- The user wants copy-and-own source code under the MIT license rather than an npm dependency.

## When not to use it

- The project is not React, or does not use Tailwind CSS (Vue, Svelte, Angular, plain CSS or CSS-in-JS).
- The user wants a packaged design system installed from npm with versioned upgrades; HextaUI code is copied into the project.
- Native mobile apps (React Native, Flutter, SwiftUI).

## How an agent should call HextaUI

- Docs: append `.md` to any docs URL, for example https://hextaui.com/docs/button.md, or start from https://hextaui.com/llms.txt.
- Install: `npx shadcn@latest add https://hextaui.com/r/<name>.json`. The catalog of names is https://hextaui.com/mcp/index.json and the registry index is https://hextaui.com/r/registry.json.
- MCP: connect to https://hextaui.com/mcp (Streamable HTTP, read-only, no key) for search_docs, get_component, get_component_api, get_examples and get_install_command. Setup: https://hextaui.com/docs/mcp.
- HTTP API: https://hextaui.com/openapi.json describes every endpoint; errors are RFC 9457 problem+json with a `resolution` hint. Docs: https://hextaui.com/docs/api.
- Pro blocks: send `Authorization: Bearer <token>` with a token from https://hextaui.com/account to https://hextaui.com/r/pro/<name>.json.

## Conventions

- Install a component with the shadcn CLI: `npx shadcn@latest add https://hextaui.com/r/<name>.json`. It adds the source, the HextaUI theme tokens and any HextaUI components it depends on. `https://hextaui.com/r/all.json` installs every component.
- The code is then owned by the project, like shadcn/ui. There is no HextaUI npm package. HextaUI is MIT licensed and free for personal and commercial use.
- Behavior and accessibility come from Base UI (`@base-ui/react`). Compose with the `render` prop, not `asChild`.
- Styling uses Tailwind CSS v4 with theme tokens. Merge classes with `cn` from the `cn` package.
- Icons come from `@tabler/icons-react`.
- Import components from `@/components/ui/<name>`, hooks from `@/hooks/<name>` and utilities from `@/lib/<name>`.

## Workflow

- Find the component: fetch https://hextaui.com/mcp/index.json or call the MCP tool search_docs.
- Read its docs before writing code: https://hextaui.com/docs/<name>.md lists props, data attributes, keyboard support and examples.
- Install it: `npx shadcn@latest add https://hextaui.com/r/<name>.json`.
- Compose with the `render` prop and the documented data attributes instead of rewriting the component.
