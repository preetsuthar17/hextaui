import { Label } from "@/components/ui/label"
import { TimeInput } from "@/components/ui/ui-sdk-time-input"

const locales = [
  { locale: "en-US", label: "Time (en-US)" },
  { locale: "de-DE", label: "Uhrzeit (de-DE)" },
  { locale: "ja-JP", label: "時刻 (ja-JP)" },
  { locale: "ko-KR", label: "시간 (ko-KR)" },
]

function UiSdkTimeInputLocale() {
  return (
    <div className="flex w-full max-w-40 flex-col gap-4">
      {locales.map(({ locale, label }) => (
        <div key={locale} lang={locale} className="flex flex-col gap-2">
          <Label id={`time-${locale}`}>{label}</Label>
          <TimeInput
            aria-labelledby={`time-${locale}`}
            locale={locale}
            defaultValue="18:45"
          />
        </div>
      ))}
    </div>
  )
}

export { UiSdkTimeInputLocale }
