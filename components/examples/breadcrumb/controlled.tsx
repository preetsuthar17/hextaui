"use client"

import * as React from "react"

import {
  Breadcrumb,
  BreadcrumbCollapse,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"

export function BreadcrumbControlled() {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex flex-col items-center gap-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbCollapse open={open} onOpenChange={setOpen}>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Documents</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">2026</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </BreadcrumbCollapse>
          <BreadcrumbItem>
            <BreadcrumbPage>Invoices</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Button variant="outline" size="sm" onClick={() => setOpen(!open)}>
        {open ? "Collapse" : "Expand"}
      </Button>
    </div>
  )
}
