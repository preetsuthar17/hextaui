import { Textarea } from "@/components/ui/textarea"

export function TextareaFixed() {
  return (
    <Textarea
      aria-label="Notes"
      autoResize={false}
      minRows={4}
      placeholder="Fixed height. Drag the corner to resize."
      className="max-w-sm"
    />
  )
}
