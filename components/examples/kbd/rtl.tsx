import { Kbd, KbdGroup } from "@/components/ui/kbd"

export function KbdRtl() {
  return (
    <p
      dir="rtl"
      className="flex items-center gap-2 text-sm text-muted-foreground"
    >
      اضغط
      <KbdGroup keys="mod+shift+p" />
      لفتح لوحة الأوامر، أو <Kbd keys="escape" /> للإغلاق
    </p>
  )
}
