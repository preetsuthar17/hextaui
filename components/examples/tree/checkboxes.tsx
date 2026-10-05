"use client"

import * as React from "react"

import { Tree, TreeGroup, TreeItem, TreeItemLabel } from "@/components/ui/tree"

const permissions = [
  {
    value: "projects",
    label: "Projects",
    children: [
      { value: "projects.view", label: "View projects" },
      { value: "projects.edit", label: "Edit projects" },
      { value: "projects.delete", label: "Delete projects" },
    ],
  },
  {
    value: "members",
    label: "Members",
    children: [
      { value: "members.invite", label: "Invite members" },
      { value: "members.remove", label: "Remove members" },
    ],
  },
  {
    value: "billing",
    label: "Billing",
    children: [
      { value: "billing.invoices", label: "View invoices" },
      { value: "billing.plan", label: "Change plan", disabled: true },
    ],
  },
]

const leaves = permissions.flatMap((group) => group.children)

export function TreeCheckboxes() {
  const [checked, setChecked] = React.useState<string[]>([
    "projects.view",
    "members.invite",
    "members.remove",
  ])
  const count = leaves.filter((leaf) => checked.includes(leaf.value)).length

  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <Tree
        aria-label="Permissions"
        checkboxes
        checkedValues={checked}
        onCheckedValuesChange={setChecked}
        defaultExpandedValues={["projects", "billing"]}
      >
        {permissions.map((group) => (
          <TreeItem key={group.value} value={group.value}>
            <TreeItemLabel>{group.label}</TreeItemLabel>
            <TreeGroup>
              {group.children.map((permission) => (
                <TreeItem
                  key={permission.value}
                  value={permission.value}
                  disabled={"disabled" in permission}
                >
                  <TreeItemLabel
                    meta={"disabled" in permission ? "Owner only" : null}
                  >
                    {permission.label}
                  </TreeItemLabel>
                </TreeItem>
              ))}
            </TreeGroup>
          </TreeItem>
        ))}
      </Tree>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {count} of {leaves.length} permissions granted
      </p>
    </div>
  )
}
