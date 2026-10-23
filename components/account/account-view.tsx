"use client"

import { useEffect, useRef, useState } from "react"
import Link from "@/components/site/link"
import {
  IconAlertTriangle,
  IconCheck,
  IconCircleCheck,
  IconCircleX,
  IconLock,
} from "@tabler/icons-react"

import { ProTokens, request } from "@/components/account/pro-tokens"
import { TeamSeats } from "@/components/account/team-seats"
import { SignInOptions } from "@/components/account/sign-in-options"
import { useInAppBrowserGate } from "@/components/site/open-in-browser"
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
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import {
  signOut,
  startCheckout,
  useSession,
  writeCachedPro,
} from "@/lib/auth-client"
import {
  earlyBirdLastDay,
  isTeamPlan,
  proPlanIds,
  proPlans,
  refundDays,
  type ProPlanId,
} from "@/lib/pro/pricing"
import { useEarlyBird } from "@/lib/pro/use-early-bird"
import { trackPurchaseCompleted } from "@/lib/purchase-tracking"
import { siteContactEmail } from "@/lib/site"
import {
  claimHref,
  postClaim,
  takeCheckoutReturn,
  writeStoredClaim,
  type CheckoutReturn,
  type ClaimResponse,
  type StoredClaim,
} from "@/lib/claim-client"

type ProPlan = (typeof proPlans)[ProPlanId]

type Plan = {
  pro: boolean
  plan: ProPlanId | null
  via: "owner" | "member" | null
  teamOwner: string | null
  purchasedAt: string | null
  providers: string[]
  emailUpdates: boolean
}

const providerNames: Record<string, string> = {
  github: "GitHub",
  google: "Google",
}

const dateFormat = new Intl.DateTimeFormat("en", { dateStyle: "long" })

const proFeatures = [
  "Every Pro block, including future categories",
  "Install with the shadcn CLI or copy the code",
  "Unlimited personal and commercial projects, including client work",
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
  const plan = (await response.json()) as Plan
  writeCachedPro(plan.pro)
  return plan
}

function useCheckoutReturn() {
  const taken = useRef<CheckoutReturn | null>(null)
  const [state, setState] = useState<CheckoutReturn | null>(null)

  useEffect(() => {
    taken.current ??= takeCheckoutReturn()
    setState(taken.current)
  }, [])

  return state
}

type ClaimState = {
  checking: boolean
  settled: boolean
  result: ClaimResponse | null
}

const claimAttempts = 15

function settlesClaim(result: ClaimResponse, signedIn: boolean) {
  if (result.status === "pending") return false
  if (result.status !== "paid") return true
  return signedIn ? true : result.account === "this"
}

function useClaim(
  claim: StoredClaim | null,
  ready: boolean,
  signedIn: boolean
) {
  const [state, setState] = useState<ClaimState>({
    checking: false,
    settled: false,
    result: null,
  })

  useEffect(() => {
    if (!claim || !ready) return
    let active = true
    let timer: ReturnType<typeof setTimeout> | undefined
    let attempts = claimAttempts
    setState({ checking: true, settled: false, result: null })

    const load = async () => {
      const result = await postClaim(claim)
      if (!active) return
      if ((!result || result.status === "pending") && --attempts > 0) {
        timer = setTimeout(load, 2000)
        return
      }
      if (result && "report" in result && result.report) {
        trackPurchaseCompleted(result)
      }
      if (result && settlesClaim(result, signedIn)) writeStoredClaim(null)
      setState({ checking: false, settled: true, result })
    }

    load()
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [claim, ready, signedIn])

  return state
}

function usePlan(
  enabled: boolean,
  confirmPaymentId: string | null,
  version: number
) {
  const [plan, setPlan] = useState<Plan | null>(null)
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    if (!enabled) return
    let active = true
    let timer: ReturnType<typeof setTimeout> | undefined
    let attempts = confirmPaymentId ? 15 : 0

    const load = async () => {
      const next = await fetchPlan(confirmPaymentId).catch(() => null)
      if (!active) return
      if (next) setPlan(next)
      if (next && !next.pro && attempts > 0) {
        attempts -= 1
        setConfirming(true)
        timer = setTimeout(load, 2000)
        return
      }
      setConfirming(false)
    }

    load()
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [enabled, confirmPaymentId, version])

  return { plan, confirming }
}

