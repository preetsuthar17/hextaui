import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SelectDropdown() {
  return (
    <Select defaultValue="newest">
      <SelectTrigger aria-label="Sort by" className="w-44">
        <SelectValue />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        <SelectItem value="newest">Newest first</SelectItem>
        <SelectItem value="oldest">Oldest first</SelectItem>
        <SelectItem value="popular">Most popular</SelectItem>
      </SelectContent>
    </Select>
  )
}
