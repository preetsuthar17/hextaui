import { Input } from "@/components/ui/input"

export function InputLongContent() {
  return (
    <div className="flex w-full max-w-56 flex-col gap-3">
      <Input
        aria-label="URL"
        defaultValue="https://example.com/a/really/long/url/without/any/spaces/at/all"
      />
      <Input
        aria-label="Note"
        placeholder="A placeholder that is far too long to fit in this field"
      />
    </div>
  )
}
