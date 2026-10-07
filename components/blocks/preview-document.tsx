"use client"

import * as React from "react"

const attribute = "data-preview-document"

function PreviewDocument() {
  React.useLayoutEffect(() => {
    document.documentElement.setAttribute(attribute, "")
    return () => document.documentElement.removeAttribute(attribute)
  }, [])

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `document.documentElement.setAttribute("${attribute}","")`,
      }}
    />
  )
}

export { PreviewDocument }
