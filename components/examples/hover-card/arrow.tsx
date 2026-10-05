import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

export function HoverCardArrowDemo() {
  return (
    <HoverCard>
      <HoverCardTrigger
        href="#"
        delay={200}
        render={
          <Button variant="outline" nativeButton={false} render={<a />} />
        }
      >
        Release notes
      </HoverCardTrigger>
      <HoverCardContent arrow side="top" className="w-56">
        Version 2.4 adds shared hover cards and smoother text areas.
      </HoverCardContent>
    </HoverCard>
  )
}
