import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble"

export function BubbleGroupDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <BubbleGroup>
        <Bubble variant="secondary">
          <BubbleContent>Hey!</BubbleContent>
        </Bubble>
        <Bubble variant="secondary">
          <BubbleContent>Did the deploy land?</BubbleContent>
        </Bubble>
        <Bubble variant="secondary">
          <BubbleContent>
            Asking because the dashboard still shows the old build number and I
            want to confirm before I post the announcement.
          </BubbleContent>
        </Bubble>
      </BubbleGroup>
      <BubbleGroup>
        <Bubble align="end">
          <BubbleContent>It did.</BubbleContent>
        </Bubble>
        <Bubble align="end">
          <BubbleContent>Hard refresh 🙏</BubbleContent>
        </Bubble>
      </BubbleGroup>
      <BubbleGroup>
        <Bubble variant="outline">
          <BubbleContent>A single bubble in a group stays round.</BubbleContent>
        </Bubble>
      </BubbleGroup>
    </div>
  )
}
