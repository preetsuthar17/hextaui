import { ScrollArea } from "@/components/ui/scroll-area"

const tags = [
  "أنظمة التصميم",
  "الحركة",
  "إمكانية الوصول",
  "الطباعة",
  "الألوان",
  "التخطيط",
  "النماذج",
  "جداول البيانات",
  "الرسوم البيانية",
  "التنقل",
]

export function ScrollAreaRtl() {
  return (
    <div dir="rtl" className="w-full max-w-md">
      <ScrollArea scrollbars="horizontal" className="rounded-lg border">
        <div className="flex w-max gap-2 p-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border px-3 py-1 text-sm whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