function PlanCard({ plan, early }: { plan: ProPlan; early: boolean }) {
  const { guard, dialog } = useInAppBrowserGate()

  return (
    <div className="flex flex-col gap-4 rounded-xl border p-5">
      <div className="flex flex-col gap-1">
        <h3 className="font-medium">{plan.name}</h3>
        <p className="text-sm text-pretty text-muted-foreground">
          {plan.summary}
        </p>
      </div>
      <p className="mt-auto flex items-baseline gap-2 tabular-nums">
        {early ? (
          <del className="text-sm text-muted-foreground">
            <span className="sr-only">Regular price </span>${plan.price}
          </del>
        ) : null}
        <span className="text-2xl font-semibold tracking-tight">
          {early ? <span className="sr-only">Early bird price </span> : null}$
          {early ? plan.earlyPrice : plan.price}
        </span>
        <span className="text-sm text-muted-foreground">once</span>
      </p>
      <Button
        variant={plan.id === "solo" ? "default" : "outline"}
        feedback
        successLabel="Redirecting…"
        errorLabel="Try again"
        onClick={() => guard("checkout", () => startCheckout(plan.id))}
      >
        Get {plan.name}
      </Button>
      {dialog}
    </div>
  )
}

function ProUpgrade() {
  const early = useEarlyBird()

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h2 className="font-medium">HextaUI Pro</h2>
          {early ? (
            <Badge appearance="muted" shape="pill">
              Early bird
            </Badge>
          ) : null}
        </div>
        <p className="text-sm text-pretty text-muted-foreground">
          One payment, no subscription.
          {early
            ? ` Early-bird prices end on ${earlyBirdLastDay}, then they go up.`
            : ""}
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
      <div className="grid gap-3 sm:grid-cols-3">
        {proPlanIds.map((id) => (
          <PlanCard key={id} plan={proPlans[id]} early={early} />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        By buying you agree to the{" "}
        <Link href="/legal/terms" className="underline underline-offset-4">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/legal/license" className="underline underline-offset-4">
          Pro License
        </Link>
        . Refundable within {refundDays} days, no questions asked, see the{" "}
        <Link href="/legal/refunds" className="underline underline-offset-4">
          Refund Policy
        </Link>
        .
      </p>
    </section>
  )
}

function TeamUpgrade({ plan }: { plan: "solo" | "team" }) {
  const target = plan === "solo" ? "Team or Unlimited" : "Unlimited"
  return (
    <section className="flex flex-col gap-1">
      <h2 className="font-medium">
        {plan === "solo" ? "Need seats for your team?" : "Need more seats?"}
      </h2>
      <p className="text-sm text-pretty text-muted-foreground">
        Email{" "}
        <a
          href={`mailto:${siteContactEmail}?subject=Upgrade%20HextaUI%20Pro%20to%20${plan === "solo" ? "Team" : "Unlimited"}`}
          className="text-foreground underline underline-offset-4"
        >
          {siteContactEmail}
        </a>{" "}
        from this account’s email to move to {target}. You only pay the
        difference.
      </p>
    </section>
  )
}

function EmailSettings({ subscribed }: { subscribed: boolean }) {
  const save = (emailUpdates: boolean) =>
    request("/api/account", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ emailUpdates }),
    })

  return (
    <section className="flex flex-col gap-5">
      <h2 className="font-medium">Emails</h2>
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel htmlFor="email-updates">Release emails</FieldLabel>
          <FieldDescription>
            A short email when new components and blocks ship.
          </FieldDescription>
        </FieldContent>
        <Switch
          id="email-updates"
          defaultChecked={subscribed}
          onCheckedChange={save}
        />
      </Field>
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
  if (!plan.pro || !plan.plan) return <Badge>Free</Badge>
  return <Badge variant="success">Pro {proPlans[plan.plan].name}</Badge>
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

function ClaimNotice({
  state,
  signedIn,
}: {
  state: ClaimState
  signedIn: boolean
}) {
  const { checking, result } = state

  if (checking) {
    return (
      <Alert>
        <Spinner />
        <AlertTitle>Confirming your payment…</AlertTitle>
        <AlertDescription>
          This takes a few seconds. You can keep this page open.
        </AlertDescription>
      </Alert>
    )
  }
  if (!result) return null

  if (result.status === "pending") {
    return (
      <Alert variant="info">
        <Spinner />
        <AlertTitle>Your payment is still processing</AlertTitle>
        <AlertDescription>
          Some payment methods take a few minutes. Reload this page in a minute
          and Pro unlocks once it clears. We also email you when it’s done.
        </AlertDescription>
      </Alert>
    )
  }
  if (result.status === "failed") {
    return (
      <Alert variant="destructive">
        <IconCircleX />
        <AlertTitle>The payment didn’t go through</AlertTitle>
        <AlertDescription>
          Nothing was unlocked. You can try again with another payment method.
        </AlertDescription>
      </Alert>
    )
  }
  if (result.status === "invalid") {
    return (
      <Alert variant="destructive">
        <IconCircleX />
        <AlertTitle>This link doesn’t match a payment</AlertTitle>
        <AlertDescription>
          Use the link from your purchase email, or email{" "}
          <a
            href={`mailto:${siteContactEmail}`}
            className="underline underline-offset-4"
          >
            {siteContactEmail}
          </a>{" "}
          with your receipt and we’ll sort it out.
        </AlertDescription>
      </Alert>
    )
  }
  if (result.status !== "paid") {
    return (
      <Alert variant="warning">
        <IconAlertTriangle />
        <AlertTitle>This payment was refunded</AlertTitle>
        <AlertDescription>
          A refunded payment doesn’t unlock Pro.
        </AlertDescription>
      </Alert>
    )
  }

  const planName = proPlans[result.plan].name
  if (result.account === "this") {
    return (
      <Alert variant="success">
        <IconCircleCheck />
        <AlertTitle>Thanks! Pro {planName} is on this account</AlertTitle>
        <AlertDescription>
          Every Pro block is unlocked. Create a token below to install them with
          the shadcn CLI.
        </AlertDescription>
      </Alert>
    )
  }
  if (result.account === "other") {
    return (
      <Alert variant="warning">
        <IconAlertTriangle />
        <AlertTitle>
          {signedIn
            ? "This purchase is on another HextaUI account"
            : "Your purchase is on a HextaUI account"}
        </AlertTitle>
        <AlertDescription>
          {signedIn
            ? `Pro ${planName} belongs to the account${result.email ? ` that uses ${result.email}` : ""}. Sign out, then sign in with that account.`
            : `Sign in with the account${result.email ? ` that uses ${result.email}` : ""} to use Pro ${planName}.`}
        </AlertDescription>
      </Alert>
    )
  }
  return (
    <Alert variant="success">
      <IconCircleCheck />
      <AlertTitle>Payment received. One step left</AlertTitle>
      <AlertDescription>
        Sign in with GitHub or Google to unlock Pro {planName}. Any account
        works, even with a different email: the purchase moves to the account
        you sign in with.
        {result.email
          ? ` We also emailed a sign-in link to ${result.email}.`
          : ""}
      </AlertDescription>
    </Alert>
  )
}

function AccountContent() {
  const { session, pending } = useSession()
  const checkoutReturn = useCheckoutReturn()
  const claim = checkoutReturn?.claim ?? null
  const claimState = useClaim(claim, !pending, Boolean(session))
  const claimed =
    claimState.result?.status === "paid" && claimState.result.account === "this"
  const waitingForClaim = Boolean(claim) && !claimState.settled
  const confirmPaymentId =
    checkoutReturn?.checkoutDone && !claim ? checkoutReturn.paymentId : null
  const { plan, confirming } = usePlan(
    Boolean(session) && Boolean(checkoutReturn) && !waitingForClaim,
    confirmPaymentId,
    claimed ? 1 : 0
  )
  const owned = plan?.via === "owner" ? plan.plan : null
  const notice = <ClaimNotice state={claimState} signedIn={Boolean(session)} />
  const unclaimed =
    claimState.result?.status === "paid" && claimState.result.account === "none"

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
      <div className="flex flex-col gap-10">
        {notice}
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="stack">
              <IconLock />
            </EmptyMedia>
            <EmptyTitle>
              {unclaimed ? "Sign in to unlock Pro" : "Sign in to HextaUI"}
            </EmptyTitle>
            <EmptyDescription>
              Your account holds your Pro access and the tokens you use to
              install Pro blocks.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <SignInOptions openHref={claim ? claimHref(claim) : undefined} />
          </EmptyContent>
        </Empty>
      </div>
    )
  }

  const { user } = session
  const busy = confirming || waitingForClaim || claimState.checking

  return (
    <div className="flex flex-col gap-10">
      {notice}
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
          <PlanStatus plan={plan} confirming={busy} />
        </dd>
        {plan?.via === "member" ? (
          <>
            <dt className="text-muted-foreground">Seat on</dt>
            <dd>{plan.teamOwner}’s team</dd>
          </>
        ) : plan?.purchasedAt ? (
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
      {plan && !plan.pro && !busy ? <ProUpgrade /> : null}
      {owned && isTeamPlan(owned) ? <TeamSeats /> : null}
      {plan?.pro ? <ProTokens /> : null}
      {owned && owned !== "unlimited" ? <TeamUpgrade plan={owned} /> : null}
      {plan ? <EmailSettings subscribed={plan.emailUpdates} /> : null}
      <div>
        <Button variant="outline" size="sm" onClick={() => signOut()}>
          Sign out
        </Button>
      </div>
    </div>
  )
}

export { AccountView }
