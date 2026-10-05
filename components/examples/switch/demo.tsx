import { Switch } from "@/components/ui/switch"

const settings = [
  {
    id: "wifi",
    title: "Wi-Fi",
    description: "Join known networks automatically.",
    on: true,
  },
  {
    id: "bluetooth",
    title: "Bluetooth",
    description: "Connect to headphones and keyboards.",
    on: false,
  },
  {
    id: "airdrop",
    title: "Nearby sharing",
    description: "Let people around you send files.",
    on: true,
  },
]

export function SwitchDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col divide-y rounded-xl border">
      {settings.map((setting) => (
        <label
          key={setting.id}
          className="flex items-center justify-between gap-4 p-4 text-sm"
        >
          <span className="flex flex-col gap-0.5">
            <span className="font-medium">{setting.title}</span>
            <span className="text-muted-foreground">{setting.description}</span>
          </span>
          <Switch defaultChecked={setting.on} />
        </label>
      ))}
    </div>
  )
}
