"use client"

import { useEffect, useState } from "react"
import { IconCheck, IconCircleX, IconLock } from "@tabler/icons-react"

import { ProTokens } from "@/components/account/pro-tokens"
import { SignInOptions } from "@/components/account/sign-in-options"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { signOut, startCheckout, useSession } from "@/lib/auth-client"

type Plan = {
  pro: boolean
  purchasedAt: string | null
  providers: string[]
}

const providerNames: Record<string, string> = {
  github: "GitHub",
  google: "Google",
}

const dateFormat = new Intl.DateTimeFormat("en", { dateStyle: "long" })

const proFeatures = [
  "Every Pro block, including future releases",
  "Install with the shadcn CLI or copy the code",
  "Unlimited personal and commercial projects",
]

const signInErrors: Record<string, string> = {
  email_not_found:
    "GitHub didn’t share an email address for your account. Add a verified email on GitHub, then try again.",
  account_already_linked_to_different_user:
    "This GitHub account is already linked to another HextaUI account.",
}

function useSignInError() {
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const url = new URL(window.location.href)
    const code = url.searchParams.get("error")
    if (!code) return
    setError(
      signInErrors[code] ?? "Sign in didn’t finish. Try again in a moment."
    )
    url.searchParams.delete("error")
    url.searchParams.delete("error_description")
    window.history.replaceState(null, "", url.pathname + url.search)
  }, [])

  return error
}

async function fetchPlan(paymentId: string | null) {
  const query = paymentId ? `?payment_id=${encodeURIComponent(paymentId)}` : ""
  const response = await fetch(`/api/account${query}`)
  if (!response.ok) throw new Error("Could not load your plan")
  return (await response.json()) as Plan
}

function usePlan(enabled: boolean) {
  const [plan, setPlan] = useState<Plan | null>(null)
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    if (!enabled) return
    let active = true
    let timer: ReturnType<typeof setTimeout> | undefined
    const params = new URLSearchParams(window.location.search)
    const returning = params.get("checkout") === "done"
    const paymentId = returning ? params.get("payment_id") : null
    let attempts = returning ? 15 : 0

    const load = async () => {
      const next = await fetchPlan(paymentId).catch(() => null)
      if (!active) return
      if (next) setPlan(next)
      if (next && !next.pro && attempts > 0) {
        attempts -= 1
        setConfirming(true)
        timer = setTimeout(load, 2000)
        return
      }
      setConfirming(false)
      if (returning) {
        window.history.replaceState(null, "", window.location.pathname)
      }
    }

    load()
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [enabled])

  return { plan, confirming }
}

function ProUpgrade() {
  return (
    <section className="flex flex-col gap-5 rounded-xl border p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="font-medium">HextaUI Pro</h2>
          <p className="text-sm text-muted-foreground">
            One payment, lifetime access.
          </p>
        </div>
        <p className="text-2xl font-semibold tracking-tight tabular-nums">
          $79
        </p>
      </div>
      <ul className="flex flex-col gap-2 text-sm">
        {proFeatures.map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <IconCheck className="size-4 shrink-0 text-muted-foreground" />
            {feature}
          </li>
        ))}
      </ul>
      <Button
        feedback
        successLabel="Redirecting…"
        errorLabel="Try again"
        className="self-start"
        onClick={() => startCheckout()}
      >
        Get Pro
      </Button>
    </section>
  )
}

function PlanStatus({
  plan,
  confirming,
}: {
  plan: Plan | null
  confirming: boolean
}) {
  if (confirming) {
    return (
      <span className="inline-flex items-center gap-2 text-muted-foreground">
        <Spinner />
        Confirming your payment…
      </span>
    )
  }
  if (!plan) return <Skeleton className="h-5 w-12" />
  return plan.pro ? <Badge variant="success">Pro</Badge> : <Badge>Free</Badge>
}

function AccountView() {
  const signInError = useSignInError()

  return (
    <div className="flex flex-col gap-10">
      {signInError ? (
        <Alert variant="destructive">
          <IconCircleX />
          <AlertTitle>Couldn’t sign you in</AlertTitle>
          <AlertDescription>{signInError}</AlertDescription>
        </Alert>
      ) : null}
      <AccountContent />
    </div>
  )
}

function AccountContent() {
  const { session, pending } = useSession()
  const { plan, confirming } = usePlan(Boolean(session))

  if (pending) {
    return (
      <div className="flex items-center gap-4">
        <Skeleton className="size-14 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="stack">
            <IconLock />
          </EmptyMedia>
          <EmptyTitle>Sign in to HextaUI</EmptyTitle>
          <EmptyDescription>
            Your account holds your Pro access and the tokens you use to install
            Pro blocks.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <SignInOptions />
        </EmptyContent>
      </Empty>
    )
  }

  const { user } = session

  return (
    <div className="flex flex-col gap-10">
      <section className="flex items-center gap-4">
        <Avatar size="xl">
          {user.image ? <AvatarImage src={user.image} alt="" /> : null}
          <AvatarFallback>{user.name.slice(0, 1).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="truncate font-medium">{user.name}</p>
          <p className="truncate text-sm text-muted-foreground">{user.email}</p>
        </div>
      </section>
      <dl className="grid grid-cols-[auto_1fr] items-center gap-x-8 gap-y-3 text-sm">
        <dt className="text-muted-foreground">Plan</dt>
        <dd>
          <PlanStatus plan={plan} confirming={confirming} />
        </dd>
        {plan?.purchasedAt ? (
          <>
            <dt className="text-muted-foreground">Purchased</dt>
            <dd>{dateFormat.format(new Date(plan.purchasedAt))}</dd>
          </>
        ) : null}
        {plan && plan.providers.length > 0 ? (
          <>
            <dt className="text-muted-foreground">Signed in with</dt>
            <dd>
              {plan.providers
                .map((provider) => providerNames[provider] ?? provider)
                .join(", ")}
            </dd>
          </>
        ) : null}
        <dt className="text-muted-foreground">Member since</dt>
        <dd>{dateFormat.format(new Date(user.createdAt))}</dd>
      </dl>
      {plan && !plan.pro && !confirming ? <ProUpgrade /> : null}
      {plan?.pro ? <ProTokens /> : null}
      <div>
        <Button variant="outline" size="sm" onClick={() => signOut()}>
          Sign out
        </Button>
      </div>
    </div>
  )
}

export { AccountView }
