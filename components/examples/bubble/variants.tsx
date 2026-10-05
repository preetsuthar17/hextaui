import { IconAlertCircle } from "@tabler/icons-react"

import { Bubble, BubbleContent } from "@/components/ui/bubble"

export function BubbleVariants() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Bubble>
        <BubbleContent>Pushed the fix, can you take a look?</BubbleContent>
      </Bubble>
      <Bubble variant="secondary">
        <BubbleContent>Looks good. Merging after CI passes.</BubbleContent>
      </Bubble>
      <Bubble variant="muted">
        <BubbleContent>Jamie joined the conversation</BubbleContent>
      </Bubble>
      <Bubble variant="tinted">
        <BubbleContent>Pinned: release notes are in the doc.</BubbleContent>
      </Bubble>
      <Bubble variant="outline">
        <BubbleContent>Here is the summary you asked for.</BubbleContent>
      </Bubble>
      <Bubble variant="ghost">
        <BubbleContent>
          Ghost bubbles drop the frame so assistant replies can span the full
          row and read like a document.
        </BubbleContent>
      </Bubble>
      <Bubble variant="destructive">
        <BubbleContent>
          <IconAlertCircle /> Message failed to send. Tap to retry.
        </BubbleContent>
      </Bubble>
    </div>
  )
}
