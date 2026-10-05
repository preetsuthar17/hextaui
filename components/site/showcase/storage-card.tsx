"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { NumberFlow } from "@/components/ui/number-flow"
import {
  Progress,
  ProgressCircle,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"

const initial = [
  { name: "Images", size: 18.4 },
  { name: "Videos", size: 22.1 },
  { name: "Documents", size: 6.3 },
]

const capacity = 64

function StorageCard() {
  const [files, setFiles] = React.useState(initial)
  const used = files.reduce((total, file) => total + file.size, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Storage</CardTitle>
        <CardDescription>{capacity} GB on the Pro plan</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <ProgressCircle
              value={(used / capacity) * 100}
              size="xl"
              aria-label="Storage used"
            />
            <div className="flex flex-col">
              <span className="text-2xl font-semibold tracking-tight">
                <NumberFlow
                  value={used}
                  format={{ maximumFractionDigits: 1 }}
                  suffix=" GB"
                />
              </span>
              <span className="text-muted-foreground">
                used of {capacity} GB
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {files.map((file) => (
              <Progress
                key={file.name}
                value={(file.size / capacity) * 100}
                size="sm"
              >
                <ProgressLabel>{file.name}</ProgressLabel>
                <ProgressValue>
                  {() => (
                    <NumberFlow
                      value={file.size}
                      format={{ maximumFractionDigits: 1 }}
                      suffix=" GB"
                    />
                  )}
                </ProgressValue>
              </Progress>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setFiles((current) =>
                  current.map((file) => ({
                    ...file,
                    size: Math.max(0.4, +(file.size * 0.6).toFixed(1)),
                  }))
                )
              }
            >
              Clean up
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setFiles(initial)}>
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { StorageCard }
