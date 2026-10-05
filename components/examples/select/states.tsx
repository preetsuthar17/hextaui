import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SelectStates() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select defaultValue="pro" disabled>
        <SelectTrigger aria-label="Plan" className="w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pro">Pro</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="weekly">
        <SelectTrigger aria-label="Digest" className="w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="daily">Daily</SelectItem>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="monthly" disabled>
            Monthly (soon)
          </SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger aria-label="Region" aria-invalid className="w-36">
          <SelectValue placeholder="Region" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="us">United States</SelectItem>
          <SelectItem value="eu">Europe</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
