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

export function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>
        Edit profile
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Changes are saved to your account when you click save.
          </SheetDescription>
        </SheetHeader>
        <SheetBody>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="sheet-demo-name" className="text-sm font-medium">
                Name
              </label>
              <input
                id="sheet-demo-name"
                defaultValue="Olivia Martin"
                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm transition-shadow outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden pointer-coarse:text-touch"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="sheet-demo-username"
                className="text-sm font-medium"
              >
                Username
              </label>
              <input
                id="sheet-demo-username"
                defaultValue="@olivia"
                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm transition-shadow outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden pointer-coarse:text-touch"
              />
            </div>
          </div>
        </SheetBody>
        <SheetFooter>
          <SheetClose render={<Button variant="outline" />}>Cancel</SheetClose>
          <SheetClose render={<Button />}>Save changes</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
