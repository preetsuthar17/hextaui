import {
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
} from "@/components/ui/bubble"

export function BubbleDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Bubble variant="secondary">
        <BubbleContent>
          I checked the registry output and removed the stale route.
        </BubbleContent>
        <BubbleReactions role="img" aria-label="Reactions: thumbs up">
          <span>👍</span>
        </BubbleReactions>
      </Bubble>
      <BubbleGroup>
        <Bubble align="end">
          <BubbleContent>Nice, thanks!</BubbleContent>
        </Bubble>
        <Bubble align="end">
          <BubbleContent>Did the preview deploy pick it up?</BubbleContent>
        </Bubble>
      </BubbleGroup>
      <Bubble variant="ghost">
        <BubbleContent>
          Yes. The preview at build 1482 serves the new route, and the old one
          now returns a 404 as expected.
        </BubbleContent>
      </Bubble>
    </div>
  )
}
