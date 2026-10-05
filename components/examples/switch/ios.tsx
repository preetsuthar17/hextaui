import { Switch } from "@/components/ui/switch"

export function SwitchIos() {
  return (
    <div className="flex flex-col gap-4 text-sm">
      <label className="flex items-center gap-3">
        <Switch variant="ios" />
        Airplane mode
      </label>
      <label className="flex items-center gap-3">
        <Switch variant="ios" defaultChecked />
        Wi-Fi
      </label>
      <div className="flex items-center gap-4">
        <Switch variant="ios" size="sm" aria-label="Small" defaultChecked />
        <Switch variant="ios" size="lg" aria-label="Large" defaultChecked />
      </div>
    </div>
  )
}
