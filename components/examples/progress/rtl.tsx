import {
  Progress,
  ProgressCircle,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"

export function ProgressRtl() {
  return (
    <div dir="rtl" className="flex w-full max-w-sm flex-col gap-6">
      <Progress value={65} locale="ar-EG">
        <ProgressLabel>جارٍ التحميل</ProgressLabel>
        <ProgressValue />
      </Progress>
      <Progress value={null}>
        <ProgressLabel>جارٍ الاتصال…</ProgressLabel>
      </Progress>
      <ProgressCircle value={65} size="xl" locale="ar-EG" aria-label="التقدم">
        <ProgressValue />
      </ProgressCircle>
    </div>
  )
}
