import { Bubble, BubbleContent } from "@/components/ui/bubble"

export function BubbleNested() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Bubble align="end">
        <BubbleContent>
          <Bubble variant="tinted">
            <BubbleContent>Original: can we ship Friday?</BubbleContent>
          </Bubble>
          <p className="pt-2">Yes, Friday works.</p>
        </BubbleContent>
      </Bubble>
    </div>
  )
}
