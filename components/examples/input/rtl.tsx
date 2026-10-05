import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function InputRtl() {
  return (
    <div dir="rtl" className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="input-rtl">البريد الإلكتروني</Label>
      <Input id="input-rtl" placeholder="name@example.com" dir="auto" />
      <Input aria-label="الاسم" placeholder="اكتب اسمك" />
    </div>
  )
}
