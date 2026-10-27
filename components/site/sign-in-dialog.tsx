"use client"

import * as React from "react"

import { SignInOptions } from "@/components/account/sign-in-options"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

function SignInDialog({
  open,
  onOpenChange,
  finalFocus,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  finalFocus: React.RefObject<HTMLButtonElement | null>
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm" finalFocus={finalFocus}>
        <DialogHeader>
          <DialogTitle>Sign in to HextaUI</DialogTitle>
          <DialogDescription>
            Your account holds your Pro access and the tokens you use to
            install Pro blocks.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <SignInOptions className="max-w-none" />
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}

export { SignInDialog }
