import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LabelRtl() {
  return (
    <div dir="rtl" className="flex w-full max-w-sm flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="label-rtl-name"
          indicator="optional"
          optionalText="اختياري"
        >
          الاسم
        </Label>
        <Input id="label-rtl-name" />
      </div>
      <Label>
        <Checkbox defaultChecked />
        تذكرني
      </Label>
    </div>
  )
}
