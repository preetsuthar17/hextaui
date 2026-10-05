import { Checkbox } from "@/components/ui/checkbox"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"

const plans = [
  {
    id: "analytics",
    title: "Analytics",
    description: "Page views and funnels",
  },
  { id: "backups", title: "Daily backups", description: "Kept for 30 days" },
  { id: "sso", title: "Single sign-on", description: "SAML and OIDC" },
]

export function ItemSelectable() {
  return (
    <ItemGroup className="max-w-sm">
      {plans.map((plan, index) => (
        <Item key={plan.id} variant="outline" size="sm" render={<label />}>
          <Checkbox
            name="addons"
            value={plan.id}
            defaultChecked={index === 0}
          />
          <ItemContent>
            <ItemTitle>{plan.title}</ItemTitle>
            <ItemDescription>{plan.description}</ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
  )
}
