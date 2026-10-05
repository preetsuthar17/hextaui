import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

export function HoverCardLongContent() {
  return (
    <HoverCard>
      <HoverCardTrigger
        href="#"
        render={<Button variant="link" nativeButton={false} render={<a />} />}
      >
        Long preview
      </HoverCardTrigger>
      <HoverCardContent>
        <p className="font-medium">
          https://example.com/a/really/long/url/without/any/spaces/at/all
        </p>
        <p className="text-muted-foreground">
          Long previews wrap inside the card, and when the card is taller than
          the space around the trigger it scrolls instead of leaving the screen.
          Keep previews short, though: everything here should also be on the
          linked page.
        </p>
      </HoverCardContent>
    </HoverCard>
  )
}
