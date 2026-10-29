"use client"

import * as React from "react"
import { IconCopy, IconExternalLink } from "@tabler/icons-react"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { copyText } from "@/lib/copy-text"
import {
  androidIntentUrl,
  currentInAppBrowser,
  type InAppBrowser,
} from "@/lib/in-app-browser"
import { useChrome } from "@/lib/i18n/chrome"
import { track } from "@/lib/track"

type GateKind = "sign-in" | "checkout"

type Gate = {
  kind: GateKind
  browser: InAppBrowser
  href: string
  run: () => unknown
}

function useInAppBrowserGate() {
  const [gate, setGate] = React.useState<Gate | null>(null)
  const [open, setOpen] = React.useState(false)

  const guard = React.useCallback(
    (kind: GateKind, run: () => unknown, href?: string) => {
      const browser = currentInAppBrowser()
      if (!browser) return run()
      track("In-app browser prompt", {
        app: browser.app ?? "unknown",
        platform: browser.platform,
        kind,
      })
      setGate({ kind, browser, run, href: href ?? window.location.href })
      setOpen(true)
      return undefined
    },
    []
  )

  const dialog = gate ? (
    <OpenInBrowserDialog
      gate={gate}
      open={open}
      onOpenChange={setOpen}
      onContinue={() => {
        track("In-app browser continued", { kind: gate.kind })
        return gate.run()
      }}
    />
  ) : null

  return { guard, dialog }
}

function OpenInBrowserDialog({
  gate,
  open,
  onOpenChange,
  onContinue,
}: {
  gate: Gate
  open: boolean
  onOpenChange: (open: boolean) => void
  onContinue: () => unknown
}) {
  const c = useChrome()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const { app, platform } = gate.browser
  const intent = platform === "android" ? androidIntentUrl(gate.href) : null

  const where = app
    ? c("You’re in {app}’s in-app browser.").replace("{app}", app)
    : c("You’re in an in-app browser.")
  const why =
    gate.kind === "sign-in"
      ? c(
          "Google blocks sign-in here, and GitHub makes you type your password again. Open this page in your browser to sign in."
        )
      : c(
          "Checkout works here, but signing in afterwards may not, and Apple Pay or Google Pay may not show up. Your browser is the smoother path."
        )
  const how =
    platform === "ios"
      ? c(
          "Use the app’s ••• or share menu and choose Open in Safari, or copy the link and paste it into Safari."
        )
      : platform === "android"
        ? c(
            "Tap Open in browser below, or use the ⋮ menu and choose Open in Chrome."
          )
        : c("Copy the link and paste it into your browser.")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>{c("Open in your browser")}</DialogTitle>
          <DialogDescription>
            {where} {why}
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-pretty text-muted-foreground">{how}</p>
            <Input
              ref={inputRef}
              readOnly
              value={gate.href}
              aria-label={c("Page link")}
              onFocus={(event) => event.currentTarget.select()}
            />
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                size="lg"
                className="sm:flex-1"
                feedback
                successLabel={c("Copied")}
                errorLabel={c("Couldn’t copy")}
                onClick={() => {
                  track("In-app browser link copied", { kind: gate.kind })
                  return copyText(gate.href, inputRef.current)
                }}
              >
                <IconCopy data-icon="inline-start" />
                {c("Copy link")}
              </Button>
              {intent ? (
                <a
                  href={intent}
                  className={buttonVariants({
                    size: "lg",
                    variant: "outline",
                    className: "sm:flex-1",
                  })}
                  onClick={() =>
                    track("In-app browser opened", { kind: gate.kind })
                  }
                >
                  <IconExternalLink data-icon="inline-start" />
                  {c("Open in browser")}
                </a>
              ) : null}
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="ghost"
            feedback
            successLabel={c("Redirecting…")}
            errorLabel={c("Try again")}
            onClick={onContinue}
          >
            {gate.kind === "sign-in"
              ? c("Continue here anyway")
              : c("Continue to checkout here")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { useInAppBrowserGate }
