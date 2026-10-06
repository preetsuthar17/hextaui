"use client"

import * as React from "react"
import { IconKey } from "@tabler/icons-react"

import { DocsCopyButton } from "@/components/docs/docs-copy-button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

type Token = {
  id: string
  name: string
  hint: string
  createdAt: string
  lastUsedAt: string | null
}

const dateFormat = new Intl.DateTimeFormat("en", { dateStyle: "medium" })

const registrySnippet = `"registries": {
  "@hextaui-pro": {
    "url": "https://hextaui.com/r/pro/{name}.json",
    "headers": {
      "Authorization": "Bearer \${HEXTAUI_PRO_TOKEN}"
    }
  }
}`

function Snippet({ label, value }: { label: string; value: string }) {
  return (
    <figure className="min-w-0 overflow-hidden rounded-xl border bg-muted">
      <figcaption className="flex h-10 items-center justify-between gap-2 border-b ps-4 pe-1 font-mono text-xs text-muted-foreground">
        <span className="truncate">{label}</span>
        <DocsCopyButton value={value} label={`Copy ${label}`} />
      </figcaption>
      <pre className="overflow-x-auto p-4 font-mono text-sm">{value}</pre>
    </figure>
  )
}

async function request<T>(input: string, init?: RequestInit) {
  const response = await fetch(input, init)
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as {
      error?: string
    }
    throw new Error(body.error ?? "Something went wrong")
  }
  return (response.status === 204 ? null : await response.json()) as T
}

function ProTokens() {
  const [tokens, setTokens] = React.useState<Token[] | null>(null)
  const [created, setCreated] = React.useState<string | null>(null)
  const [name, setName] = React.useState("")

  const load = React.useCallback(async () => {
    const { tokens } = await request<{ tokens: Token[] }>("/api/tokens")
    setTokens(tokens)
  }, [])

  React.useEffect(() => {
    load().catch(() => setTokens([]))
  }, [load])

  const create = async () => {
    const result = await request<{ token: string }>("/api/tokens", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name }),
    })
    setCreated(result.token)
    setName("")
    await load()
  }

  const revoke = async (id: string) => {
    await request(`/api/tokens/${id}`, { method: "DELETE" })
    await load()
  }

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="font-medium">Install with the shadcn CLI</h2>
        <p className="text-sm text-muted-foreground">
          Add the Pro registry to your <code>components.json</code>, put a token
          in <code>.env.local</code> as <code>HEXTAUI_PRO_TOKEN</code>, then run{" "}
          <code>npx shadcn add @hextaui-pro/&lt;block&gt;</code>.
        </p>
      </div>
      <Snippet label="components.json" value={registrySnippet} />
      {created ? (
        <Alert>
          <IconKey />
          <AlertTitle>Copy your token now</AlertTitle>
          <AlertDescription>
            It won’t be shown again. Keep it out of version control.
          </AlertDescription>
        </Alert>
      ) : null}
      {created ? (
        <Snippet label=".env.local" value={`HEXTAUI_PRO_TOKEN=${created}`} />
      ) : null}
      <form
        className="flex items-end gap-2"
        onSubmit={(event) => event.preventDefault()}
      >
        <Field className="flex-1">
          <FieldLabel>Token name</FieldLabel>
          <Input
            value={name}
            maxLength={60}
            placeholder="Work laptop"
            onChange={(event) => setName(event.target.value)}
          />
        </Field>
        <Button
          type="submit"
          variant="outline"
          feedback
          successLabel="Created"
          errorLabel={(error) =>
            error instanceof Error ? error.message : "Failed"
          }
          onClick={create}
        >
          Create token
        </Button>
      </form>
      {tokens === null ? (
        <Skeleton className="h-12 w-full" />
      ) : tokens.length > 0 ? (
        <ul className="flex flex-col divide-y rounded-xl border">
          {tokens.map((token) => (
            <li
              key={token.id}
              className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
            >
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="truncate font-medium">{token.name}</span>
                <span className="truncate font-mono text-xs text-muted-foreground">
                  {token.hint} · created{" "}
                  {dateFormat.format(new Date(token.createdAt))}
                  {token.lastUsedAt
                    ? ` · last used ${dateFormat.format(new Date(token.lastUsedAt))}`
                    : " · never used"}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                feedback
                onClick={() => revoke(token.id)}
              >
                Revoke
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}

export { ProTokens }
