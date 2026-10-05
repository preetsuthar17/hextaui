import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

export function HoverCardDelay() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <HoverCard>
        <HoverCardTrigger
          href="#"
          render={
            <Button variant="outline" nativeButton={false} render={<a />} />
          }
        >
          Default (600ms)
        </HoverCardTrigger>
        <HoverCardContent className="w-56">
          Waits long enough that passing the pointer over the link doesn’t open
          it.
        </HoverCardContent>
      </HoverCard>
      <HoverCard>
        <HoverCardTrigger
          href="#"
          delay={150}
          closeDelay={100}
          render={
            <Button variant="outline" nativeButton={false} render={<a />} />
          }
        >
          Fast (150ms)
        </HoverCardTrigger>
        <HoverCardContent className="w-56">
          Opens almost right away and closes quickly.
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}
