"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const labels = ["Bug", "Feature", "Design", "Docs", "Performance"]

export function SelectMultiple() {
  return (
    <Select multiple defaultValue={["Bug", "Design"]}>
      <SelectTrigger aria-label="Labels" className="w-56">
        <SelectValue placeholder="Add labels">
          {(value: string[]) =>
            value.length > 2 ? `${value.length} labels` : value.join(", ")
          }
        </SelectValue>
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        {labels.map((label) => (
          <SelectItem key={label} value={label}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
