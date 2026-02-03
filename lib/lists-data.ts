export interface ListItem {
  image: string
  name: string
  neighborhood: string
  rating: number
  slug?: string
}

export interface FoodList {
  id: string
  title: string
  description: string
  coverImage: string
  itemCount: number
  city: string
  items: ListItem[]
}

export const foodLists: FoodList[] = [
  {
    id: "favorite-bars-dc",
    title: "Favorite Bars in DC",
    description: "The coziest spots for cocktails and good vibes in the nation's capital",
    coverImage: "/images/pasta.jpg",
    itemCount: 8,
    city: "Washington DC",
    items: [
      { image: "/images/pasta.jpg", name: "The Gibson", neighborhood: "U Street", rating: 9.1 },
      { image: "/images/ramen.jpg", name: "Columbia Room", neighborhood: "Shaw", rating: 9.4 },
      { image: "/images/sushi.jpg", name: "Bar Charley", neighborhood: "Adams Morgan", rating: 8.7 },
      { image: "/images/brunch.jpg", name: "Service Bar", neighborhood: "U Street", rating: 8.5 },
    ],
  },
  {
    id: "best-restaurants-nyc",
    title: "Best Restaurants in NYC",
    description: "My absolute favorite places to eat in the city that never sleeps",
    coverImage: "/images/sushi.jpg",
    itemCount: 12,
    city: "New York City",
    items: [
      { image: "/images/sushi.jpg", name: "Sakura Omakase", neighborhood: "Midtown", rating: 9.5, slug: "sakura-omakase-sushi" },
      { image: "/images/pasta.jpg", name: "La Dolce Vita", neighborhood: "Downtown", rating: 9.2, slug: "la-dolce-vita-truffle-pasta" },
      { image: "/images/ramen.jpg", name: "Tonkotsu Corner", neighborhood: "East Village", rating: 8.7, slug: "tonkotsu-corner-ramen" },
      { image: "/images/dessert.jpg", name: "Patisserie Rose", neighborhood: "SoHo", rating: 9.0, slug: "patisserie-rose-desserts" },
    ],
  },
  {
    id: "date-night-dc",
    title: "Best Date Night Spots in DC",
    description: "Romantic restaurants perfect for a special evening out",
    coverImage: "/images/dessert.jpg",
    itemCount: 6,
    city: "Washington DC",
    items: [
      { image: "/images/dessert.jpg", name: "Le Diplomate", neighborhood: "14th Street", rating: 9.3 },
      { image: "/images/pasta.jpg", name: "Fiola Mare", neighborhood: "Georgetown", rating: 9.1 },
      { image: "/images/sushi.jpg", name: "Sushi Taro", neighborhood: "Dupont Circle", rating: 8.9 },
      { image: "/images/brunch.jpg", name: "Iron Gate", neighborhood: "Dupont Circle", rating: 8.8 },
    ],
  },
  {
    id: "brunch-spots-dc",
    title: "Brunch Spots in DC",
    description: "Where to find the fluffiest pancakes and best mimosas",
    coverImage: "/images/brunch.jpg",
    itemCount: 10,
    city: "Washington DC",
    items: [
      { image: "/images/brunch.jpg", name: "The Morning Bloom", neighborhood: "Georgetown", rating: 8.4, slug: "morning-bloom-brunch" },
      { image: "/images/dessert.jpg", name: "Unconventional Diner", neighborhood: "Shaw", rating: 8.6 },
      { image: "/images/pasta.jpg", name: "Founding Farmers", neighborhood: "Foggy Bottom", rating: 8.2 },
      { image: "/images/tacos.jpg", name: "Ted's Bulletin", neighborhood: "Capitol Hill", rating: 8.0 },
    ],
  },
  {
    id: "hidden-gems-nyc",
    title: "Hidden Gems in NYC",
    description: "Under-the-radar spots that locals don't want you to know about",
    coverImage: "/images/tacos.jpg",
    itemCount: 7,
    city: "New York City",
    items: [
      { image: "/images/tacos.jpg", name: "Casa Del Sol", neighborhood: "East Side", rating: 8.8, slug: "casa-del-sol-tacos" },
      { image: "/images/ramen.jpg", name: "Noodle Haven", neighborhood: "Chinatown", rating: 8.5 },
      { image: "/images/sushi.jpg", name: "Tiny's", neighborhood: "Tribeca", rating: 8.7 },
      { image: "/images/pasta.jpg", name: "Lilia", neighborhood: "Williamsburg", rating: 9.2 },
    ],
  },
  {
    id: "late-night-eats-dc",
    title: "Late Night Eats in DC",
    description: "The best places to grab a bite after midnight",
    coverImage: "/images/ramen.jpg",
    itemCount: 5,
    city: "Washington DC",
    items: [
      { image: "/images/ramen.jpg", name: "Daikaya", neighborhood: "Chinatown", rating: 8.6 },
      { image: "/images/tacos.jpg", name: "Taqueria Habanero", neighborhood: "Columbia Heights", rating: 8.3 },
      { image: "/images/brunch.jpg", name: "The Diner", neighborhood: "Adams Morgan", rating: 7.9 },
      { image: "/images/pasta.jpg", name: "Afterwords Cafe", neighborhood: "Dupont Circle", rating: 8.1 },
    ],
  },
]
