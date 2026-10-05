import {
  Progress,
  ProgressCircle,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"

const files = [
  {
    name: "quarterly-report-final-v3-approved-by-legal-and-finance.pdf",
    value: 64,
  },
  { name: "IMG_20260914_183022_HDR_edited_export.jpg", value: 100 },
  { name: "brand-assets.zip", value: 12 },
]

export function ProgressFiles() {
  return (
    <ul className="flex w-full max-w-sm flex-col gap-5">
      {files.map((file) => (
        <li key={file.name} className="flex items-start gap-3">
          <ProgressCircle value={file.value} aria-label={file.name} />
          <div className="min-w-0 flex-1">
            <Progress value={file.value} size="sm">
              <ProgressLabel>{file.name}</ProgressLabel>
              <ProgressValue />
            </Progress>
          </div>
        </li>
      ))}
    </ul>
  )
}
