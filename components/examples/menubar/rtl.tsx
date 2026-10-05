import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"

export function MenubarRtl() {
  return (
    <div dir="rtl">
      <Menubar aria-label="المحرر">
        <MenubarMenu>
          <MenubarTrigger>ملف</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              علامة تبويب جديدة
              <MenubarShortcut>⌘T</MenubarShortcut>
            </MenubarItem>
            <MenubarSub>
              <MenubarSubTrigger>مشاركة</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>رابط البريد</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>تحرير</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>تراجع</MenubarItem>
            <MenubarItem>إعادة</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  )
}
