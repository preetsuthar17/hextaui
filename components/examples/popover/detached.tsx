"use client"

import { Button } from "@/components/ui/button"
import {
  createPopoverHandle,
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

const people = createPopoverHandle<{ name: string; role: string }>()

export function PopoverDetached() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <PopoverTrigger
        handle={people}
        payload={{ name: "Ada Lovelace", role: "Analyst" }}
        render={<Button variant="outline" size="sm" />}
      >
        Ada
      </PopoverTrigger>
      <PopoverTrigger
        handle={people}
        payload={{
          name: "Grace Hopper",
          role: "Rear admiral and the person who popularised the term debugging",
        }}
        render={<Button variant="outline" size="sm" />}
      >
        Grace
      </PopoverTrigger>
      <PopoverTrigger
        handle={people}
        payload={{ name: "Alan Turing", role: "Mathematician" }}
        render={<Button variant="outline" size="sm" />}
      >
        Alan
      </PopoverTrigger>
      <Popover handle={people}>
        {({ payload }) => (
          <PopoverContent>
            <PopoverHeader>
              <PopoverTitle>{payload?.name}</PopoverTitle>
              <PopoverDescription>{payload?.role}</PopoverDescription>
            </PopoverHeader>
          </PopoverContent>
        )}
      </Popover>
    </div>
  )
}
