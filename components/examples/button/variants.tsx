import { Button } from "@/components/ui/button"

export function ButtonVariants() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button>Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  )
}
