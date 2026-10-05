import { ScrollArea } from "@/components/ui/scroll-area"

const tags = [
  "Design systems",
  "Motion",
  "Accessibility",
  "Typography",
  "Color",
  "Layout",
  "Forms",
  "Data tables",
  "Charts",
  "Navigation",
  "Overlays",
  "Feedback",
]

export function ScrollAreaHorizontal() {
  return (
    <ScrollArea
      scrollbars="horizontal"
      className="w-full max-w-md rounded-lg border"
    >
      <div className="flex w-max gap-2 p-3">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border px-3 py-1 text-sm whitespace-nowrap"
          >
            {tag}
          </span>
        ))}
      </div>
    </ScrollArea>
  )
}
