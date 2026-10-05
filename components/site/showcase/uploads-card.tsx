"use client"

import * as React from "react"
import { IconFileTypePdf, IconPhoto, IconTable } from "@tabler/icons-react"

import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  type AttachmentState,
} from "@/components/ui/attachment"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type Upload = {
  name: string
  size: string
  icon: React.ReactNode
  fails: boolean
  state: AttachmentState
  progress: number
}

const initial: Upload[] = [
  {
    name: "customers-2026.csv",
    size: "CSV · 840 KB",
    icon: <IconTable />,
    fails: false,
    state: "done",
    progress: 100,
  },
  {
    name: "launch-deck.pdf",
    size: "PDF · 4.2 MB",
    icon: <IconFileTypePdf />,
    fails: true,
    state: "idle",
    progress: 0,
  },
  {
    name: "hero-shot.png",
    size: "PNG · 1.8 MB",
    icon: <IconPhoto />,
    fails: false,
    state: "idle",
    progress: 0,
  },
]

function describe(upload: Upload) {
  switch (upload.state) {
    case "uploading":
      return `Uploading… ${upload.progress}%`
    case "processing":
      return "Processing"
    case "error":
      return "Upload failed · connection lost"
    case "done":
      return upload.size
    default:
      return "Waiting"
  }
}

function UploadsCard() {
  const [uploads, setUploads] = React.useState(initial)
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([])

  React.useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const update = (name: string, patch: Partial<Upload>) =>
    setUploads((current) =>
      current.map((upload) =>
        upload.name === name ? { ...upload, ...patch } : upload
      )
    )

  const start = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setUploads(
      initial.map((upload) => ({ ...upload, state: "uploading", progress: 0 }))
    )
    initial.forEach((upload, index) => {
      let progress = 0
      const tick = () => {
        progress = Math.min(100, progress + 6 + index * 3)
        if (upload.fails && progress >= 58) {
          update(upload.name, { state: "error", progress })
          return
        }
        if (progress >= 100) {
          update(upload.name, { state: "processing", progress })
          timers.current.push(
            setTimeout(() => update(upload.name, { state: "done" }), 700)
          )
          return
        }
        update(upload.name, { progress })
        timers.current.push(setTimeout(tick, 180))
      }
      timers.current.push(setTimeout(tick, 180 + index * 140))
    })
  }

  const busy = uploads.some(
    (upload) => upload.state === "uploading" || upload.state === "processing"
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Uploads</CardTitle>
        <CardDescription>
          Three files, one with a bad connection.
        </CardDescription>
        <CardAction>
          <Button size="sm" variant="outline" disabled={busy} onClick={start}>
            Upload
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {uploads.map((upload) => (
            <Attachment
              key={upload.name}
              state={upload.state}
              progress={upload.progress}
              className="w-full"
            >
              <AttachmentMedia>{upload.icon}</AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>{upload.name}</AttachmentTitle>
                <AttachmentDescription>
                  {describe(upload)}
                </AttachmentDescription>
              </AttachmentContent>
            </Attachment>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export { UploadsCard }
