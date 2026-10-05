import { Checkbox } from "@/components/ui/checkbox"

export function CheckboxDemo() {
  return (
    <div className="flex flex-col gap-3">
      <label className="flex items-center gap-3 text-sm">
        <Checkbox />
        Email me about product updates
      </label>
      <label className="flex items-center gap-3 text-sm">
        <Checkbox defaultChecked />
        Remember this device
      </label>
      <label className="flex max-w-sm items-start gap-3 text-sm">
        <span className="flex h-5 items-center">
          <Checkbox />
        </span>
        <span className="flex flex-col gap-0.5">
          <span className="leading-5 font-medium">Mentions and replies</span>
          <span className="text-muted-foreground">
            We’ll only notify you about activity on your own posts.
          </span>
        </span>
      </label>
    </div>
  )
}
