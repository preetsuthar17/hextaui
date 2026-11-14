import { Label } from "@/components/ui/label"
import { TimeInput } from "@/components/ui/ui-sdk-time-input"

function UiSdkTimeInputClock() {
  return (
    <div className="flex w-full max-w-40 flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label id="clock-12">12-hour clock</Label>
        <TimeInput
          aria-labelledby="clock-12"
          hourCycle={12}
          defaultValue="18:45"
          locale="en-US"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label id="clock-24">24-hour clock</Label>
        <TimeInput
          aria-labelledby="clock-24"
          hourCycle={24}
          defaultValue="18:45"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label id="clock-seconds">With seconds</Label>
        <TimeInput
          aria-labelledby="clock-seconds"
          granularity="second"
          hourCycle={24}
          defaultValue="18:45:30"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label id="clock-hour">Hour only</Label>
        <TimeInput
          aria-labelledby="clock-hour"
          granularity="hour"
          hourCycle={24}
          defaultValue="18:00"
        />
      </div>
    </div>
  )
}

export { UiSdkTimeInputClock }
