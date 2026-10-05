import { IconArrowLeft, IconArrowRight, IconTrash } from "@tabler/icons-react"

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

export function ContextMenuRtl() {
  return (
    <div dir="rtl" className="w-full max-w-sm">
      <ContextMenu>
        <ContextMenuTrigger className="flex h-40 w-full items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
          انقر بزر الفأرة الأيمن هنا
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>
            <IconArrowRight />
            رجوع
            <ContextMenuShortcut>⌘[</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <IconArrowLeft />
            تقدم
          </ContextMenuItem>
          <ContextMenuCheckboxItem defaultChecked>
            إظهار الشريط
          </ContextMenuCheckboxItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>مشاركة</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem>بريد</ContextMenuItem>
              <ContextMenuItem>نسخ الرابط</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive">
            <IconTrash />
            حذف
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}
