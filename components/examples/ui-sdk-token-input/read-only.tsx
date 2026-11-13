import {
  TokenInput,
  TokenInputEditor,
  type TokenInputValue,
} from "@/components/ui/ui-sdk-token-input"

const draft: TokenInputValue = [
  "Summarize ",
  { type: "file", value: "README.md", label: "README.md" },
  " for the release notes.",
]

function UiSdkTokenInputReadOnly() {
  return (
    <div className="w-full max-w-md">
      <TokenInput readOnly defaultValue={draft}>
        <TokenInputEditor aria-label="Prompt" />
      </TokenInput>
    </div>
  )
}

export { UiSdkTokenInputReadOnly }
