"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function DialogForm() {
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState("Acme")
  const [draft, setDraft] = React.useState(name)
  const formId = React.useId()

  return (
    <div className="flex flex-col items-center gap-3">
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (nextOpen) {
            setDraft(name)
          }
          setOpen(nextOpen)
        }}
      >
        <DialogTrigger render={<Button variant="outline" />}>
          Rename workspace
        </DialogTrigger>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Rename workspace</DialogTitle>
            <DialogDescription>
              Everyone in the workspace will see the new name.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <form
              id={formId}
              onSubmit={(event) => {
                event.preventDefault()
                setName(draft.trim() || name)
                setOpen(false)
              }}
            >
              <FieldGroup>
                <Field>
                  <FieldLabel>Workspace name</FieldLabel>
                  <Input
                    name="name"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    required
                  />
                </Field>
              </FieldGroup>
            </form>
          </DialogBody>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button type="submit" form={formId}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <p className="text-sm text-muted-foreground">Workspace: {name}</p>
    </div>
  )
}
