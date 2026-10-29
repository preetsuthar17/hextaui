type Platform = "ios" | "android" | "other"

type InAppBrowser = {
  app: string | null
  platform: Platform
}

const apps: [name: string, pattern: RegExp][] = [
  ["X", /\bTwitter(?:Android| for iP(?:hone|ad))?\b/i],
  ["Threads", /\bBarcelona\b/],
  ["Instagram", /\bInstagram\b/i],
  ["Messenger", /\bMessenger(?:ForiOS|Lite)?\b|\bOrca-Android\b/i],
  ["Facebook", /\bFBAN\/|\bFBAV\/|\bFB_IAB\/|\bFBIOS\b|\bFB4A\b/],
  ["LinkedIn", /\bLinkedInApp\b/i],
  ["TikTok", /musical_ly|BytedanceWebview|\bTikTok\b|\btrill_\d/i],
  ["Snapchat", /\bSnapchat\b/i],
  ["Pinterest", /\bPinterest\b/i],
  ["LINE", /\bLine\/\d/],
  ["WeChat", /\bMicroMessenger\b/i],
]

function platformOf(userAgent: string): Platform {
  if (/\bAndroid\b/i.test(userAgent)) return "android"
  if (/\b(iPhone|iPad|iPod)\b/.test(userAgent)) return "ios"
  return "other"
}

function detectInAppBrowser(userAgent: string): InAppBrowser | null {
  const platform = platformOf(userAgent)
  const match = apps.find(([, pattern]) => pattern.test(userAgent))
  if (match) return { app: match[0], platform }
  if (platform === "android" && /;\s*wv\)/.test(userAgent)) {
    return { app: null, platform }
  }
  if (
    platform === "ios" &&
    /AppleWebKit/.test(userAgent) &&
    !/Safari\//.test(userAgent)
  ) {
    return { app: null, platform }
  }
  return null
}

function currentInAppBrowser() {
  if (typeof navigator === "undefined") return null
  const standalone = (navigator as Navigator & { standalone?: boolean })
    .standalone
  if (standalone) return null
  return detectInAppBrowser(navigator.userAgent)
}

function androidIntentUrl(href: string) {
  const url = new URL(href)
  if (url.protocol !== "https:") return null
  url.hash = ""
  return `intent://${url.host}${url.pathname}${url.search}#Intent;scheme=https;action=android.intent.action.VIEW;S.browser_fallback_url=${encodeURIComponent(url.href)};end`
}

type InAppPromptPage = "pricing" | "block"

const promptDismissedKey = "hextaui-in-app-prompt-dismissed"
const promptQuietDays = 7

function inAppPromptPage(pathname: string): InAppPromptPage | null {
  const path = pathname.replace(/\/$/, "")
  if (path === "/pricing") return "pricing"
  if (/^\/blocks\/[^/.]+$/.test(path)) return "block"
  return null
}

function promptDismissedRecently(value: string | null, now: number) {
  const at = Number(value)
  if (!value || !Number.isFinite(at)) return false
  return now - at < promptQuietDays * 24 * 60 * 60 * 1000 && at <= now
}

export {
  androidIntentUrl,
  currentInAppBrowser,
  detectInAppBrowser,
  inAppPromptPage,
  promptDismissedKey,
  promptDismissedRecently,
  type InAppBrowser,
  type InAppPromptPage,
}
