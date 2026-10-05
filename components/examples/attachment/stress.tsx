"use client"

import * as React from "react"
import { IconFileText, IconX } from "@tabler/icons-react"

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  type AttachmentState,
} from "@/components/ui/attachment"
import { Button } from "@/components/ui/button"

const names = [
  "x".repeat(300) + ".pdf",
  "archive.tar.gz",
  "🎉🎉🎉 party photo final FINAL (2).png",
  "<script>alert(1)</script>.html",
  "a".repeat(400),
  ".gitignore",
  "تقرير-المبيعات-الربعي-النهائي-للإدارة.pdf",
  "名前がとても長いファイルの例です.docx",
  "",
  "file.with.many.dots.in.its.name.json",
]

const states: AttachmentState[] = [
  "idle",
  "uploading",
  "processing",
  "error",
  "done",
]

const bulk = Array.from(
  { length: 200 },
  (_, index) => `bulk-export-${index + 1}.csv`
)

export function AttachmentStress() {
  const [tick, setTick] = React.useState(0)
  const [running, setRunning] = React.useState(false)

  React.useEffect(() => {
    if (!running) {
      return
    }
    const timer = setInterval(() => setTick((value) => value + 1), 60)
    return () => clearInterval(timer)
  }, [running])

  return (
    <div className="flex w-full flex-col items-start gap-3">
      <div className="flex w-56 flex-col gap-2 rounded-lg border border-dashed p-2">
        {names.map((name, index) => {
          const state = running
            ? states[(tick + index) % states.length]
            : "done"
          return (
            <Attachment
              key={index}
              state={state}
              progress={((tick * 37 + index * 13) % 160) - 30}
            >
              <AttachmentMedia>
                <IconFileText />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>{name}</AttachmentTitle>
                <AttachmentDescription>
                  {state === "error"
                    ? "Upload failed because the server rejected this extremely long file name"
                    : state}
                </AttachmentDescription>
              </AttachmentContent>
              <AttachmentActions>
                <AttachmentAction aria-label={`Remove ${name || "file"}`}>
                  <IconX />
                </AttachmentAction>
              </AttachmentActions>
            </Attachment>
          )
        })}
      </div>
      <Button size="sm" variant="outline" onClick={() => setRunning(!running)}>
        {running ? "Stop chaos" : "Start chaos"}
      </Button>
      <AttachmentGroup className="w-full rounded-lg border">
        {bulk.map((name) => (
          <Attachment key={name} size="xs">
            <AttachmentMedia>
              <IconFileText />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>{name}</AttachmentTitle>
            </AttachmentContent>
          </Attachment>
        ))}
      </AttachmentGroup>
    </div>
  )
}
