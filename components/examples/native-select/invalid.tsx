import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"

export function NativeSelectInvalid() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <NativeSelect
        aria-label="Country"
        aria-invalid
        aria-describedby="native-select-invalid-message"
        className="w-full"
      >
        <NativeSelectOption value="">Select a country</NativeSelectOption>
        <NativeSelectOption value="in">India</NativeSelectOption>
        <NativeSelectOption value="de">Germany</NativeSelectOption>
      </NativeSelect>
      <p
        id="native-select-invalid-message"
        className="text-sm text-destructive"
      >
        We don&apos;t ship to the selected region yet.
      </p>
    </div>
  )
}
