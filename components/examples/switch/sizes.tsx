import { Switch } from "@/components/ui/switch"

export function SwitchSizes() {
  return (
    <div className="flex items-center gap-6">
      <Switch size="sm" aria-label="Small" defaultChecked />
      <Switch aria-label="Default" defaultChecked />
      <Switch size="lg" aria-label="Large" defaultChecked />
    </div>
  )
}
