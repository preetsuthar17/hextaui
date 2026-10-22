"use client"

import * as React from "react"

import { InlineScript } from "@/components/site/inline-script"

const attribute = "data-preview-document"
const standalone = "data-preview-standalone"

function PreviewDocument() {
  React.useLayoutEffect(() => {
    const root = document.documentElement
    root.setAttribute(attribute, "")
    root.toggleAttribute(standalone, window.self === window.top)
    return () => {
      root.removeAttribute(attribute)
      root.removeAttribute(standalone)
    }
  }, [])

  return (
    <InlineScript
      html={`document.documentElement.setAttribute("${attribute}","");if(window.self===window.top)document.documentElement.setAttribute("${standalone}","");if(window.self!==window.top&&new URLSearchParams(location.search).has("tile"))HTMLElement.prototype.focus=function(){}`}
    />
  )
}

export { PreviewDocument }
