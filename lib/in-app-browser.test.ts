import { describe, expect, it } from "vitest"

import { androidIntentUrl, detectInAppBrowser } from "@/lib/in-app-browser"

const iosWebKit =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/22E240"
const androidWebView =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8 Build/AP2A.240905.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/129.0.6668.100 Mobile Safari/537.36"

const inApp: [string, string, "ios" | "android"][] = [
  ["X", `${iosWebKit} Twitter for iPhone/12.26`, "ios"],
  ["X", `${androidWebView} TwitterAndroid/12.28.0-alpha.01`, "android"],
  [
    "Instagram",
    `${iosWebKit} Instagram 337.0.3.23.54 (iPhone14,5; iOS 18_4; en_US; en; scale=3.00; 1170x2532; 615497008)`,
    "ios",
  ],
  [
    "Instagram",
    `${androidWebView} Instagram 337.0.0.35.102 Android (34/14; 420dpi; 1080x2400; Google; Pixel 8; shiba; shiba; en_US; 615496998)`,
    "android",
  ],
  ["Threads", `${iosWebKit} Barcelona 289.0.0.77.109`, "ios"],
  [
    "Facebook",
    `${iosWebKit} [FBAN/FBIOS;FBAV/466.0.0.37.108;FBBV/609133296;FBDV/iPhone14,5;FBMD/iPhone;FBSN/iOS;FBSV/18.4;FBSS/3;FBID/phone;FBLC/en_US;FBOP/5;FBRV/0]`,
    "ios",
  ],
  [
    "Facebook",
    `${androidWebView} [FB_IAB/FB4A;FBAV/470.0.0.43.109;]`,
    "android",
  ],
  [
    "Messenger",
    `${iosWebKit} [FBAN/MessengerForiOS;FBAV/470.0.0.37.104;FBBV/612345678]`,
    "ios",
  ],
  ["LinkedIn", `${iosWebKit} [LinkedInApp]/9.30.1630`, "ios"],
  [
    "TikTok",
    `${iosWebKit} musical_ly_34.1.0 JsSdk/2.0 NetType/WIFI Channel/App Store ByteLocale/en Region/US`,
    "ios",
  ],
  [
    "TikTok",
    `${androidWebView} trill_340102 BytedanceWebview/d8a21c6`,
    "android",
  ],
  [
    "Snapchat",
    `${iosWebKit} Snapchat/13.10.0.40 (like Safari/8618.1.15.10.15)`,
    "ios",
  ],
  [
    "WeChat",
    `${iosWebKit} MicroMessenger/8.0.50(0x1800322d) NetType/WIFI Language/en`,
    "ios",
  ],
]

describe("detectInAppBrowser", () => {
  it.each(inApp)("detects %s (%s)", (app, userAgent, platform) => {
    expect(detectInAppBrowser(userAgent)).toEqual({ app, platform })
  })

  it("flags unnamed embedded web views", () => {
    expect(detectInAppBrowser(androidWebView)).toEqual({
      app: null,
      platform: "android",
    })
    expect(detectInAppBrowser(iosWebKit)).toEqual({
      app: null,
      platform: "ios",
    })
  })

  it.each([
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.4 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/129.0.6668.69 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/26.0 Chrome/122.0.0.0 Mobile Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.4 Safari/605.1.15",
  ])("leaves real browsers alone: %s", (userAgent) => {
    expect(detectInAppBrowser(userAgent)).toBeNull()
  })
})

describe("androidIntentUrl", () => {
  it("opens the same https page in the default browser, without the hash", () => {
    const intent = androidIntentUrl(
      "https://hextaui.com/account?claim=abc&payment_id=pay_1#top"
    )
    expect(intent).toBe(
      "intent://hextaui.com/account?claim=abc&payment_id=pay_1#Intent;scheme=https;action=android.intent.action.VIEW;S.browser_fallback_url=https%3A%2F%2Fhextaui.com%2Faccount%3Fclaim%3Dabc%26payment_id%3Dpay_1;end"
    )
  })

  it("only handles https pages", () => {
    expect(androidIntentUrl("http://localhost:3000/pricing")).toBeNull()
  })
})
