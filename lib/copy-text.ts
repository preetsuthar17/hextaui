async function copyText(text: string, input?: HTMLInputElement | null) {
  try {
    await navigator.clipboard.writeText(text)
    return
  } catch {}
  const field = input ?? document.createElement("textarea")
  if (!input) {
    field.value = text
    field.readOnly = true
    field.style.position = "fixed"
    field.style.opacity = "0"
    field.style.fontSize = "16px"
    field.style.pointerEvents = "none"
    document.body.append(field)
  }
  field.focus({ preventScroll: true })
  field.select()
  const copied = document.execCommand("copy")
  if (!input) field.remove()
  if (!copied) throw new Error("Copy failed")
}

export { copyText }
