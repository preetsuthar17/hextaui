import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/components/ui/native-select"

export function NativeSelectGroups() {
  return (
    <NativeSelect aria-label="Department">
      <NativeSelectOption value="">Select department</NativeSelectOption>
      <NativeSelectOptGroup label="Engineering">
        <NativeSelectOption value="frontend">Frontend</NativeSelectOption>
        <NativeSelectOption value="backend">Backend</NativeSelectOption>
        <NativeSelectOption value="devops">DevOps</NativeSelectOption>
      </NativeSelectOptGroup>
      <NativeSelectOptGroup label="Design">
        <NativeSelectOption value="product">Product design</NativeSelectOption>
        <NativeSelectOption value="brand">Brand</NativeSelectOption>
      </NativeSelectOptGroup>
      <NativeSelectOptGroup label="Operations">
        <NativeSelectOption value="support">
          Customer support
        </NativeSelectOption>
        <NativeSelectOption value="people">People</NativeSelectOption>
      </NativeSelectOptGroup>
    </NativeSelect>
  )
}
