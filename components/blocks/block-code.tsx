"use client"

import * as React from "react"
import { IconBrandTypescript, IconLock } from "@tabler/icons-react"

import { DocsCodePanel } from "@/components/docs/docs-code-panel"
import { DocsCopyButton } from "@/components/docs/docs-copy-button"
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
import { SignInOptions } from "@/components/account/sign-in-options"
import { startCheckout, useSession } from "@/lib/auth-client"

type ProFile = { path: string; code: string; html: string }

type CodeState =
  | { status: "loading" }
  | { status: "locked"; reason: "signed-out" | "free" }
  | { status: "error" }
  | { status: "ready"; files: ProFile[] }

function useBlockCode(name: string): CodeState {
  const { session, pending } = useSession()
  const [state, setState] = React.useState<CodeState>({ status: "loading" })

  React.useEffect(() => {
    if (pending || !session) return
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
  }, [name, pending, session])

  if (pending) return { status: "loading" }
  if (!session) return { status: "locked", reason: "signed-out" }
  return state
}

function LockedCode({ reason }: { reason: "signed-out" | "free" }) {
  return (
    <Empty variant="outline">
      <EmptyHeader>
        <EmptyMedia variant="stack">
          <IconLock />
        </EmptyMedia>
        <EmptyTitle>The code is part of HextaUI Pro</EmptyTitle>
        <EmptyDescription>
          One payment of $79 unlocks every block, including future ones. Copy
          the code here or install it with the shadcn CLI.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        {reason === "signed-out" ? (
          <SignInOptions />
        ) : (
          <Button
            feedback
            successLabel="Redirecting…"
            errorLabel="Try again"
            onClick={() => startCheckout()}
          >
            Get Pro
          </Button>
        )}
      </EmptyContent>
    </Empty>
  )
}

function CodeFile({ file }: { file: ProFile }) {
  return (
    <figure className="min-w-0 overflow-hidden rounded-xl border bg-muted">
      <figcaption className="flex h-10 items-center justify-between gap-2 border-b ps-4 pe-1 font-mono text-xs text-muted-foreground">
        <span className="flex min-w-0 items-center gap-2">
          <IconBrandTypescript aria-hidden="true" className="size-4 shrink-0" />
          <span className="truncate">{file.path}</span>
        </span>
        <DocsCopyButton value={file.code} />
      </figcaption>
      <DocsCodePanel
        html={file.html}
        code={file.code}
        collapsible
        copyable={false}
      />
    </figure>
  )
}

function BlockCode({ name }: { name: string }) {
  const state = useBlockCode(name)

  if (state.status === "loading") {
    return <Skeleton className="h-56 w-full rounded-xl" />
  }
  if (state.status === "locked") {
    return <LockedCode reason={state.reason} />
  }
  if (state.status === "error") {
    return (
      <p className="text-sm text-muted-foreground">
        The code didn’t load. Refresh the page to try again.
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
