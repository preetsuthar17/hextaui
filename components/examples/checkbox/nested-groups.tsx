"use client"

import * as React from "react"

import { Checkbox, CheckboxGroup } from "@/components/ui/checkbox"

const userPermissions = ["users.read", "users.write", "users.delete"]
const billingPermissions = ["billing.read", "billing.write"]

export function CheckboxNestedGroups() {
  const [users, setUsers] = React.useState<string[]>(["users.read"])
  const [billing, setBilling] = React.useState<string[]>([])

  return (
    <div className="text-sm">
      <CheckboxGroup
        aria-label="Permissions"
        value={[...users, ...billing]}
        onValueChange={(next) => {
          setUsers(next.filter((value) => value.startsWith("users.")))
          setBilling(next.filter((value) => value.startsWith("billing.")))
        }}
        allValues={[...userPermissions, ...billingPermissions]}
      >
        <label className="flex items-center gap-3">
          <Checkbox parent />
          All permissions
        </label>
        <div className="flex flex-col gap-3 ps-7">
          <CheckboxGroup
            aria-label="Users"
            value={users}
            onValueChange={setUsers}
            allValues={userPermissions}
          >
            <label className="flex items-center gap-3">
              <Checkbox parent />
              Users
            </label>
            <div className="flex flex-col gap-3 ps-7">
              {userPermissions.map((permission) => (
                <label key={permission} className="flex items-center gap-3">
                  <Checkbox value={permission} />
                  {permission}
                </label>
              ))}
            </div>
          </CheckboxGroup>
          <CheckboxGroup
            aria-label="Billing"
            value={billing}
            onValueChange={setBilling}
            allValues={billingPermissions}
          >
            <label className="flex items-center gap-3">
              <Checkbox parent />
              Billing
            </label>
            <div className="flex flex-col gap-3 ps-7">
              {billingPermissions.map((permission) => (
                <label key={permission} className="flex items-center gap-3">
                  <Checkbox value={permission} />
                  {permission}
                </label>
              ))}
            </div>
          </CheckboxGroup>
        </div>
      </CheckboxGroup>
    </div>
  )
}
