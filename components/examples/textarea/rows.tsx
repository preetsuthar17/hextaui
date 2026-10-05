import { Textarea } from "@/components/ui/textarea"

export function TextareaRows() {
  return (
    <div className="grid w-full max-w-md gap-4 sm:grid-cols-2">
      <Textarea
        aria-label="One to four rows"
        minRows={1}
        maxRows={4}
        placeholder="1–4 rows"
      />
      <Textarea
        aria-label="Five to fifteen rows"
        minRows={5}
        maxRows={15}
        placeholder="5–15 rows"
      />
    </div>
  )
}
