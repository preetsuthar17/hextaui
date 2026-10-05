import { IconFolderPlus } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function EmptyRtl() {
  return (
    <div dir="rtl" className="w-full">
      <Empty variant="outline">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconFolderPlus />
          </EmptyMedia>
          <EmptyTitle>لا توجد مشاريع بعد</EmptyTitle>
          <EmptyDescription>
            لم تنشئ أي مشروع حتى الآن. ابدأ مشروعًا جديدًا أو استورد مستودعًا
            موجودًا. <a href="#">اعرف المزيد</a>
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex flex-wrap justify-center gap-2">
            <Button>إنشاء مشروع</Button>
            <Button variant="outline">استيراد</Button>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  )
}
