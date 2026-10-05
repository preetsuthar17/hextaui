import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble"

const shapes = [
  { shape: "uniform", description: "Every bubble fully round." },
  {
    shape: "joined",
    description: "Grouped corners tighten on the sender side.",
  },
  { shape: "tail", description: "The last bubble of a group gets a tail." },
] as const

export function BubbleShapes() {
  return (
    <div className="flex w-full max-w-md flex-col gap-10">
      {shapes.map(({ shape, description }) => (
        <div key={shape} className="flex flex-col gap-3">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{shape}</span>{" "}
            {description}
          </p>
          <BubbleGroup shape={shape}>
            <Bubble variant="secondary">
              <BubbleContent>Hey!</BubbleContent>
            </Bubble>
            <Bubble variant="secondary">
              <BubbleContent>Did the deploy land?</BubbleContent>
            </Bubble>
          </BubbleGroup>
          <BubbleGroup shape={shape}>
            <Bubble align="end">
              <BubbleContent>It did.</BubbleContent>
            </Bubble>
            <Bubble align="end">
              <BubbleContent>
                Hard refresh and you should see build 1482 on the dashboard.
              </BubbleContent>
            </Bubble>
          </BubbleGroup>
          <Bubble shape={shape} variant="secondary">
            <BubbleContent>Perfect 🙏</BubbleContent>
          </Bubble>
        </div>
      ))}
    </div>
  )
}
