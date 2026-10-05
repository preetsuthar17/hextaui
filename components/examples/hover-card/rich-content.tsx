import { IconExternalLink, IconStar } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

export function HoverCardRichContent() {
  return (
    <HoverCard>
      <HoverCardTrigger
        href="https://github.com/preetsuthar17"
        render={<Button variant="link" nativeButton={false} render={<a />} />}
      >
        hextaui/components
      </HoverCardTrigger>
      <HoverCardContent className="w-72">
        <div className="flex flex-col gap-2">
          <p className="font-medium">hextaui/components</p>
          <p className="text-muted-foreground">
            Copy-paste React components with motion, keyboard support and RTL
            built in.
          </p>
          <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <IconStar className="size-3.5" aria-hidden="true" />
              2.4k
            </span>
            <a
              href="https://github.com/preetsuthar17"
              className="flex items-center gap-1 text-foreground underline-offset-4 hover:underline"
            >
              Open on GitHub
              <IconExternalLink className="size-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
