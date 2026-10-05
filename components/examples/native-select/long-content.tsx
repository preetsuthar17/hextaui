import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"

export function NativeSelectLongContent() {
  return (
    <div className="w-56 max-w-full">
      <NativeSelect
        aria-label="Billing account"
        defaultValue="long"
        className="w-full"
      >
        <NativeSelectOption value="short">Personal</NativeSelectOption>
        <NativeSelectOption value="long">
          The International Subsidiary Billing Account for Europe and Asia
        </NativeSelectOption>
      </NativeSelect>
    </div>
  )
}
