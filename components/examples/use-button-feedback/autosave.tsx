"use client"

import * as React from "react"
import { IconAlertCircle, IconCircleCheck } from "@tabler/icons-react"

import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { useButtonFeedback } from "@/hooks/use-button-feedback"

function save(fail: boolean) {
  return new Promise<void>((resolve, reject) =>
    setTimeout(
      () => (fail ? reject(new Error("Network error")) : resolve()),
      900
    )
  )
}

const labels = {
  idle: "",
  loading: "Saving…",
  success: "Saved",
  error: "Couldn’t save",
}

export function UseButtonFeedbackAutosave() {
  const [fail, setFail] = React.useState(false)
  const { status, track } = useButtonFeedback({ resetAfter: 1500 })

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <textarea
        aria-label="Notes"
        rows={4}
        defaultValue="Edit me, then click outside to save."
        onBlur={() => track(() => save(fail))}
        className="w-full resize-none rounded-lg bg-muted px-3 py-2 text-sm/6 outline-none focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden pointer-coarse:text-touch"
      />
      <div className="flex items-center justify-between gap-4 text-sm">
        <label className="flex items-center gap-2 text-muted-foreground">
          <Switch checked={fail} onCheckedChange={setFail} size="sm" />
          Fail the save
        </label>
        <span
          role="status"
          className="flex h-5 items-center gap-1.5 text-muted-foreground data-[status=error]:text-destructive"
          data-status={status}
        >
          {status === "loading" ? <Spinner size="sm" /> : null}
          {status === "success" ? (
            <IconCircleCheck className="size-3.5 text-success" />
          ) : null}
          {status === "error" ? <IconAlertCircle className="size-3.5" /> : null}
          {labels[status]}
        </span>
      </div>
    </div>
  )
}
