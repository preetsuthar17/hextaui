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

export function SheetNoCloseButton() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>Share</SheetTrigger>
      <SheetContent side="bottom" showCloseButton={false}>
        <SheetHeader>
          <SheetTitle>Share link</SheetTitle>
          <SheetDescription>
            Anyone with the link can view this document.
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose render={<Button />}>Done</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
