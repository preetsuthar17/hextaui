import { Checkbox } from "@/components/ui/checkbox"

export function CheckboxRtl() {
  return (
    <div dir="rtl" className="flex flex-col gap-3 text-sm">
      <label className="flex items-center gap-3">
        <Checkbox defaultChecked />
        تذكر هذا الجهاز
      </label>
      <label className="flex max-w-sm items-start gap-3">
        <span className="flex h-5 items-center">
          <Checkbox />
        </span>
        <span className="flex flex-col gap-0.5">
          <span className="leading-5 font-medium">الإشارات والردود</span>
          <span className="text-muted-foreground">
            سنرسل لك إشعارات فقط حول نشاط منشوراتك.
          </span>
        </span>
      </label>
    </div>
  )
}
