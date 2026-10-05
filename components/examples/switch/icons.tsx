import { Switch } from "@/components/ui/switch"

export function SwitchIcons() {
  return (
    <div className="flex flex-col gap-4 text-sm">
      <label className="flex items-center gap-3">
        <Switch icons defaultChecked />
        Captions
      </label>
      <label className="flex items-center gap-3">
        <Switch icons size="lg" />
        Reduce transparency
      </label>
    </div>
  )
}
