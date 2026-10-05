import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

const sides = ["top", "inline-end", "bottom", "inline-start"] as const

export function HoverCardSides() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {sides.map((side) => (
        <HoverCard key={side}>
          <HoverCardTrigger
            href="#"
            delay={200}
            render={
              <Button variant="outline" nativeButton={false} render={<a />} />
            }
          >
            {side}
          </HoverCardTrigger>
          <HoverCardContent side={side} className="w-48">
            Opens on the {side} side, and flips when there isn’t room.
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  )
}
