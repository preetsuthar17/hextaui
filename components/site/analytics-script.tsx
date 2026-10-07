"use client"

import * as React from "react"
import Script from "next/script"

const noop = () => () => {}

function AnalyticsScript() {
  const topLevel = React.useSyncExternalStore(
    noop,
    () => window.self === window.top,
    () => false
  )

  return topLevel ? (
    <Script
      src="https://assets.onedollarstats.com/stonks.js"
      strategy="lazyOnload"
    />
  ) : null
}

export { AnalyticsScript }
