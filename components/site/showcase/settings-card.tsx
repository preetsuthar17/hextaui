"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

function save(succeed: boolean) {
  return new Promise<void>((resolve, reject) =>
    setTimeout(() => (succeed ? resolve() : reject(new Error("Offline"))), 1100)
  )
}

const settings = [
  {
    title: "Sync to cloud",
    description: "Saves to the server before it flips.",
    on: true,
    succeed: true,
  },
  {
    title: "Weekly digest",
    description: "A summary of what changed, every Monday.",
    on: false,
    succeed: true,
  },
  {
    title: "Public profile",
    description: "This one fails, and flips back on its own.",
    on: false,
    succeed: false,
  },
]

function SettingsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>Switches that wait for the server.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {settings.map((setting, index) => (
            <div key={setting.title} className="flex flex-col gap-4">
              {index > 0 && <Separator />}
              <label className="flex items-center justify-between gap-4">
                <span className="flex flex-col gap-0.5">
                  <span className="font-medium">{setting.title}</span>
                  <span className="text-muted-foreground">
                    {setting.description}
                  </span>
                </span>
                <Switch
                  defaultChecked={setting.on}
                  onCheckedChange={() => save(setting.succeed)}
                />
              </label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export { SettingsCard }
