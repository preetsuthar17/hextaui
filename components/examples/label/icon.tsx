import { IconLock } from "@tabler/icons-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LabelIcon() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="label-icon-key">
        <IconLock aria-hidden="true" />
        API key
      </Label>
      <Input id="label-icon-key" defaultValue="sk_live_51H…" readOnly />
    </div>
  )
}
