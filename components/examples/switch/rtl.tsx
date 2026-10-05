import { Switch } from "@/components/ui/switch"

export function SwitchRtl() {
  return (
    <div dir="rtl" className="flex flex-col gap-4 text-sm">
      <label className="flex items-center gap-3">
        <Switch defaultChecked icons />
        الإشعارات
      </label>
      <label className="flex items-center gap-3">
        <Switch />
        الوضع الداكن
      </label>
    </div>
  )
}
