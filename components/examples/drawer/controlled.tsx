"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

export function DrawerControlled() {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open from anywhere
      </Button>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Controlled drawer</DrawerTitle>
            <DrawerDescription>
              Opened from a plain button, without a trigger.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
