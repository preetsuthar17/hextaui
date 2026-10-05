import { Button } from "@/components/ui/button"
import { DateRangePicker } from "@/components/ui/date-picker"
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function DatePickerInSheet() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>
        Edit booking
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit booking</SheetTitle>
          <SheetDescription>
            The picker opens above the sheet and Escape closes only the picker.
          </SheetDescription>
        </SheetHeader>
        <SheetBody>
          <DateRangePicker />
        </SheetBody>
      </SheetContent>
    </Sheet>
  )
}
