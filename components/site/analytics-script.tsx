"use client"

import * as React from "react"
import Script from "next/script"

import {
  minilyticsSettled,
  minilyticsSrc,
  minilyticsWebsiteId,
} from "@/lib/minilytics"

const noop = () => () => {}

function AnalyticsScript() {
  const topLevel = React.useSyncExternalStore(
    noop,
    () => window.self === window.top,
    () => false
  )

  return topLevel ? (
    <>
      <Script
        defer
        data-website-id={minilyticsWebsiteId}
        src={minilyticsSrc}
        strategy="afterInteractive"
        onLoad={minilyticsSettled}
        onError={minilyticsSettled}
      />
      <Script
        src="https://assets.onedollarstats.com/stonks.js"
        strategy="lazyOnload"
      />
    </>
  ) : null
}

export { AnalyticsScript }
