import { Separator } from "@/components/ui/separator"

export function SeparatorRtl() {
  return (
    <div dir="rtl" className="flex w-full max-w-sm flex-col gap-6 text-sm">
      <Separator align="start">اليوم</Separator>
      <div className="flex h-5 items-center gap-4">
        <a href="#">الوثائق</a>
        <Separator orientation="vertical" />
        <a href="#">المكونات</a>
        <Separator orientation="vertical" />
        <a href="#">المصدر</a>
      </div>
    </div>
  )
}
