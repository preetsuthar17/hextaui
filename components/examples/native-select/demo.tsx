import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"

export function NativeSelectDemo() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="native-select-demo-name">Project name</Label>
        <Input id="native-select-demo-name" defaultValue="HextaUI" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="native-select-demo-framework">Framework</Label>
        <NativeSelect id="native-select-demo-framework" className="w-full">
          <NativeSelectOption value="">Select a framework</NativeSelectOption>
          <NativeSelectOption value="next">Next.js</NativeSelectOption>
          <NativeSelectOption value="remix">Remix</NativeSelectOption>
          <NativeSelectOption value="astro">Astro</NativeSelectOption>
          <NativeSelectOption value="vite">Vite</NativeSelectOption>
        </NativeSelect>
      </div>
    </div>
  )
}
