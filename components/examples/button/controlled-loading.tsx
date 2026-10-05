"use client"

import * as React from "react"
import { IconSend } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"

export function ButtonControlledLoading() {
  const [loading, setLoading] = React.useState(false)

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button loading={loading} onClick={() => setLoading(true)}>
        <IconSend data-icon="inline-start" />
        Send invite
      </Button>
      <Button variant="ghost" onClick={() => setLoading(false)}>
        Stop loading
      </Button>
    </div>
  )
}
