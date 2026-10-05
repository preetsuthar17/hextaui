import { Bubble, BubbleContent } from "@/components/ui/bubble"

export function BubbleAlignment() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Bubble variant="secondary" align="start">
        <BubbleContent>Aligned to the start.</BubbleContent>
      </Bubble>
      <Bubble align="end">
        <BubbleContent>Aligned to the end.</BubbleContent>
      </Bubble>
    </div>
  )
}
