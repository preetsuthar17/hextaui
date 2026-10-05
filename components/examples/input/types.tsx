import { Input } from "@/components/ui/input"

export function InputTypes() {
  return (
    <div className="grid w-full max-w-sm gap-3">
      <Input type="password" aria-label="Password" defaultValue="hunter2" />
      <Input type="number" aria-label="Seats" defaultValue={12} min={1} />
      <Input type="search" aria-label="Search" placeholder="Search…" />
      <Input type="date" aria-label="Start date" defaultValue="2026-10-03" />
      <Input type="time" aria-label="Start time" defaultValue="09:30" />
    </div>
  )
}
