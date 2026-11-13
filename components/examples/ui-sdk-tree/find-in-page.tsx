import { Tree, type TreeItemData } from "@/components/ui/ui-sdk-tree"

const items: TreeItemData[] = [
  {
    value: "planets",
    label: "Planets",
    children: [
      { value: "mercury", label: "Mercury" },
      { value: "venus", label: "Venus" },
      {
        value: "earth",
        label: "Earth",
        children: [{ value: "moon", label: "The Moon" }],
      },
      {
        value: "mars",
        label: "Mars",
        children: [
          { value: "phobos", label: "Phobos" },
          { value: "deimos", label: "Deimos" },
        ],
      },
    ],
  },
  {
    value: "dwarf-planets",
    label: "Dwarf planets",
    children: [
      { value: "ceres", label: "Ceres" },
      {
        value: "pluto",
        label: "Pluto",
        children: [{ value: "charon", label: "Charon" }],
      },
    ],
  },
]

function UiSdkTreeFindInPage() {
  return (
    <Tree
      aria-label="Solar system"
      items={items}
      hiddenUntilFound
      className="max-w-xs"
    />
  )
}

export { UiSdkTreeFindInPage }
