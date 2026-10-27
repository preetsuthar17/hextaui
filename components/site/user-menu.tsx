"use client"

import * as React from "react"
import { cn } from "cn"

import { useChrome } from "@/lib/i18n/chrome"
import { readSignedIn } from "@/lib/signed-in"

const loadAccountMenu = () => import("@/components/site/account-menu")
const loadSignInDialog = () => import("@/components/site/sign-in-dialog")

const AccountMenu = React.lazy(() =>
  loadAccountMenu().then((module) => ({ default: module.AccountMenu }))
)
const SignInDialog = React.lazy(() =>
  loadSignInDialog().then((module) => ({ default: module.SignInDialog }))
)

function prefetchSignIn() {
  loadSignInDialog().catch(() => {})
}

function subscribe() {
  return () => {}
}

function UserMenu({ signInClassName }: { signInClassName?: string }) {
  const c = useChrome()
  const signedIn = React.useSyncExternalStore(
    subscribe,
    readSignedIn,
    () => null
  )
  const [open, setOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  if (signedIn) {
    return (
      <React.Suspense
        fallback={<span aria-hidden="true" className="size-8 shrink-0" />}
      >
        <AccountMenu signInClassName={signInClassName} />
      </React.Suspense>
    )
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        onPointerEnter={prefetchSignIn}
        onFocus={prefetchSignIn}
        onClick={() => {
          setMounted(true)
          setOpen(true)
        }}
        className={cn(signInClassName, signedIn === null && "invisible")}
      >
        {c("Sign in")}
      </button>
      {mounted ? (
        <React.Suspense fallback={null}>
          <SignInDialog
            open={open}
            onOpenChange={setOpen}
            finalFocus={triggerRef}
          />
        </React.Suspense>
      ) : null}
    </>
  )
}

export { UserMenu }
