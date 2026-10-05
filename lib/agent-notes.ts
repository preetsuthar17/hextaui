import { siteUrl } from "@/lib/site"

const agentNotes = [
  `Install a component with the shadcn CLI: \`npx shadcn@latest add ${siteUrl}/r/<name>.json\`. It adds the source, the HextaUI theme tokens and any HextaUI components it depends on. \`${siteUrl}/r/all.json\` installs every component.`,
  "The code is then owned by the project, like shadcn/ui. There is no HextaUI npm package. HextaUI is MIT licensed and free for personal and commercial use.",
  "Behavior and accessibility come from Base UI (`@base-ui/react`). Compose with the `render` prop, not `asChild`.",
  "Styling uses Tailwind CSS v4 with theme tokens. Merge classes with `cn` from the `cn` package.",
  "Icons come from `@tabler/icons-react`.",
  "Import components from `@/components/ui/<name>`, hooks from `@/hooks/<name>` and utilities from `@/lib/<name>`.",
]

export { agentNotes }
