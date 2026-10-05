import { Checkbox } from "@/components/ui/checkbox"

export function CheckboxSiblingLabel() {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Checkbox id="terms" nativeButton render={<button />} />
      <label htmlFor="terms">Accept terms and conditions</label>
    </div>
  )
}
