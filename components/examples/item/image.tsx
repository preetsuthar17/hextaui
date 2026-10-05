import {
  Item,
  ItemChevron,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

const albums = [
  {
    title: "Night Drive",
    artist: "Lune Avenue",
    src: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=120&h=120&fit=crop",
  },
  {
    title: "Paper Gardens",
    artist: "Mara Lin",
    src: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=120&h=120&fit=crop",
  },
  {
    title: "Low Tide",
    artist: "The Harbour",
    src: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=120&h=120&fit=crop",
  },
]

export function ItemImage() {
  return (
    <ItemGroup className="max-w-sm">
      {albums.map((album) => (
        <Item key={album.title} size="sm" render={<a href="#" />}>
          <ItemMedia variant="image">
            <img src={album.src} alt="" width={40} height={40} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{album.title}</ItemTitle>
            <ItemDescription>{album.artist}</ItemDescription>
          </ItemContent>
          <ItemChevron />
        </Item>
      ))}
    </ItemGroup>
  )
}
