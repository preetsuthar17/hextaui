import { ScrollArea } from "@/components/ui/scroll-area"

export function ScrollAreaBoth() {
  return (
    <ScrollArea
      scrollbars="both"
      className="h-64 w-full max-w-md rounded-lg border"
    >
      <div className="grid w-max grid-cols-[repeat(10,6rem)] gap-2 p-3">
        {Array.from({ length: 100 }, (_, index) => (
          <div
            key={index}
            className="grid aspect-square place-items-center rounded-md bg-muted text-sm"
          >
            {index + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
