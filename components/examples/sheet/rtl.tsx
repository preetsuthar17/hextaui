import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function SheetRtl() {
  return (
    <div dir="rtl">
      <Sheet>
        <SheetTrigger render={<Button variant="outline" />}>افتح</SheetTrigger>
        <SheetContent dir="rtl">
          <SheetHeader>
            <SheetTitle>تعديل الملف الشخصي</SheetTitle>
            <SheetDescription>
              يتم حفظ التغييرات عند النقر على حفظ.
            </SheetDescription>
          </SheetHeader>
          <SheetFooter>
            <SheetClose render={<Button variant="outline" />}>إلغاء</SheetClose>
            <SheetClose render={<Button />}>حفظ</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
