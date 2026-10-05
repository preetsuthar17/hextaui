import { Input } from "@/components/ui/input"

export function InputSizes() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Input size="sm" aria-label="Small" placeholder="Small" />
      <Input aria-label="Default" placeholder="Default" />
      <Input size="lg" aria-label="Large" placeholder="Large" />
    </div>
  )
}
