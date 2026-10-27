type Tool = {
  slug: string
  title: string
  description: string
  status: "live" | "soon"
  layout: "app" | "page"
}

const tools: Tool[] = [
  {
    slug: "theme-editor",
    title: "Theme editor",
    description:
      "Make a shadcn/ui theme from one color, a preset or an image. Check contrast, preview real components and Pro blocks, then copy the CSS or install it.",
    status: "live",
    layout: "app",
  },
  {
    slug: "testimonial-wall",
    title: "Testimonial wall builder",
    description:
      "Turn customer quotes and X posts into a masonry, marquee, grid or carousel wall, then copy the React code, a PNG or a share link.",
    status: "live",
    layout: "page",
  },
  {
    slug: "page-builder",
    title: "Page builder",
    description:
      "Compose a landing page from free shadcn/ui sections, edit it live and export clean Next.js code.",
    status: "live",
    layout: "page",
  },
]

const toolsTitle = "Free tools for shadcn/ui"
const toolsDescription =
  "Free browser tools from HextaUI for shadcn/ui projects. No account and nothing to install: make what you need, then copy the code or add it with the CLI."

function getToolHref(slug: string) {
  return `/tools/${slug}`
}

function isAppToolPath(pathname: string) {
  return tools.some(
    (tool) => tool.layout === "app" && pathname === getToolHref(tool.slug)
  )
}

function getLiveTools() {
  return tools.filter((tool) => tool.status === "live")
}

export {
  getLiveTools,
  getToolHref,
  isAppToolPath,
  tools,
  toolsDescription,
  toolsTitle,
  type Tool,
}
