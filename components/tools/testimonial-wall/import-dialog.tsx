"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  findTweetUrls,
  maxImportLength,
  parseImport,
  type TweetRef,
} from "@/lib/testimonial-wall/import"
import {
  normalizeTestimonial,
  type Testimonial,
} from "@/lib/testimonial-wall/model"

type Status = { tone: "info" | "error"; text: string } | null

const maxTweets = 20

async function importTweet(tweet: TweetRef) {
  const response = await fetch(
    `/api/tools/oembed?url=${encodeURIComponent(tweet.url)}`,
    { headers: { accept: "application/json" } }
  )
  const data = (await response.json().catch(() => null)) as {
    testimonial?: unknown
    detail?: string
  } | null
  if (!response.ok) {
    throw new Error(data?.detail ?? `The import failed (${response.status}).`)
  }
  const testimonial = normalizeTestimonial(data?.testimonial)
  if (!testimonial) throw new Error("That post came back empty.")
  return testimonial
}

function plural(count: number, word: string) {
  return `${count} ${word}${count === 1 ? "" : "s"}`
}

function StatusText({ status }: { status: Status }) {
  return (
    <p
      role="status"
      aria-live="polite"
      className={
        status?.tone === "error"
          ? "min-h-5 text-sm text-pretty text-destructive"
          : "min-h-5 text-sm text-pretty text-muted-foreground"
      }
    >
      {status?.text}
    </p>
  )
}

function ImportDialog({
  open,
  onOpenChange,
  onImport,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (testimonials: Testimonial[], mode: "add" | "replace") => void
}) {
  const [tab, setTab] = React.useState("x")
  const [links, setLinks] = React.useState("")
  const [data, setData] = React.useState("")
  const [status, setStatus] = React.useState<Status>(null)
  const [busy, setBusy] = React.useState(false)
  const linksId = React.useId()
  const dataId = React.useId()

  const importPosts = async () => {
    const tweets = findTweetUrls(links).slice(0, maxTweets)
    if (tweets.length === 0) {
      setStatus({
        tone: "error",
        text: "Paste at least one x.com or twitter.com post link.",
      })
      return
    }
    setBusy(true)
    setStatus({
      tone: "info",
      text: `Reading ${plural(tweets.length, "post")}…`,
    })
    const results = await Promise.allSettled(tweets.map(importTweet))
    setBusy(false)
    const imported = results.flatMap((result) =>
      result.status === "fulfilled" ? [result.value] : []
    )
    const failed = results.flatMap((result) =>
      result.status === "rejected" ? [String(result.reason?.message ?? "")] : []
    )
    if (imported.length === 0) {
      setStatus({
        tone: "error",
        text: `Couldn’t read ${tweets.length === 1 ? "that post" : "those posts"}. ${failed[0] ?? ""} You can still add it by hand.`,
      })
      return
    }
    onImport(imported, "add")
    setLinks("")
    setStatus(
      failed.length > 0
        ? {
            tone: "error",
            text: `Added ${plural(imported.length, "post")}. ${plural(failed.length, "post")} couldn’t be read: ${failed[0]}`,
          }
        : null
    )
    if (failed.length === 0) onOpenChange(false)
  }

  const importData = (mode: "add" | "replace") => {
    const result = parseImport(data)
    if (!result.ok) {
      setStatus({ tone: "error", text: result.error })
      return
    }
    onImport(result.testimonials, mode)
    setData("")
    setStatus(null)
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) setStatus(null)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import testimonials</DialogTitle>
          <DialogDescription>
            Read public X posts, or paste rows from a spreadsheet or an export.
          </DialogDescription>
        </DialogHeader>
        <Tabs
          value={tab}
          onValueChange={(value) => {
            setTab(String(value))
            setStatus(null)
          }}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="mb-4 px-6">
            <TabsList>
              <TabsTrigger value="x">X posts</TabsTrigger>
              <TabsTrigger value="data">JSON or CSV</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="x" className="flex min-h-0 flex-1 flex-col">
            <DialogBody>
              <div className="flex flex-col gap-2">
                <label htmlFor={linksId} className="text-sm font-medium">
                  Post links
                </label>
                <Textarea
                  id={linksId}
                  value={links}
                  minRows={4}
                  maxRows={10}
                  spellCheck={false}
                  placeholder={
                    "https://x.com/handle/status/1234567890\nOne link per line"
                  }
                  onChange={(event) => setLinks(event.target.value)}
                />
                <p className="text-xs text-pretty text-muted-foreground">
                  Up to {maxTweets} posts at once. Only the link is sent, to X’s
                  public oEmbed endpoint. Protected posts can’t be read.
                </p>
                <StatusText status={status} />
              </div>
            </DialogBody>
            <DialogFooter>
              <Button
                onClick={importPosts}
                disabled={busy || links.trim() === ""}
                aria-busy={busy || undefined}
              >
                {busy ? "Importing…" : "Import posts"}
              </Button>
            </DialogFooter>
          </TabsContent>
          <TabsContent value="data" className="flex min-h-0 flex-1 flex-col">
            <DialogBody>
              <div className="flex flex-col gap-2">
                <label htmlFor={dataId} className="text-sm font-medium">
                  JSON or CSV
                </label>
                <Textarea
                  id={dataId}
                  value={data}
                  minRows={6}
                  maxRows={12}
                  maxLength={maxImportLength}
                  spellCheck={false}
                  placeholder={
                    'name,body,handle,rating\n"Ada Lane","Saved us a week.",adalane,5'
                  }
                  onChange={(event) => setData(event.target.value)}
                />
                <p className="text-xs text-pretty text-muted-foreground">
                  Each row needs a name and a body (or text, quote). Handle,
                  role, avatar, source, url, date and rating are optional.
                </p>
                <StatusText status={status} />
              </div>
            </DialogBody>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => importData("replace")}
                disabled={data.trim() === ""}
              >
                Replace all
              </Button>
              <Button
                onClick={() => importData("add")}
                disabled={data.trim() === ""}
              >
                Add to wall
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export { ImportDialog }
