import { Switch } from "@/components/ui/switch"

export function SwitchStates() {
  return (
    <div className="flex flex-col gap-4 text-sm">
      <label className="flex items-center gap-3">
        <Switch disabled />
        Disabled
      </label>
      <label className="flex items-center gap-3">
        <Switch disabled defaultChecked />
        Disabled and on
      </label>
      <label className="flex items-center gap-3">
        <Switch readOnly defaultChecked />
        Read-only (managed by your admin)
      </label>
    </div>
  )
}
