import { Textarea } from "@/components/ui/textarea"

export function TextareaRtl() {
  return (
    <div dir="rtl" className="w-full max-w-sm">
      <Textarea aria-label="رسالتك" placeholder="اكتب رسالتك هنا…" />
    </div>
  )
}
