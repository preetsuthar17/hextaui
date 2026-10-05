"use client"

import * as React from "react"
import { IconGitBranch } from "@tabler/icons-react"
import { cn } from "cn"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { NumberFlow } from "@/components/ui/number-flow"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"
import { toast } from "@/components/ui/toast"

const steps = [
  { label: "Installing dependencies…", until: 28 },
  { label: "Building pages…", until: 71 },
  { label: "Uploading assets…", until: 100 },
]

type DeployState = "ready" | "building" | "live" | "failed"

function DeployCard() {
  const [state, setState] = React.useState<DeployState>("ready")
  const [progress, setProgress] = React.useState(0)
  const attempts = React.useRef(0)
  const timer = React.useRef<ReturnType<typeof setInterval>>(undefined)

  React.useEffect(() => () => clearInterval(timer.current), [])

  const step = steps.find((item) => progress < item.until) ?? steps.at(-1)!

  const deploy = () => {
    attempts.current += 1
    const fails = attempts.current % 3 === 0
    clearInterval(timer.current)
    setState("building")
    setProgress(0)
    const run = new Promise<void>((resolve, reject) => {
      let value = 0
      timer.current = setInterval(() => {
        value = Math.min(100, value + 3 + Math.round(Math.random() * 5))
        if (fails && value >= 64) {
          clearInterval(timer.current)
          setProgress(64)
          setState("failed")
          reject(new Error("Type error in app/page.tsx"))
          return
        }
        setProgress(value)
        if (value >= 100) {
          clearInterval(timer.current)
          setState("live")
          resolve()
        }
      }, 90)
    })
    toast.promise(run, {
      loading: "Deploying hextaui…",
      success: () => ({
        title: "Deployed",
        description: "Live at hextaui.com",
      }),
      error: (error) => ({
        title: "Build failed",
        description: error instanceof Error ? error.message : "Try again.",
      }),
    })
    return run
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>hextaui</CardTitle>
        <CardDescription>
          <span className="inline-flex items-center gap-1">
            <IconGitBranch className="size-3.5" />
            main · 7b171bf
          </span>
        </CardDescription>
        <CardAction>
          <Badge
            variant={
              state === "live"
                ? "success"
                : state === "failed"
                  ? "destructive"
                  : state === "building"
                    ? "info"
                    : "default"
            }
          >
            {state === "live"
              ? "Live"
              : state === "failed"
                ? "Failed"
                : state === "building"
                  ? "Building"
                  : "Ready"}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <Progress value={progress}>
            <ProgressLabel>
              <span
                key={state === "building" ? step.label : state}
                className={cn(
                  state === "building" && "shimmer",
                  state === "live" && "shimmer shimmer-once"
                )}
              >
                {state === "building"
                  ? step.label
                  : state === "live"
                    ? "Deployed to production"
                    : state === "failed"
                      ? "Build stopped at 64%"
                      : "Waiting for a deploy"}
              </span>
            </ProgressLabel>
            <ProgressValue>
              {(_, current) => <NumberFlow value={current ?? 0} suffix="%" />}
            </ProgressValue>
          </Progress>
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <span className="text-xs text-muted-foreground">
          Every third deploy fails on purpose
        </span>
        <Button feedback disabled={state === "building"} onClick={deploy}>
          Deploy
        </Button>
      </CardFooter>
    </Card>
  )
}

export { DeployCard }
