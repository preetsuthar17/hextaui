"use client"

import { Switch } from "@/components/ui/switch"

function save(succeed: boolean) {
  return new Promise<void>((resolve, reject) =>
    setTimeout(() => (succeed ? resolve() : reject(new Error("Offline"))), 1200)
  )
}

export function SwitchAsync() {
  return (
    <div className="flex flex-col gap-4 text-sm">
      <label className="flex items-center gap-3">
        <Switch onCheckedChange={() => save(true)} />
        Sync to cloud (saves)
      </label>
      <label className="flex items-center gap-3">
        <Switch defaultChecked onCheckedChange={() => save(false)} />
        Public profile (fails and flips back)
      </label>
    </div>
  )
}
