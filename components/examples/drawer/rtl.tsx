import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

export function DrawerRtl() {
  return (
    <div dir="rtl" className="flex flex-wrap justify-center gap-2">
      <Drawer>
        <DrawerTrigger render={<Button variant="outline" />}>
          من الأسفل
        </DrawerTrigger>
        <DrawerContent dir="rtl">
          <DrawerHeader>
            <DrawerTitle>تعديل الملف الشخصي</DrawerTitle>
            <DrawerDescription>
              يتم حفظ التغييرات عند النقر على حفظ.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose render={<Button />}>حفظ</DrawerClose>
            <DrawerClose render={<Button variant="outline" />}>
              إلغاء
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Drawer swipeDirection="left" showSwipeHandle>
        <DrawerTrigger render={<Button variant="outline" />}>
          من اليسار
        </DrawerTrigger>
        <DrawerContent dir="rtl">
          <DrawerHeader>
            <DrawerTitle>القائمة</DrawerTitle>
            <DrawerDescription>اسحب إلى اليسار للإغلاق.</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose render={<Button variant="outline" />}>
              إغلاق
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
