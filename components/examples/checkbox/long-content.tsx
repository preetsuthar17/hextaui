import { Checkbox } from "@/components/ui/checkbox"

export function CheckboxLongContent() {
  return (
    <label className="flex w-64 max-w-full items-start gap-3 text-sm">
      <span className="flex h-5 items-center">
        <Checkbox />
      </span>
      <span className="flex min-w-0 flex-col gap-0.5 wrap-anywhere">
        <span className="leading-5 font-medium">
          A label long enough to wrap onto a second and even a third line in a
          narrow container
        </span>
        <span className="text-muted-foreground">
          averyveryverylongunbrokenstringthatwouldotherwiseescapeitscontainer
        </span>
      </span>
    </label>
  )
}
