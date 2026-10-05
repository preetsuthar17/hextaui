import {
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
} from "@/components/ui/bubble"

export function BubbleTail() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Bubble shape="tail">
        <BubbleContent>Pushed the fix, can you take a look?</BubbleContent>
      </Bubble>
      <Bubble shape="tail" variant="secondary" align="end">
        <BubbleContent>Looks good. Merging after CI passes.</BubbleContent>
      </Bubble>
      <Bubble shape="tail" variant="muted">
        <BubbleContent>Jamie joined the conversation</BubbleContent>
      </Bubble>
      <Bubble shape="tail" variant="tinted" align="end">
        <BubbleContent>Pinned: release notes are in the doc.</BubbleContent>
      </Bubble>
      <Bubble shape="tail" variant="outline">
        <BubbleContent>Outline bubbles never get a tail.</BubbleContent>
      </Bubble>
      <Bubble shape="tail" variant="destructive" align="end">
        <BubbleContent>Message failed to send. Tap to retry.</BubbleContent>
      </Bubble>
      <Bubble shape="tail" align="end">
        <BubbleContent>Reactions sit on the top corner.</BubbleContent>
        <BubbleReactions side="top" align="start" role="img" aria-label="Heart">
          <span>❤️</span>
        </BubbleReactions>
      </Bubble>
      <Bubble shape="tail" variant="secondary">
        <BubbleContent>ok</BubbleContent>
      </Bubble>
      <BubbleGroup shape="tail">
        <Bubble variant="secondary">
          <BubbleContent>Only the last bubble in a group</BubbleContent>
        </Bubble>
        <Bubble variant="secondary">
          <BubbleContent>gets the tail.</BubbleContent>
        </Bubble>
      </BubbleGroup>
    </div>
  )
}
