import { IconAlertTriangle } from "@tabler/icons-react"

import {
  Alert,
  AlertClose,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export function AlertRtl() {
  return (
    <div dir="rtl" className="w-full max-w-lg">
      <Alert variant="warning">
        <IconAlertTriangle />
        <AlertTitle>تنتهي الفترة التجريبية خلال 3 أيام</AlertTitle>
        <AlertDescription>
          أضف طريقة دفع لإبقاء مساحة العمل نشطة.
        </AlertDescription>
        <AlertClose />
      </Alert>
    </div>
  )
}
