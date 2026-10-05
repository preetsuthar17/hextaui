import { ScrollArea } from "@/components/ui/scroll-area"

export function ScrollAreaText() {
  return (
    <ScrollArea className="h-48 w-full max-w-md rounded-lg border">
      <div className="flex flex-col gap-3 p-4 text-sm leading-6">
        {Array.from({ length: 6 }, (_, index) => (
          <p key={index}>
            Vernacular architecture is building done outside any academic
            tradition, and without professional guidance. It reflects local
            traditions, materials and climate, and makes up most of the world’s
            built environment.
          </p>
        ))}
      </div>
    </ScrollArea>
  )
}
