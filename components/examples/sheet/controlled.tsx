"use client"

import * as React from "react"

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
} from "@/components/ui/sheet"

export function SheetControlled() {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open from state
      </Button>
      <span className="text-sm text-muted-foreground">
        {open ? "Open" : "Closed"}
      </span>
      <Sheet open={open} onOpenChange={setOpen}>
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
                <label
                  htmlFor="sheet-controlled-name"
                  className="text-sm font-medium"
                >
                  Name
                </label>
                <input
                  id="sheet-controlled-name"
                  defaultValue="Olivia Martin"
                  className="h-9 rounded-md border border-input bg-transparent px-3 text-sm transition-shadow outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden pointer-coarse:text-touch"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="sheet-controlled-username"
                  className="text-sm font-medium"
                >
                  Username
                </label>
                <input
                  id="sheet-controlled-username"
                  defaultValue="@olivia"
                  className="h-9 rounded-md border border-input bg-transparent px-3 text-sm transition-shadow outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden pointer-coarse:text-touch"
                />
              </div>
            </div>
          </SheetBody>
          <SheetFooter>
            <SheetClose render={<Button variant="outline" />}>
              Cancel
            </SheetClose>
            <SheetClose render={<Button />}>Save changes</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
