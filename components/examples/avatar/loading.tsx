"use client"

import * as React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function AvatarLoading() {
  const [version, setVersion] = React.useState(0)
  const [loading, setLoading] = React.useState(false)
  const timer = React.useRef<number>(undefined)

  React.useEffect(() => () => window.clearTimeout(timer.current), [])

  const reload = () => {
    window.clearTimeout(timer.current)
    setLoading(true)
    timer.current = window.setTimeout(() => {
      setVersion((value) => value + 1)
      setLoading(false)
    }, 1200)
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Avatar size="xl">
        {loading ? null : (
          <AvatarImage src={`/preview/landscape.svg?v=${version}`} alt="" />
        )}
        <AvatarFallback>AT</AvatarFallback>
      </Avatar>
      <Avatar size="xl">
        <AvatarImage src="/preview/missing.png" alt="" />
        <AvatarFallback>BI</AvatarFallback>
      </Avatar>
      <Avatar size="xl">
        <AvatarImage src="/preview/landscape.svg" alt="" />
        <AvatarFallback delay={600}>GH</AvatarFallback>
      </Avatar>
      <Button variant="outline" size="sm" onClick={reload}>
        Load a new photo
      </Button>
    </div>
  )
}
