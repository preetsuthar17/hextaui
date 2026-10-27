import { docsComponents } from "@/lib/docs"
import type { OgImage } from "@/lib/opengraph-image"

const homeOgImage: OgImage = {
  variant: "hero",
  section: `${docsComponents.length} free components`,
  title: "Ship your AI app’s chat UI this weekend",
  description:
    "Skip weeks of streaming, tool call, voice and agent state work. Drop in shadcn/ui blocks that already handle them.",
}

export { homeOgImage }
