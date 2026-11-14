import { Label } from "@/components/ui/label"
import { DateInput } from "@/components/ui/ui-sdk-date-input"

const locales = [
  { locale: "en-GB", label: "Date (en-GB)" },
  { locale: "de-DE", label: "Datum (de-DE)" },
  { locale: "ja-JP", label: "日付 (ja-JP)" },
]

function UiSdkDateInputLocale() {
  return (
    <div className="flex w-full max-w-44 flex-col gap-4">
      {locales.map(({ locale, label }) => (
        <div key={locale} lang={locale} className="flex flex-col gap-2">
          <Label id={`date-${locale}`}>{label}</Label>
          <DateInput
            aria-labelledby={`date-${locale}`}
            locale={locale}
            defaultValue="2026-11-02"
          />
        </div>
      ))}
    </div>
  )
}

export { UiSdkDateInputLocale }
