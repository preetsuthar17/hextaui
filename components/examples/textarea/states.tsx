import { Textarea } from "@/components/ui/textarea"

export function TextareaStates() {
  return (
    <div className="grid w-full max-w-md gap-4 sm:grid-cols-3">
      <Textarea
        aria-label="Disabled"
        disabled
        placeholder="Disabled"
        minRows={2}
      />
      <Textarea
        aria-label="Read-only"
        readOnly
        defaultValue="Read-only text you can select but not change."
        minRows={2}
      />
      <Textarea
        aria-label="Invalid"
        aria-invalid
        placeholder="Invalid"
        minRows={2}
      />
    </div>
  )
}
