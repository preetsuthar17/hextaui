import {
  RadioGroup,
  RadioGroupCard,
  RadioGroupCardDescription,
  RadioGroupCardTitle,
} from "@/components/ui/radio-group"

export function RadioGroupRtl() {
  return (
    <div dir="rtl" className="w-full max-w-sm">
      <RadioGroup variant="card" aria-label="طريقة الدفع" defaultValue="card">
        <RadioGroupCard value="card">
          <RadioGroupCardTitle>بطاقة ائتمان</RadioGroupCardTitle>
          <RadioGroupCardDescription>
            فيزا أو ماستركارد.
          </RadioGroupCardDescription>
        </RadioGroupCard>
        <RadioGroupCard value="cash">
          <RadioGroupCardTitle>الدفع عند الاستلام</RadioGroupCardTitle>
          <RadioGroupCardDescription>
            ادفع نقدًا عند التوصيل.
          </RadioGroupCardDescription>
        </RadioGroupCard>
      </RadioGroup>
    </div>
  )
}
