"use client"

import * as React from "react"
import { IconRocket } from "@tabler/icons-react"

import { Button, type ButtonStatus } from "@/components/ui/button"

const statuses: ButtonStatus[] = ["idle", "loading", "success", "error"]

export function ButtonControlledStatus() {
  const [status, setStatus] = React.useState<ButtonStatus>("idle")

  return (
    <div className="flex flex-col items-center gap-3">
      <Button
        status={status}
        onStatusChange={setStatus}
        successLabel="Deployed"
        errorLabel="Deploy failed"
      >
        <IconRocket data-icon="inline-start" />
        Deploy
      </Button>
      <div className="flex flex-wrap justify-center gap-2">
        {statuses.map((next) => (
          <Button
            key={next}
            size="xs"
            variant={status === next ? "secondary" : "ghost"}
            onClick={() => setStatus(next)}
          >
            {next}
          </Button>
        ))}
      </div>
    </div>
  )
}
