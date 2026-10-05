import { Spinner } from "@/components/ui/spinner"

export function SpinnerDemo() {
  return (
    <div className="flex items-center gap-10">
      <Spinner size="xl" />
      <Spinner size="xl" variant="ring" />
    </div>
  )
}
