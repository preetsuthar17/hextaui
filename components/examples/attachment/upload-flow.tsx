"use client"

import * as React from "react"
import { IconTable } from "@tabler/icons-react"

import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  type AttachmentState,
} from "@/components/ui/attachment"
import { Button } from "@/components/ui/button"

const descriptions: Record<AttachmentState, string> = {
  idle: "Ready to upload",
  uploading: "Uploading…",
  processing: "Processing",
  error: "Upload failed · connection lost",
  done: "CSV · 840 KB",
}

export function AttachmentUploadFlow() {
  const [state, setState] = React.useState<AttachmentState>("idle")
  const [progress, setProgress] = React.useState(0)
  const timer = React.useRef<ReturnType<typeof setInterval>>(undefined)

  React.useEffect(() => () => clearInterval(timer.current), [])

  const start = (fail: boolean) => {
    clearInterval(timer.current)
    setState("uploading")
    setProgress(0)
    let value = 0
    timer.current = setInterval(() => {
      value += 12
      if (fail && value >= 60) {
        clearInterval(timer.current)
        setState("error")
        return
      }
      if (value >= 100) {
        clearInterval(timer.current)
        setProgress(100)
        setState("processing")
        setTimeout(() => setState("done"), 900)
        return
      }
      setProgress(value)
    }, 250)
  }

  return (
    <div className="flex flex-col items-start gap-3">
      <Attachment state={state} progress={progress}>
        <AttachmentMedia>
          <IconTable />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>customers-2026.csv</AttachmentTitle>
          <AttachmentDescription>
            {state === "uploading"
              ? `Uploading… ${progress}%`
              : descriptions[state]}
          </AttachmentDescription>
        </AttachmentContent>
      </Attachment>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => start(false)}>
          Start upload
        </Button>
        <Button size="sm" variant="outline" onClick={() => start(true)}>
          Upload that fails
        </Button>
      </div>
    </div>
  )
}
