import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"

export function NativeSelectRtl() {
  return (
    <div dir="rtl">
      <NativeSelect aria-label="اللغة">
        <NativeSelectOption value="">اختر لغة</NativeSelectOption>
        <NativeSelectOption value="ar">العربية</NativeSelectOption>
        <NativeSelectOption value="en">الإنجليزية</NativeSelectOption>
        <NativeSelectOption value="fr">الفرنسية</NativeSelectOption>
      </NativeSelect>
    </div>
  )
}
