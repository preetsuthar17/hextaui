import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function ToggleGroupDisabled() {
  return (
    <div className="flex flex-col items-center gap-4">
      <ToggleGroup aria-label="Plan" defaultValue={["pro"]}>
        <ToggleGroupItem value="free">Free</ToggleGroupItem>
        <ToggleGroupItem value="pro">Pro</ToggleGroupItem>
        <ToggleGroupItem value="team" disabled>
          Team
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup
        disabled
        variant="outline"
        aria-label="Billing"
        defaultValue={["monthly"]}
      >
        <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
        <ToggleGroupItem value="yearly">Yearly</ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
