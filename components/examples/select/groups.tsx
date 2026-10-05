import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const zones = [
  {
    label: "Americas",
    items: [
      "Los Angeles",
      "Denver",
      "Chicago",
      "New York",
      "Toronto",
      "Mexico City",
      "Bogotá",
      "São Paulo",
      "Buenos Aires",
    ],
  },
  {
    label: "Europe",
    items: ["London", "Lisbon", "Paris", "Berlin", "Stockholm", "Athens"],
  },
  {
    label: "Asia",
    items: ["Dubai", "Mumbai", "Singapore", "Shanghai", "Tokyo", "Seoul"],
  },
]

export function SelectGroups() {
  return (
    <Select defaultValue="Berlin">
      <SelectTrigger aria-label="Time zone" className="w-56">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {zones.map((zone, index) => (
          <SelectGroup key={zone.label}>
            {index > 0 ? <SelectSeparator /> : null}
            <SelectLabel>{zone.label}</SelectLabel>
            {zone.items.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  )
}
