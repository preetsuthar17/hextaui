"use client"

import * as React from "react"
import { IconMinus, IconPlus } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { NumberFlow } from "@/components/ui/number-flow"

export function DrawerDemo() {
  const [goal, setGoal] = React.useState(350)

  return (
    <Drawer>
      <DrawerTrigger render={<Button variant="outline" />}>
        Set daily goal
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto flex w-full max-w-sm flex-col">
          <DrawerHeader>
            <DrawerTitle>Move goal</DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
          </DrawerHeader>
          <div className="flex items-center justify-center gap-6 p-6">
            <Button
              variant="outline"
              size="icon"
              aria-label="Decrease goal"
              disabled={goal <= 200}
              onClick={() => setGoal(goal - 10)}
            >
              <IconMinus />
            </Button>
            <div className="flex min-w-32 flex-col items-center">
              <NumberFlow
                value={goal}
                className="text-6xl font-semibold tracking-tight"
              />
              <span className="text-xs text-muted-foreground uppercase">
                Calories / day
              </span>
            </div>
            <Button
              variant="outline"
              size="icon"
              aria-label="Increase goal"
              disabled={goal >= 600}
              onClick={() => setGoal(goal + 10)}
            >
              <IconPlus />
            </Button>
          </div>
          <DrawerFooter>
            <DrawerClose render={<Button />}>Save goal</DrawerClose>
            <DrawerClose render={<Button variant="outline" />}>
              Cancel
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
