"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"

let attempt = 0

function deploy() {
  attempt += 1
  const fails = attempt % 2 === 0
  return new Promise<{ url: string }>((resolve, reject) =>
    setTimeout(
      () =>
        fails
          ? reject(new Error("Build failed"))
          : resolve({ url: "hextaui.com" }),
      1800
    )
  )
}

export function ToastPromise() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast.promise(deploy(), {
          loading: "Deploying…",
          success: (data) => ({
            title: "Deployed",
            description: `Live at ${data.url}`,
          }),
          error: (error) => ({
            title: "Deploy failed",
            description: error instanceof Error ? error.message : "Try again.",
          }),
        })
      }
    >
      Deploy (fails every other time)
    </Button>
  )
}
