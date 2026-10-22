"use client"

import * as React from "react"

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
    <script
      dangerouslySetInnerHTML={{
        __html: `document.documentElement.setAttribute("${attribute}","");if(window.self===window.top)document.documentElement.setAttribute("${standalone}","")`,
      }}
    />
  )
}

export { PreviewDocument }
