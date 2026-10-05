import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function SheetLongContent() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>
        Release notes
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>What’s new</SheetTitle>
          <SheetDescription>Version 2.4.0</SheetDescription>
        </SheetHeader>
        <SheetBody>
          <div className="flex flex-col gap-3 text-sm text-muted-foreground">
            {Array.from({ length: 24 }, (_, index) => (
              <p key={index}>
                {index + 1}. Improved performance of the dashboard charts and
                fixed an issue where filters reset after navigation.
              </p>
            ))}
          </div>
        </SheetBody>
        <SheetFooter>
          <SheetClose render={<Button />}>Got it</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
