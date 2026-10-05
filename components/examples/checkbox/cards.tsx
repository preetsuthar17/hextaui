import { Checkbox, CheckboxGroup } from "@/components/ui/checkbox"

const addOns = [
  { value: "analytics", title: "Analytics", text: "Dashboards and exports." },
  { value: "backups", title: "Backups", text: "Daily snapshots, 30 days." },
]

export function CheckboxCards() {
  return (
    <CheckboxGroup
      aria-label="Add-ons"
      defaultValue={["analytics"]}
      className="w-full max-w-md"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {addOns.map((addOn) => (
          <label
            key={addOn.value}
            className="flex items-start gap-3 rounded-xl border p-4 text-sm transition-colors has-data-checked:border-primary"
          >
            <span className="flex h-5 items-center">
              <Checkbox value={addOn.value} />
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="leading-5 font-medium">{addOn.title}</span>
              <span className="text-muted-foreground">{addOn.text}</span>
            </span>
          </label>
        ))}
      </div>
    </CheckboxGroup>
  )
}
