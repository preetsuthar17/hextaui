import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"

export function NativeSelectDisabled() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <NativeSelect aria-label="Region" disabled defaultValue="eu">
        <NativeSelectOption value="us">United States</NativeSelectOption>
        <NativeSelectOption value="eu">Europe</NativeSelectOption>
      </NativeSelect>
      <NativeSelect aria-label="Plan" defaultValue="pro">
        <NativeSelectOption value="hobby">Hobby</NativeSelectOption>
        <NativeSelectOption value="pro">Pro</NativeSelectOption>
        <NativeSelectOption value="enterprise" disabled>
          Enterprise (contact sales)
        </NativeSelectOption>
      </NativeSelect>
    </div>
  )
}
