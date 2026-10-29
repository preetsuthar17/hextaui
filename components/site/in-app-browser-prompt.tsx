"use client"

import * as React from "react"
import { IconCopy, IconExternalLink, IconX } from "@tabler/icons-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { copyText } from "@/lib/copy-text"
import { useChrome } from "@/lib/i18n/chrome"
import { useSitePathname } from "@/lib/i18n/client"
import {
  androidIntentUrl,
  currentInAppBrowser,
  inAppPromptPage,
  promptDismissedKey,
  promptDismissedRecently,
  type InAppBrowser,
} from "@/lib/in-app-browser"
import { track } from "@/lib/track"

type PromptState = { browser: InAppBrowser | null; dismissed: boolean }

const serverState: PromptState = { browser: null, dismissed: true }

const listeners = new Set<() => void>()
const seen = new Set<string>()
let state: PromptState | undefined

function readDismissed() {
  try {
    return promptDismissedRecently(
      localStorage.getItem(promptDismissedKey),
      Date.now()
    )
  } catch {
    return false
  }
}

function getSnapshot() {
  if (!state) {
    const browser = currentInAppBrowser()
    state = { browser, dismissed: browser ? readDismissed() : true }
  }
  return state
}

function getServerSnapshot() {
  return serverState
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function dismiss() {
  try {
    localStorage.setItem(promptDismissedKey, String(Date.now()))
  } catch {}
  state = { ...getSnapshot(), dismissed: true }
  listeners.forEach((listener) => listener())
}

function InAppBrowserPrompt() {
  const pathname = useSitePathname()
  const page = inAppPromptPage(pathname)
  const { browser, dismissed } = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )

  if (!page || !browser || dismissed) return null
  return <Prompt key={pathname} browser={browser} page={page} />
}

function Prompt({
  browser,
  page,
}: {
  browser: InAppBrowser
  page: "pricing" | "block"
}) {
  const c = useChrome()
  const titleId = React.useId()
  const { app, platform } = browser
  const props = React.useMemo(
    () => ({ app: app ?? "unknown", platform, kind: "banner", from: page }),
    [app, platform, page]
  )

  React.useEffect(() => {
    const key = window.location.pathname
    if (seen.has(key)) return
    seen.add(key)
    track("In-app browser prompt", props)
  }, [props])

  const intent =
    platform === "android" ? androidIntentUrl(window.location.href) : null

  const where = app
    ? c("You’re in {app}’s in-app browser.").replace("{app}", app)
    : c("You’re in an in-app browser.")
  const how =
    platform === "ios"
      ? c(
          "Use the app’s ••• or share menu and choose Open in Safari, or copy the link and paste it into Safari."
        )
      : intent
        ? c(
            "Tap Open in browser below, or use the ⋮ menu and choose Open in Chrome."
          )
        : c("Copy the link and paste it into your browser.")

  return (
    <section
      aria-labelledby={titleId}
      className="fixed inset-x-2 top-16 z-50 flex flex-col gap-2.5 rounded-xl bg-popover p-3 text-sm text-popover-foreground shadow-lg ring-(length:--hairline) ring-foreground/10 motion-safe:animate-in motion-safe:animation-duration-300 motion-safe:fade-in-0 motion-safe:slide-in-from-top-2 sm:right-4 sm:left-auto sm:w-[22.5rem] forced-colors:border"
    >
      <div className="flex items-start gap-2">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p id={titleId} className="font-medium text-foreground">
            {c("Open in your browser")}
          </p>
          <p className="text-xs/5 text-pretty text-muted-foreground">
            {where}{" "}
            {c(
              "Google sign-in doesn’t work here, so getting Pro is easier in your browser."
            )}{" "}
            {how}
          </p>
        </div>
        <Button
          size="icon-sm"
          variant="ghost"
          className="-me-1 -mt-1"
          aria-label={c("Dismiss")}
          onClick={() => {
            track("In-app browser prompt dismissed", props)
            dismiss()
          }}
        >
          <IconX />
        </Button>
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={intent ? "outline" : "default"}
          className="flex-1"
          feedback
          successLabel={c("Copied")}
          errorLabel={c("Couldn’t copy")}
          onClick={() => {
            track("In-app browser link copied", props)
            return copyText(window.location.href)
          }}
        >
          <IconCopy data-icon="inline-start" />
          {c("Copy link")}
        </Button>
        {intent ? (
          <a
            href={intent}
            className={buttonVariants({ size: "sm", className: "flex-1" })}
            onClick={() => track("In-app browser opened", props)}
          >
            <IconExternalLink data-icon="inline-start" />
            {c("Open in browser")}
          </a>
        ) : null}
      </div>
    </section>
  )
}

export { InAppBrowserPrompt }
