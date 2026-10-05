import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const fonts = [
  { value: "inter", label: "Inter" },
  { value: "geist", label: "Geist" },
  { value: "ibm-plex", label: "IBM Plex Sans" },
  { value: "source-serif", label: "Source Serif" },
  { value: "jetbrains", label: "JetBrains Mono" },
]

export function SelectDemo() {
  return (
    <Select items={fonts} defaultValue="geist">
      <SelectTrigger aria-label="Font" className="w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {fonts.map((font) => (
          <SelectItem key={font.value} value={font.value}>
            {font.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
