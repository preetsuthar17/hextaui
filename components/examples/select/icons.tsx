"use client"

import {
  IconCircleCheck,
  IconCircleDashed,
  IconCircleHalf2,
  IconCircleX,
} from "@tabler/icons-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const statuses = [
  { value: "backlog", label: "Backlog", icon: IconCircleDashed },
  { value: "progress", label: "In progress", icon: IconCircleHalf2 },
  { value: "done", label: "Done", icon: IconCircleCheck },
  { value: "canceled", label: "Canceled", icon: IconCircleX },
]

export function SelectIcons() {
  return (
    <Select defaultValue="progress">
      <SelectTrigger aria-label="Status" className="w-44">
        <SelectValue>
          {(value: string) => {
            const status = statuses.find((item) => item.value === value)
            if (!status) {
              return null
            }
            const Icon = status.icon
            return (
              <>
                <Icon />
                {status.label}
              </>
            )
          }}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {statuses.map((status) => (
          <SelectItem key={status.value} value={status.value}>
            <status.icon />
            {status.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
