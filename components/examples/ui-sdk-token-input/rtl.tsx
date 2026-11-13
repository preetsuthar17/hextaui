import {
  TokenInput,
  TokenInputEditor,
  type TokenInputValue,
} from "@/components/ui/ui-sdk-token-input"

const draft: TokenInputValue = [
  "اشرح ",
  { type: "file", value: "src/routes.ts", label: "routes.ts" },
  " في جملتين.",
]

function UiSdkTokenInputRtl() {
  return (
    <div dir="rtl" className="w-full max-w-md">
      <TokenInput defaultValue={draft}>
        <TokenInputEditor aria-label="الطلب" />
      </TokenInput>
    </div>
  )
}

export { UiSdkTokenInputRtl }
