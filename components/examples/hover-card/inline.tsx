import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

export function HoverCardInline() {
  return (
    <p className="max-w-sm text-sm text-muted-foreground">
      Built on{" "}
      <HoverCard>
        <HoverCardTrigger
          href="https://base-ui.com"
          render={
            <a className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground" />
          }
        >
          Base UI
        </HoverCardTrigger>
        <HoverCardContent className="w-60">
          Unstyled, accessible React primitives from the creators of Radix,
          Floating UI and Material UI.
        </HoverCardContent>
      </HoverCard>{" "}
      primitives, styled with Tailwind CSS and theme tokens, and ready to copy
      into your project.
    </p>
  )
}
