type Tool = {
  slug: string
  title: string
  description: string
  status: "live" | "soon"
}

const tools: Tool[] = [
  {
    slug: "theme-editor",
    title: "Theme editor",
    description:
      "Make a shadcn/ui theme from one color, a preset or an image. Check contrast, preview real components and Pro blocks, then copy the CSS or install it.",
    status: "live",
  },
  {
    slug: "testimonial-wall",
    title: "Testimonial wall",
    description:
      "Turn posts and quotes into a testimonial wall for your landing page.",
    status: "soon",
  },
  {
    slug: "page-builder",
    title: "Page builder",
    description:
      "Put a landing page together from HextaUI sections and export the code.",
    status: "soon",
  },
]

const toolsTitle = "Free tools for shadcn/ui"
const toolsDescription =
  "Free browser tools from HextaUI for shadcn/ui projects. No account and nothing to install: make what you need, then copy the code or add it with the CLI."

function getToolHref(slug: string) {
  return `/tools/${slug}`
}

function getLiveTools() {
  return tools.filter((tool) => tool.status === "live")
}

export {
  getLiveTools,
  getToolHref,
  tools,
  toolsDescription,
  toolsTitle,
  type Tool,
}
