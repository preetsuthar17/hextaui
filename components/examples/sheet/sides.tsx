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

const sides = ["top", "right", "bottom", "left"] as const

export function SheetSides() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {sides.map((side) => (
        <Sheet key={side}>
          <SheetTrigger render={<Button variant="outline" />}>
            {side}
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Opens from the {side}</SheetTitle>
              <SheetDescription>
                Swipe towards the {side} edge or press Esc to close it.
              </SheetDescription>
            </SheetHeader>
            <SheetFooter>
              <SheetClose render={<Button />}>Done</SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  )
}
