"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
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
      data-error={status?.tone === "error" ? "" : undefined}
      className="min-h-4 text-xs text-pretty text-muted-foreground data-error:text-destructive"
    >
      {status?.text}
    </p>
  )
}

function ImportPanel({
  onImport,
  onDone,
}: {
  onImport: (testimonials: Testimonial[], mode: "add" | "replace") => void
  onDone: () => void
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
    if (failed.length > 0) {
      setStatus({
        tone: "error",
        text: `Added ${plural(imported.length, "post")}. ${plural(failed.length, "post")} couldn’t be read: ${failed[0]}`,
      })
      return
    }
    setStatus(null)
    onDone()
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
    onDone()
  }

  return (
    <div className="p-4">
      <Tabs
        value={tab}
        onValueChange={(value) => {
          setTab(String(value))
          setStatus(null)
        }}
      >
        <TabsList className="w-full *:flex-1">
          <TabsTrigger value="x">X posts</TabsTrigger>
          <TabsTrigger value="data">JSON or CSV</TabsTrigger>
        </TabsList>
        <TabsContent value="x">
          <div className="flex flex-col gap-2">
            <label htmlFor={linksId} className="text-xs font-medium">
              Post links
            </label>
            <Textarea
              id={linksId}
              value={links}
              minRows={5}
              maxRows={12}
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
            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={importPosts}
                disabled={busy || links.trim() === ""}
                aria-busy={busy || undefined}
              >
                {busy ? "Importing…" : "Import posts"}
              </Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="data">
          <div className="flex flex-col gap-2">
            <label htmlFor={dataId} className="text-xs font-medium">
              JSON or CSV
            </label>
            <Textarea
              id={dataId}
              value={data}
              minRows={7}
              maxRows={14}
              maxLength={maxImportLength}
              spellCheck={false}
              placeholder={
                'name,body,handle,rating\n"Ada Lane","Saved us a week.",adalane,5'
              }
              onChange={(event) => setData(event.target.value)}
            />
            <p className="text-xs text-pretty text-muted-foreground">
              Each row needs a name and a body (or text, quote). Handle, role,
              avatar, source, url, date and rating are optional. Rows pasted
              from a spreadsheet work too.
            </p>
            <StatusText status={status} />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => importData("replace")}
                disabled={data.trim() === ""}
              >
                Replace all
              </Button>
              <Button
                size="sm"
                onClick={() => importData("add")}
                disabled={data.trim() === ""}
              >
                Add to wall
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export { ImportPanel }
