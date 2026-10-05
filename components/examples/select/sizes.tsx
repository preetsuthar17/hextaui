import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const sizes = ["sm", "default", "lg"] as const

export function SelectSizes() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {sizes.map((size) => (
        <Select key={size} defaultValue="week">
          <SelectTrigger size={size} aria-label={`Range (${size})`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Today</SelectItem>
            <SelectItem value="week">This week</SelectItem>
            <SelectItem value="month">This month</SelectItem>
          </SelectContent>
        </Select>
      ))}
    </div>
  )
}
