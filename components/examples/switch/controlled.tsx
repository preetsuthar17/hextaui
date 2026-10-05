"use client"

import * as React from "react"

import { Switch } from "@/components/ui/switch"

export function SwitchControlled() {
  const [dark, setDark] = React.useState(false)

  return (
    <label className="flex items-center gap-3 text-sm">
      <Switch checked={dark} onCheckedChange={setDark} />
      Dark mode is {dark ? "on" : "off"}
    </label>
  )
}
