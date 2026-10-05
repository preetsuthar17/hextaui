import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const cities = [
  { value: "cairo", label: "القاهرة" },
  { value: "riyadh", label: "الرياض" },
  { value: "dubai", label: "دبي" },
]

export function SelectRtl() {
  return (
    <div dir="rtl">
      <Select items={cities} defaultValue="riyadh">
        <SelectTrigger aria-label="المدينة" className="w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {cities.map((city) => (
            <SelectItem key={city.value} value={city.value}>
              {city.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
