"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function DialogControlled() {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open from state
      </Button>
      <span className="text-sm text-muted-foreground">
        {open ? "Open" : "Closed"}
      </span>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Controlled dialog</DialogTitle>
            <DialogDescription>
              The open state lives in your component. Focus returns to the
              button that opened it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button />}>Done</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
