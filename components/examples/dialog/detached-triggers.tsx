"use client"

import { Button } from "@/components/ui/button"
import {
  createDialogHandle,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const people = createDialogHandle<{ name: string; role: string }>()

export function DialogDetachedTriggers() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <DialogTrigger
        handle={people}
        payload={{ name: "Ada Lovelace", role: "Owner" }}
        render={<Button variant="outline" size="sm" />}
      >
        Ada
      </DialogTrigger>
      <DialogTrigger
        handle={people}
        payload={{ name: "Linus Torvalds", role: "Member" }}
        render={<Button variant="outline" size="sm" />}
      >
        Linus
      </DialogTrigger>
      <Dialog handle={people}>
        {({ payload }) => (
          <DialogContent size="sm">
            <DialogHeader>
              <DialogTitle>{payload?.name}</DialogTitle>
              <DialogDescription>Role: {payload?.role}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button />}>Done</DialogClose>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
