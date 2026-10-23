"use client"

import * as React from "react"
import Link from "@/components/site/link"
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconLock,
} from "@tabler/icons-react"

import { DocsCodePanel } from "@/components/docs/docs-code-panel"
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
import { BlockBuyButton, BlockPriceNote } from "@/components/blocks/block-buy"
import { signIn, startCheckout, useSession } from "@/lib/auth-client"
import { useChrome } from "@/lib/i18n/chrome"
import { useSoloPrice } from "@/lib/pro/use-early-bird"
import { track } from "@/lib/track"

type ProFile = { path: string; code: string; html: string }

type CodeState =
  | { status: "loading" }
  | { status: "locked"; reason: "signed-out" | "free" }
  | { status: "error" }
  | { status: "ready"; files: ProFile[] }

function useBlockCode(name: string, free: boolean): CodeState {
  const { session, pending } = useSession()
  const [state, setState] = React.useState<CodeState>({ status: "loading" })

  React.useEffect(() => {
    if (!free && (pending || !session)) return
    let active = true
    fetch(`/api/pro/blocks/${name}`)
      .then(async (response) => {
        if (response.status === 401 || response.status === 403) {
          return {
            status: "locked",
            reason: response.status === 401 ? "signed-out" : "free",
          } as const
        }
        if (!response.ok) return { status: "error" } as const
        const { files } = (await response.json()) as { files: ProFile[] }
        return { status: "ready", files } as const
      })
      .catch(() => ({ status: "error" }) as const)
      .then((next) => {
        if (active) setState(next)
      })
    return () => {
      active = false
    }
  }, [free, name, pending, session])

  if (free) return state
  if (pending) return { status: "loading" }
  if (!session) return { status: "locked", reason: "signed-out" }
  return state
}

function LockedCode({
  name,
  count,
  reason,
}: {
  name: string
  count: number
  reason: "signed-out" | "free"
}) {
  const c = useChrome()
  const price = useSoloPrice()

  return (
    <Empty variant="outline">
      <EmptyHeader>
        <EmptyMedia variant="stack">
          <IconLock />
        </EmptyMedia>
        <EmptyTitle>{c("The code is part of HextaUI Pro")}</EmptyTitle>
        <EmptyDescription>
          <BlockPriceNote count={count} />
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        {reason === "signed-out" ? (
          <>
            <BlockBuyButton name={name} from="block-code" />
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm text-muted-foreground">
                {c("Already have Pro? Sign in to see the code.")}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  feedback
                  successLabel={c("Redirecting…")}
                  errorLabel={c("Try again")}
                  onClick={() => signIn("github")}
                >
                  <IconBrandGithub data-icon="inline-start" />
                  GitHub
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  feedback
                  successLabel={c("Redirecting…")}
                  errorLabel={c("Try again")}
                  onClick={() => signIn("google")}
                >
                  <IconBrandGoogle data-icon="inline-start" />
                  Google
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <Button
              feedback
              successLabel={c("Redirecting…")}
              errorLabel={c("Try again")}
              onClick={() => {
                track("Pro link clicked", {
                  from: "block-code",
                  to: "checkout",
                  block: name,
                })
                return startCheckout("solo")
              }}
            >
              {c("Get the full block")}
              <span aria-hidden="true">—</span>
              <span className="tabular-nums">${price}</span>
            </Button>
            <Link
              href="/pricing"
              className="text-sm text-muted-foreground underline underline-offset-4"
            >
              {c("Buying for a team? Compare plans")}
            </Link>
          </>
        )}
      </EmptyContent>
    </Empty>
  )
}

function CodeFile({ file }: { file: ProFile }) {
  return <DocsCodePanel html={file.html} title={file.path} collapsible />
}

function BlockCode({
  name,
  free = false,
  count,
}: {
  name: string
  free?: boolean
  count: number
}) {
  const state = useBlockCode(name, free)
  const c = useChrome()

  if (state.status === "loading") {
    return <Skeleton className="h-56 w-full rounded-xl" />
  }
  if (state.status === "locked") {
    return <LockedCode name={name} count={count} reason={state.reason} />
  }
  if (state.status === "error") {
    return (
      <p className="text-sm text-muted-foreground">
        {c("The code didn’t load. Refresh the page to try again.")}
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {state.files.map((file) => (
        <CodeFile key={file.path} file={file} />
      ))}
    </div>
  )
}

export { BlockCode }
