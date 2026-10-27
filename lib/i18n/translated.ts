import { getRequestLocale } from "@/lib/i18n/request"

function markTranslated(text: string) {
  getRequestLocale().translated.add(text.replace(/\s+/g, " ").trim())
  return text
}

export { markTranslated }
